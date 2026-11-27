import { CheckCircle2, Plus, Save, Trash2 } from 'lucide-react';
import { type FormEvent, useEffect, useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { NeonButton } from '@/components/ui/NeonButton';
import { portfolioRepository } from '@/services/portfolioRepository';
import type { SiteProfile, SocialLinkItem } from '@/types/portfolio';
import { MediaPickerField } from './MediaPickerField';

interface ProfileSectionEditorProps {
  mode: 'hero' | 'about' | 'contact';
  profile: SiteProfile;
  softSkills: string[];
  onRefresh: () => Promise<void>;
}

export function ProfileSectionEditor({
  mode,
  profile,
  softSkills,
  onRefresh,
}: ProfileSectionEditorProps) {
  const [draft, setDraft] = useState<SiteProfile>(profile);
  const [softSkillsText, setSoftSkillsText] = useState(softSkills.join(', '));
  const [isSaving, setIsSaving] = useState(false);
  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  useEffect(() => {
    setDraft(profile);
    setSoftSkillsText(softSkills.join(', '));
  }, [profile, softSkills]);

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setSavedNotice(null);

    try {
      const parsedSoftSkills = softSkillsText
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      await portfolioRepository.updateProfile(draft, parsedSoftSkills);
      await onRefresh();
      setSavedNotice('Changes saved and published to the public portfolio.');
    } finally {
      setIsSaving(false);
    }
  };

  const addSocialLink = () => {
    setDraft((prev) => ({
      ...prev,
      otherSocialLinks: [...(prev.otherSocialLinks ?? []), { label: '', url: '' }],
    }));
  };

  const updateSocialLink = (idx: number, patch: Partial<SocialLinkItem>) => {
    setDraft((prev) => ({
      ...prev,
      otherSocialLinks: (prev.otherSocialLinks ?? []).map((item, i) =>
        i === idx ? { ...item, ...patch } : item,
      ),
    }));
  };

  const removeSocialLink = (idx: number) => {
    setDraft((prev) => ({
      ...prev,
      otherSocialLinks: (prev.otherSocialLinks ?? []).filter((_, i) => i !== idx),
    }));
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">
          {mode === 'hero'
            ? 'Profile & Hero Settings'
            : mode === 'about'
              ? 'About Me & Identity'
              : 'Contact Information & Social Links'}
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          {mode === 'hero'
            ? 'Update your primary identity, Hero headline, CTAs, resume link, and visual assets.'
            : mode === 'about'
              ? 'Update your portrait photograph, introduction bio, professional summary, and languages.'
              : 'Manage public contact options, location, and developer profiles.'}
        </p>
      </div>

      <GlassCard className="space-y-4 p-6">
        {mode === 'hero' ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-300">
                Full Name
              </label>
              <input
                type="text"
                required
                value={draft.fullName}
                onChange={(e) => setDraft({ ...draft, fullName: e.target.value })}
                className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3.5 py-2 text-sm text-white"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-300">
                Platform Brand Title
              </label>
              <input
                type="text"
                required
                value={draft.brandTitle}
                onChange={(e) => setDraft({ ...draft, brandTitle: e.target.value })}
                className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3.5 py-2 text-sm text-white"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-medium text-slate-300">
                Hero Headline
              </label>
              <input
                type="text"
                required
                value={draft.heroHeadline}
                onChange={(e) => setDraft({ ...draft, heroHeadline: e.target.value })}
                className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3.5 py-2 text-sm text-white"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-300">
                Professional Title
              </label>
              <input
                type="text"
                value={draft.roleTitle}
                onChange={(e) => setDraft({ ...draft, roleTitle: e.target.value })}
                className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3.5 py-2 text-sm text-white"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-300">
                Availability Badge Text
              </label>
              <input
                type="text"
                value={draft.availabilityStatus}
                onChange={(e) => setDraft({ ...draft, availabilityStatus: e.target.value })}
                className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3.5 py-2 text-sm text-white"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-medium text-slate-300">
                Introduction / Tagline
              </label>
              <textarea
                rows={3}
                value={draft.tagline}
                onChange={(e) => setDraft({ ...draft, tagline: e.target.value })}
                className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3.5 py-2 text-sm text-white"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-300">
                Primary CTA Label
              </label>
              <input
                type="text"
                value={draft.primaryCtaLabel}
                onChange={(e) => setDraft({ ...draft, primaryCtaLabel: e.target.value })}
                className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3.5 py-2 text-sm text-white"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-300">
                Primary CTA Link
              </label>
              <input
                type="text"
                value={draft.primaryCtaHref}
                onChange={(e) => setDraft({ ...draft, primaryCtaHref: e.target.value })}
                className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3.5 py-2 text-sm text-white"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-300">
                Secondary CTA Label
              </label>
              <input
                type="text"
                value={draft.secondaryCtaLabel}
                onChange={(e) => setDraft({ ...draft, secondaryCtaLabel: e.target.value })}
                className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3.5 py-2 text-sm text-white"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-300">
                Secondary CTA Link
              </label>
              <input
                type="text"
                value={draft.secondaryCtaHref}
                onChange={(e) => setDraft({ ...draft, secondaryCtaHref: e.target.value })}
                className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3.5 py-2 text-sm text-white"
              />
            </div>
            <div className="sm:col-span-2">
              <MediaPickerField
                label="Resume PDF / Download URL"
                value={draft.resumeUrl ?? ''}
                onChange={(url) => setDraft({ ...draft, resumeUrl: url })}
                mediaCategory="certificate"
                placeholder="Upload resume PDF or paste URL"
              />
            </div>
            <div className="sm:col-span-2">
              <MediaPickerField
                label="Hero Background Asset (Optional)"
                value={draft.heroBackgroundUrl ?? ''}
                onChange={(url) => setDraft({ ...draft, heroBackgroundUrl: url })}
                mediaCategory="image"
                placeholder="Optional custom backdrop image URL"
              />
            </div>
          </div>
        ) : mode === 'about' ? (
          <div className="space-y-4">
            <MediaPickerField
              label="Personal Portrait Photograph"
              value={draft.portraitUrl ?? ''}
              onChange={(url) => setDraft({ ...draft, portraitUrl: url })}
              mediaCategory="portrait"
            />
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-300">
                About Me Bio / Introduction
              </label>
              <textarea
                rows={4}
                value={draft.bio}
                onChange={(e) => setDraft({ ...draft, bio: e.target.value })}
                className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3.5 py-2 text-sm text-white"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-300">
                Professional Summary
              </label>
              <textarea
                rows={3}
                value={draft.professionalSummary}
                onChange={(e) => setDraft({ ...draft, professionalSummary: e.target.value })}
                className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3.5 py-2 text-sm text-white"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-300">
                  Languages (comma-separated)
                </label>
                <input
                  type="text"
                  value={draft.languages.join(', ')}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      languages: e.target.value
                        .split(',')
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3.5 py-2 text-sm text-white"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-300">
                  Soft Skills (comma-separated)
                </label>
                <input
                  type="text"
                  value={softSkillsText}
                  onChange={(e) => setSoftSkillsText(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3.5 py-2 text-sm text-white"
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-300">
                Additional Details
              </label>
              <input
                type="text"
                value={draft.additionalDetails}
                onChange={(e) => setDraft({ ...draft, additionalDetails: e.target.value })}
                className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3.5 py-2 text-sm text-white"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-300">
                  Contact Email
                </label>
                <input
                  type="email"
                  value={draft.contactEmail ?? ''}
                  onChange={(e) => setDraft({ ...draft, contactEmail: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3.5 py-2 text-sm text-white"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-300">
                  Contact Phone (Optional)
                </label>
                <input
                  type="text"
                  value={draft.contactPhone ?? ''}
                  onChange={(e) => setDraft({ ...draft, contactPhone: e.target.value })}
                  placeholder="Leave blank to keep hidden publicly"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3.5 py-2 text-sm text-white placeholder:text-slate-500"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-300">
                  Location
                </label>
                <input
                  type="text"
                  value={draft.location}
                  onChange={(e) => setDraft({ ...draft, location: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3.5 py-2 text-sm text-white"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-300">
                  LinkedIn URL
                </label>
                <input
                  type="url"
                  value={draft.linkedinUrl ?? ''}
                  onChange={(e) => setDraft({ ...draft, linkedinUrl: e.target.value })}
                  placeholder="https://linkedin.com/in/..."
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3.5 py-2 text-sm text-white"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-300">
                  GitHub URL
                </label>
                <input
                  type="url"
                  value={draft.githubUrl ?? ''}
                  onChange={(e) => setDraft({ ...draft, githubUrl: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3.5 py-2 text-sm text-white"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-300">
                  LeetCode URL
                </label>
                <input
                  type="url"
                  value={draft.leetcodeUrl ?? ''}
                  onChange={(e) => setDraft({ ...draft, leetcodeUrl: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3.5 py-2 text-sm text-white"
                />
              </div>
            </div>

            <div className="space-y-2 border-t border-slate-800 pt-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-300">
                  Other Social Links
                </span>
                <button
                  type="button"
                  onClick={addSocialLink}
                  className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-cyan-400/35 bg-cyan-500/10 px-2.5 py-1 text-xs text-cyan-200 hover:bg-cyan-500/20"
                >
                  <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Add Link</span>
                </button>
              </div>
              {(draft.otherSocialLinks ?? []).map((item, idx) => (
                <div key={idx} className="flex flex-col gap-2 sm:flex-row">
                  <input
                    type="text"
                    placeholder="Label (e.g. Kaggle)"
                    value={item.label}
                    onChange={(e) => updateSocialLink(idx, { label: e.target.value })}
                    className="rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2 text-xs text-white sm:w-44"
                  />
                  <input
                    type="url"
                    placeholder="https://..."
                    value={item.url}
                    onChange={(e) => updateSocialLink(idx, { url: e.target.value })}
                    className="flex-1 rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2 text-xs text-white"
                  />
                  <button
                    type="button"
                    onClick={() => removeSocialLink(idx)}
                    aria-label="Remove social link"
                    className="cursor-pointer rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-rose-300 hover:bg-rose-500/20"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-800 pt-4">
          <NeonButton type="submit" disabled={isSaving}>
            <Save className="h-4 w-4" aria-hidden="true" />
            <span>{isSaving ? 'Saving...' : 'Save & Publish Changes'}</span>
          </NeonButton>

          {savedNotice ? (
            <p role="status" className="inline-flex items-center gap-2 text-xs text-cyan-200">
              <CheckCircle2 className="h-4 w-4 text-cyan-400" aria-hidden="true" />
              <span>{savedNotice}</span>
            </p>
          ) : null}
        </div>
      </GlassCard>
    </form>
  );
}
