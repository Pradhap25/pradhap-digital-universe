import { getSupabaseClient } from '@/integrations/supabase/client';
import { isSupabaseConfigured } from '@/integrations/supabase/env';
import type {
  AchievementItem,
  CertificationItem,
  CmsCollectionKey,
  EducationItem,
  EnquiryItem,
  EnquiryPayload,
  EnquiryStatus,
  ExperienceItem,
  InterestItem,
  LeadershipItem,
  MediaAsset,
  MediaCategory,
  PortfolioData,
  ProjectItem,
  ResearchItem,
  SiteProfile,
  SkillItem,
} from '@/types/portfolio';
import { buildInterestGroups, portfolioSeedData } from './seedData';

const STORAGE_PORTFOLIO_KEY = 'pdu_cms_portfolio_v1';
const STORAGE_ENQUIRIES_KEY = 'pdu_cms_enquiries_v1';
const STORAGE_MEDIA_KEY = 'pdu_cms_media_v1';
const STORAGE_LOCAL_SESSION_KEY = 'pdu_local_admin_session_v1';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_UPLOAD_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_MIME_TYPES = new Set([
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/svg+xml',
  'application/pdf',
]);

export type CmsStorageMode = 'supabase' | 'local-cms';

export interface AdminSessionInfo {
  authenticated: boolean;
  email: string | null;
  mode: CmsStorageMode;
}

type CollectionMap = {
  education: EducationItem;
  experiences: ExperienceItem;
  skills: SkillItem;
  interestItems: InterestItem;
  projects: ProjectItem;
  achievements: AchievementItem;
  certifications: CertificationItem;
  research: ResearchItem;
  leadership: LeadershipItem;
};

const SUPABASE_TABLE_MAP: Record<CmsCollectionKey, string> = {
  education: 'education',
  experiences: 'experiences',
  skills: 'skills',
  interestItems: 'interests',
  projects: 'projects',
  achievements: 'achievements',
  certifications: 'certifications',
  research: 'research_items',
  leadership: 'leadership',
};

function cloneSeed(): PortfolioData {
  return JSON.parse(JSON.stringify(portfolioSeedData)) as PortfolioData;
}

function readLocalPortfolio(): PortfolioData {
  try {
    const raw = localStorage.getItem(STORAGE_PORTFOLIO_KEY);
    if (!raw) return cloneSeed();
    const parsed = JSON.parse(raw) as Partial<PortfolioData>;
    const seed = cloneSeed();
    const interestItems = parsed.interestItems ?? seed.interestItems;
    return {
      ...seed,
      ...parsed,
      profile: { ...seed.profile, ...(parsed.profile ?? {}) },
      interestItems,
      interests: buildInterestGroups(interestItems),
    };
  } catch {
    return cloneSeed();
  }
}

function writeLocalPortfolio(data: PortfolioData): void {
  const normalized: PortfolioData = {
    ...data,
    interests: buildInterestGroups(data.interestItems),
  };
  localStorage.setItem(STORAGE_PORTFOLIO_KEY, JSON.stringify(normalized));
}

function readLocalEnquiries(): EnquiryItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_ENQUIRIES_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as EnquiryItem[];
  } catch {
    return [];
  }
}

function writeLocalEnquiries(items: EnquiryItem[]): void {
  localStorage.setItem(STORAGE_ENQUIRIES_KEY, JSON.stringify(items));
}

function readLocalMedia(): MediaAsset[] {
  try {
    const raw = localStorage.getItem(STORAGE_MEDIA_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as MediaAsset[];
  } catch {
    return [];
  }
}

function writeLocalMedia(items: MediaAsset[]): void {
  localStorage.setItem(STORAGE_MEDIA_KEY, JSON.stringify(items));
}

function filterPublished<T extends { isPublished: boolean; sortOrder: number }>(
  items: T[],
): T[] {
  return items
    .filter((item) => item.isPublished)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

function toPublicView(full: PortfolioData): PortfolioData {
  const publishedInterests = filterPublished(full.interestItems);
  return {
    ...full,
    education: filterPublished(full.education),
    experiences: filterPublished(full.experiences),
    skills: filterPublished(full.skills),
    interestItems: publishedInterests,
    interests: buildInterestGroups(publishedInterests),
    projects: filterPublished(full.projects),
    achievements: filterPublished(full.achievements),
    certifications: filterPublished(full.certifications),
    research: filterPublished(full.research),
    leadership: filterPublished(full.leadership),
  };
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Failed to read uploaded file.'));
    reader.readAsDataURL(file);
  });
}

function generateId(prefix: string): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
  }
  return `${prefix}-${Date.now().toString(36)}`;
}

function mapSupabaseRowToCamel<T>(row: Record<string, unknown>): T {
  const out: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(row)) {
    const camel = key.replace(/_([a-z])/g, (_, ch: string) => ch.toUpperCase());
    out[camel] = val;
  }
  return out as T;
}

function mapCamelToSupabaseRow(item: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(item)) {
    const snake = key.replace(/[A-Z]/g, (ch) => `_${ch.toLowerCase()}`);
    out[snake] = val === undefined ? null : val;
  }
  return out;
}

class PortfolioCmsRepository {
  private listeners = new Set<() => void>();

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (event) => {
        if (
          event.key === STORAGE_PORTFOLIO_KEY ||
          event.key === STORAGE_ENQUIRIES_KEY ||
          event.key === STORAGE_MEDIA_KEY
        ) {
          this.notify();
        }
      });
    }
  }

  getMode(): CmsStorageMode {
    return isSupabaseConfigured() ? 'supabase' : 'local-cms';
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    this.listeners.forEach((fn) => fn());
  }

  // =========================================================
  // PUBLIC & ADMIN PORTFOLIO READS
  // =========================================================

  async getPublicPortfolio(): Promise<PortfolioData> {
    const all = await this.getAdminPortfolio();
    return toPublicView(all);
  }

  async getAdminPortfolio(): Promise<PortfolioData> {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return readLocalPortfolio();
    }

    try {
      const [
        profileRes,
        eduRes,
        expRes,
        skillsRes,
        intRes,
        projRes,
        achRes,
        certRes,
        resRes,
        leadRes,
      ] = await Promise.all([
        supabase.from('site_profile').select('*').eq('id', 'primary').maybeSingle(),
        supabase.from('education').select('*').order('sort_order', { ascending: true }),
        supabase.from('experiences').select('*').order('sort_order', { ascending: true }),
        supabase.from('skills').select('*').order('sort_order', { ascending: true }),
        supabase.from('interests').select('*').order('sort_order', { ascending: true }),
        supabase.from('projects').select('*').order('sort_order', { ascending: true }),
        supabase.from('achievements').select('*').order('sort_order', { ascending: true }),
        supabase.from('certifications').select('*').order('sort_order', { ascending: true }),
        supabase.from('research_items').select('*').order('sort_order', { ascending: true }),
        supabase.from('leadership').select('*').order('sort_order', { ascending: true }),
      ]);

      const seed = cloneSeed();
      if (profileRes.error && !profileRes.data) {
        // Fallback smoothly if schema has not been seeded yet
        return readLocalPortfolio();
      }

      const profileRow = profileRes.data
        ? mapSupabaseRowToCamel<SiteProfile & { softSkills?: string[] }>(
            profileRes.data as Record<string, unknown>,
          )
        : seed.profile;

      const interestItems =
        intRes.data && intRes.data.length > 0
          ? intRes.data.map((r) => mapSupabaseRowToCamel<InterestItem>(r as Record<string, unknown>))
          : seed.interestItems;

      return {
        profile: { ...seed.profile, ...profileRow },
        education: eduRes.data?.length
          ? eduRes.data.map((r) => mapSupabaseRowToCamel<EducationItem>(r as Record<string, unknown>))
          : seed.education,
        experiences: expRes.data?.length
          ? expRes.data.map((r) => mapSupabaseRowToCamel<ExperienceItem>(r as Record<string, unknown>))
          : seed.experiences,
        skills: skillsRes.data?.length
          ? skillsRes.data.map((r) => mapSupabaseRowToCamel<SkillItem>(r as Record<string, unknown>))
          : seed.skills,
        interestItems,
        interests: buildInterestGroups(interestItems),
        projects: projRes.data?.length
          ? projRes.data.map((r) => mapSupabaseRowToCamel<ProjectItem>(r as Record<string, unknown>))
          : seed.projects,
        achievements: achRes.data?.length
          ? achRes.data.map((r) => mapSupabaseRowToCamel<AchievementItem>(r as Record<string, unknown>))
          : seed.achievements,
        certifications: certRes.data?.length
          ? certRes.data.map((r) => mapSupabaseRowToCamel<CertificationItem>(r as Record<string, unknown>))
          : seed.certifications,
        research: resRes.data?.length
          ? resRes.data.map((r) => mapSupabaseRowToCamel<ResearchItem>(r as Record<string, unknown>))
          : seed.research,
        leadership: leadRes.data?.length
          ? leadRes.data.map((r) => mapSupabaseRowToCamel<LeadershipItem>(r as Record<string, unknown>))
          : seed.leadership,
        softSkills:
          (profileRes.data as Record<string, unknown> | null)?.soft_skills as string[] ??
          seed.softSkills,
      };
    } catch {
      return readLocalPortfolio();
    }
  }

  // =========================================================
  // PROFILE / HERO / ABOUT / CONTACT UPDATES
  // =========================================================

  async updateProfile(patch: Partial<SiteProfile>, softSkills?: string[]): Promise<SiteProfile> {
    const current = await this.getAdminPortfolio();
    const updatedProfile: SiteProfile = {
      ...current.profile,
      ...patch,
      updatedAt: new Date().toISOString(),
    };

    const supabase = getSupabaseClient();
    if (supabase) {
      const row = mapCamelToSupabaseRow({
        id: 'primary',
        ...updatedProfile,
        softSkills: softSkills ?? current.softSkills,
      });
      const { error } = await supabase.from('site_profile').upsert(row as never);
      if (error) {
        throw new Error(error.message);
      }
    } else {
      writeLocalPortfolio({
        ...current,
        profile: updatedProfile,
        softSkills: softSkills ?? current.softSkills,
      });
    }

    this.notify();
    return updatedProfile;
  }

  // =========================================================
  // GENERIC COLLECTION CRUD (ADD, EDIT, DELETE, VISIBILITY, REORDER)
  // =========================================================

  async upsertItem<K extends CmsCollectionKey>(
    collection: K,
    item: Omit<CollectionMap[K], 'id'> & { id?: string },
  ): Promise<CollectionMap[K]> {
    const now = new Date().toISOString();
    const id = item.id?.trim() ? item.id : generateId(collection.slice(0, 4));
    const fullItem = {
      ...item,
      id,
      createdAt: (item as { createdAt?: string }).createdAt ?? now,
      updatedAt: now,
    } as CollectionMap[K];

    const supabase = getSupabaseClient();
    if (supabase) {
      const table = SUPABASE_TABLE_MAP[collection];
      const payload = mapCamelToSupabaseRow(fullItem as unknown as Record<string, unknown>);
      const { error } = await supabase.from(table).upsert(payload as never);
      if (error) {
        throw new Error(error.message);
      }
    } else {
      const current = readLocalPortfolio();
      const list = [...current[collection]] as CollectionMap[K][];
      const idx = list.findIndex((existing) => existing.id === id);
      if (idx >= 0) {
        list[idx] = fullItem;
      } else {
        list.push(fullItem);
      }
      writeLocalPortfolio({
        ...current,
        [collection]: list,
      });
    }

    this.notify();
    return fullItem;
  }

  async deleteItem<K extends CmsCollectionKey>(collection: K, id: string): Promise<void> {
    const supabase = getSupabaseClient();
    if (supabase) {
      const table = SUPABASE_TABLE_MAP[collection];
      const { error } = await supabase.from(table).delete().eq('id', id);
      if (error) {
        throw new Error(error.message);
      }
    } else {
      const current = readLocalPortfolio();
      const filtered = (current[collection] as CollectionMap[K][]).filter(
        (item) => item.id !== id,
      );
      writeLocalPortfolio({
        ...current,
        [collection]: filtered,
      });
    }

    this.notify();
  }

  async reorderItems<K extends CmsCollectionKey>(
    collection: K,
    orderedIds: string[],
  ): Promise<void> {
    const current = await this.getAdminPortfolio();
    const list = [...current[collection]] as CollectionMap[K][];
    const orderLookup = new Map(orderedIds.map((id, idx) => [id, idx + 1]));

    const updated = list
      .map((item) => ({
        ...item,
        sortOrder: orderLookup.get(item.id) ?? item.sortOrder,
        updatedAt: new Date().toISOString(),
      }))
      .sort((a, b) => a.sortOrder - b.sortOrder);

    const supabase = getSupabaseClient();
    if (supabase) {
      const table = SUPABASE_TABLE_MAP[collection];
      const rows = updated.map((item) =>
        mapCamelToSupabaseRow(item as unknown as Record<string, unknown>),
      );
      const { error } = await supabase.from(table).upsert(rows as never);
      if (error) {
        throw new Error(error.message);
      }
    } else {
      writeLocalPortfolio({
        ...current,
        [collection]: updated,
      });
    }

    this.notify();
  }

  // =========================================================
  // ENQUIRY SUBMISSION & ADMIN ENQUIRY MANAGEMENT
  // =========================================================

  async submitEnquiry(
    payload: EnquiryPayload,
  ): Promise<{ accepted: boolean; mode: CmsStorageMode; error?: string }> {
    if (payload.honeypot && payload.honeypot.trim().length > 0) {
      // Silently drop spam bots
      return { accepted: true, mode: this.getMode() };
    }

    const name = payload.senderName.trim();
    const email = payload.senderEmail.trim();
    const subject = payload.subject.trim();
    const message = payload.message.trim();
    const phone = payload.senderPhone?.trim() || undefined;

    if (!name || !email || !subject || !message) {
      return {
        accepted: false,
        mode: this.getMode(),
        error: 'Please fill in your full name, email address, subject, and message.',
      };
    }

    if (!EMAIL_PATTERN.test(email)) {
      return {
        accepted: false,
        mode: this.getMode(),
        error: 'Please enter a valid email address.',
      };
    }

    if (message.length < 5) {
      return {
        accepted: false,
        mode: this.getMode(),
        error: 'Message must be at least 5 characters.',
      };
    }

    const supabase = getSupabaseClient();
    if (supabase) {
      const { error } = await supabase.from('enquiries').insert({
        sender_name: name,
        sender_email: email,
        sender_phone: phone ?? null,
        opportunity_type: payload.opportunityType,
        subject,
        message,
        status: 'new',
      } as never);

      if (error) {
        return {
          accepted: false,
          mode: 'supabase',
          error: error.message,
        };
      }

      this.notify();
      return { accepted: true, mode: 'supabase' };
    }

    const now = new Date().toISOString();
    const nextItem: EnquiryItem = {
      id: generateId('enq'),
      senderName: name,
      senderEmail: email,
      senderPhone: phone,
      opportunityType: payload.opportunityType,
      subject,
      message,
      status: 'new',
      createdAt: now,
      updatedAt: now,
    };

    const existing = readLocalEnquiries();
    writeLocalEnquiries([nextItem, ...existing]);
    this.notify();
    return { accepted: true, mode: 'local-cms' };
  }

  async getEnquiries(): Promise<EnquiryItem[]> {
    const supabase = getSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from('enquiries')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw new Error(error.message);
      return (data ?? []).map((row) =>
        mapSupabaseRowToCamel<EnquiryItem>(row as Record<string, unknown>),
      );
    }

    return readLocalEnquiries();
  }

  async updateEnquiryStatus(id: string, status: EnquiryStatus): Promise<void> {
    const supabase = getSupabaseClient();
    if (supabase) {
      const { error } = await supabase
        .from('enquiries')
        .update({ status } as never)
        .eq('id', id);
      if (error) throw new Error(error.message);
    } else {
      const updated = readLocalEnquiries().map((item) =>
        item.id === id
          ? { ...item, status, updatedAt: new Date().toISOString() }
          : item,
      );
      writeLocalEnquiries(updated);
    }
    this.notify();
  }

  async deleteEnquiry(id: string): Promise<void> {
    const supabase = getSupabaseClient();
    if (supabase) {
      const { error } = await supabase.from('enquiries').delete().eq('id', id);
      if (error) throw new Error(error.message);
    } else {
      writeLocalEnquiries(readLocalEnquiries().filter((item) => item.id !== id));
    }
    this.notify();
  }

  // =========================================================
  // MEDIA LIBRARY (VALIDATION + STORAGE UPLOAD)
  // =========================================================

  async getMediaAssets(): Promise<MediaAsset[]> {
    const supabase = getSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from('media_assets')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw new Error(error.message);
      return (data ?? []).map((row) =>
        mapSupabaseRowToCamel<MediaAsset>(row as Record<string, unknown>),
      );
    }

    return readLocalMedia();
  }

  async uploadMediaAsset(file: File, category: MediaCategory): Promise<MediaAsset> {
    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      throw new Error('Unsupported file type. Allowed: PNG, JPG, WebP, SVG, and PDF.');
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      throw new Error('File exceeds the 5 MB upload limit.');
    }

    const supabase = getSupabaseClient();
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');

    if (supabase) {
      const storagePath = `${category}/${Date.now()}_${safeName}`;
      const { error: uploadError } = await supabase.storage
        .from('portfolio-assets')
        .upload(storagePath, file, { upsert: false, contentType: file.type });

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      const { data: urlData } = supabase.storage
        .from('portfolio-assets')
        .getPublicUrl(storagePath);

      const { data: rowData, error: dbError } = await supabase
        .from('media_assets')
        .insert({
          name: file.name,
          category,
          mime_type: file.type,
          size_bytes: file.size,
          url: urlData.publicUrl,
          storage_path: storagePath,
        } as never)
        .select()
        .single();

      if (dbError || !rowData) {
        throw new Error(dbError?.message ?? 'Failed to register media asset.');
      }

      this.notify();
      return mapSupabaseRowToCamel<MediaAsset>(rowData as Record<string, unknown>);
    }

    const dataUrl = await fileToDataUrl(file);
    const asset: MediaAsset = {
      id: generateId('media'),
      name: file.name,
      category,
      mimeType: file.type,
      sizeBytes: file.size,
      url: dataUrl,
      createdAt: new Date().toISOString(),
    };

    writeLocalMedia([asset, ...readLocalMedia()]);
    this.notify();
    return asset;
  }

  async deleteMediaAsset(asset: MediaAsset): Promise<void> {
    const supabase = getSupabaseClient();
    if (supabase) {
      if (asset.storagePath) {
        await supabase.storage.from('portfolio-assets').remove([asset.storagePath]);
      }
      const { error } = await supabase.from('media_assets').delete().eq('id', asset.id);
      if (error) throw new Error(error.message);
    } else {
      writeLocalMedia(readLocalMedia().filter((item) => item.id !== asset.id));
    }
    this.notify();
  }

  // =========================================================
  // ADMIN AUTHENTICATION
  // =========================================================

  async getAdminSession(): Promise<AdminSessionInfo> {
    const supabase = getSupabaseClient();
    if (supabase) {
      const { data } = await supabase.auth.getSession();
      const user = data.session?.user ?? null;
      return {
        authenticated: Boolean(user),
        email: user?.email ?? null,
        mode: 'supabase',
      };
    }

    const localEmail = sessionStorage.getItem(STORAGE_LOCAL_SESSION_KEY);
    return {
      authenticated: Boolean(localEmail),
      email: localEmail,
      mode: 'local-cms',
    };
  }

  async signInAdmin(
    email: string,
    password: string,
  ): Promise<{ ok: boolean; error?: string; mode: CmsStorageMode }> {
    const trimmedEmail = email.trim();
    if (!EMAIL_PATTERN.test(trimmedEmail)) {
      return { ok: false, error: 'Enter a valid admin email address.', mode: this.getMode() };
    }
    if (password.length < 6) {
      return { ok: false, error: 'Password must be at least 6 characters.', mode: this.getMode() };
    }

    const supabase = getSupabaseClient();
    if (supabase) {
      const { error } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password,
      });
      if (error) {
        return { ok: false, error: error.message, mode: 'supabase' };
      }
      return { ok: true, mode: 'supabase' };
    }

    // Local Browser CMS preview session (explicitly labeled as non-production)
    sessionStorage.setItem(STORAGE_LOCAL_SESSION_KEY, trimmedEmail);
    return { ok: true, mode: 'local-cms' };
  }

  async signOutAdmin(): Promise<void> {
    const supabase = getSupabaseClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    sessionStorage.removeItem(STORAGE_LOCAL_SESSION_KEY);
  }

  resetLocalCmsData(): void {
    localStorage.removeItem(STORAGE_PORTFOLIO_KEY);
    localStorage.removeItem(STORAGE_ENQUIRIES_KEY);
    localStorage.removeItem(STORAGE_MEDIA_KEY);
    this.notify();
  }
}

export const portfolioRepository = new PortfolioCmsRepository();
