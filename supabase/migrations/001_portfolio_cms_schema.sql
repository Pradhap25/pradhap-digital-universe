-- Pradhap Digital Universe: Complete Portfolio CMS & Enquiry Schema
-- Run in Supabase SQL Editor or via Supabase CLI migrations.

create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

-- Helper: checks whether current authenticated user is an authorized Admin.
-- Provision your admin account in Supabase Auth (disable open public signups)
-- and set app_metadata.role = 'admin' or replace the email check below.
create or replace function public.is_portfolio_admin()
returns boolean
language sql
stable
as $$
  select auth.role() = 'authenticated'
    and coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin';
$$;

-- 1. Single-row Site Profile / Hero / About / Contact
create table if not exists public.site_profile (
  id text primary key default 'primary',
  full_name text not null,
  brand_title text not null,
  hero_headline text not null,
  role_title text not null,
  tagline text not null,
  bio text not null,
  professional_summary text default '',
  additional_details text default '',
  availability_status text default '',
  location text default '',
  languages text[] not null default '{}',
  areas_of_interest text[] not null default '{}',
  portrait_url text,
  hero_background_url text,
  primary_cta_label text default 'Enter Innovation World',
  primary_cta_href text default '#projects',
  secondary_cta_label text default 'Explore Identity',
  secondary_cta_href text default '#about',
  contact_email text,
  contact_phone text,
  resume_url text,
  github_url text,
  leetcode_url text,
  linkedin_url text,
  other_social_links jsonb not null default '[]',
  soft_skills text[] not null default '{}',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

-- 2. Education
create table if not exists public.education (
  id text primary key,
  institution text not null,
  degree text not null,
  field_of_study text,
  start_date text,
  end_date text not null,
  grade_or_gpa text,
  status_label text,
  description text,
  logo_url text,
  highlights text[] not null default '{}',
  sort_order int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

-- 3. Experiences / Internships
create table if not exists public.experiences (
  id text primary key,
  role text not null,
  company text not null,
  location text not null,
  employment_type text not null default 'Internship',
  status_label text,
  is_current boolean not null default false,
  start_date text not null,
  end_date text not null,
  summary text not null,
  logo_url text,
  supporting_media_url text,
  highlights text[] not null default '{}',
  tech_stack text[] not null default '{}',
  sort_order int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

-- 4. Technical Skills
create table if not exists public.skills (
  id text primary key,
  name text not null,
  category text not null,
  proficiency int,
  summary text,
  logo_url text,
  sort_order int not null default 0,
  is_featured boolean not null default false,
  is_published boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

-- 5. Area of Interests (kept separate from Technical Skills)
create table if not exists public.interests (
  id text primary key,
  name text not null,
  category text not null,
  description text,
  icon_url text,
  sort_order int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

-- 6. Projects
create table if not exists public.projects (
  id text primary key,
  title text not null,
  slug text not null,
  domain_label text not null,
  tagline text not null,
  description text not null,
  image_url text,
  status_label text,
  start_date text,
  end_date text,
  tech_stack text[] not null default '{}',
  architecture_flow text[] not null default '{}',
  highlights text[] not null default '{}',
  live_url text,
  repo_url text,
  sort_order int not null default 0,
  is_featured boolean not null default false,
  is_published boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

-- 7. Achievements
create table if not exists public.achievements (
  id text primary key,
  title text not null,
  award_label text,
  issuer text not null,
  achieved_at text,
  category text not null,
  badge_type text not null default 'award',
  description text not null,
  image_url text,
  proof_url text,
  sort_order int not null default 0,
  is_featured boolean not null default false,
  is_published boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

-- 8. Certifications
create table if not exists public.certifications (
  id text primary key,
  title text not null,
  issuer text not null,
  issue_date text,
  expiry_date text,
  credential_id text,
  credential_url text,
  certificate_file_url text,
  issuer_logo_url text,
  skills_covered text[] not null default '{}',
  sort_order int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

-- 9. Research & Publications
create table if not exists public.research_items (
  id text primary key,
  title text not null,
  domain text not null,
  authors text,
  venue text,
  published_date text,
  doi text,
  status text not null default 'Draft',
  progress_percent int,
  abstract text not null,
  cover_image_url text,
  pdf_url text,
  highlights text[] not null default '{}',
  tech_tags text[] not null default '{}',
  paper_or_demo_url text,
  sort_order int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

-- 10. Leadership & Activities
create table if not exists public.leadership (
  id text primary key,
  role text not null,
  organization text not null,
  category text not null default 'Leadership',
  description text not null,
  start_date text,
  end_date text,
  image_url text,
  logo_url text,
  sort_order int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

-- 11. Contact Enquiries (private to admin; public can insert only)
create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  sender_name text not null check (char_length(trim(sender_name)) between 1 and 120),
  sender_email text not null check (sender_email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  sender_phone text,
  opportunity_type text not null default 'General',
  subject text not null check (char_length(trim(subject)) between 1 and 200),
  message text not null check (char_length(trim(message)) between 5 and 4000),
  status text not null default 'new' check (status in ('new', 'read', 'replied', 'archived')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

-- 12. Media Library Registry
create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  mime_type text not null,
  size_bytes bigint not null,
  url text not null,
  storage_path text,
  created_at timestamptz not null default timezone('utc', now())
);

-- Updated-at Triggers
do $$
declare
  tbl text;
begin
  foreach tbl in array array[
    'site_profile','education','experiences','skills','interests',
    'projects','achievements','certifications','research_items','leadership','enquiries'
  ]
  loop
    execute format('drop trigger if exists trg_%s_updated_at on public.%I', tbl, tbl);
    execute format(
      'create trigger trg_%s_updated_at before update on public.%I for each row execute function public.set_updated_at()',
      tbl, tbl
    );
  end loop;
end $$;

-- Row Level Security (RLS)
alter table public.site_profile enable row level security;
alter table public.education enable row level security;
alter table public.experiences enable row level security;
alter table public.skills enable row level security;
alter table public.interests enable row level security;
alter table public.projects enable row level security;
alter table public.achievements enable row level security;
alter table public.certifications enable row level security;
alter table public.research_items enable row level security;
alter table public.leadership enable row level security;
alter table public.enquiries enable row level security;
alter table public.media_assets enable row level security;

-- Public read policies (published items only)
create policy "Public read site_profile" on public.site_profile
  for select to anon, authenticated using (true);

do $$
declare
  tbl text;
begin
  foreach tbl in array array[
    'education','experiences','skills','interests',
    'projects','achievements','certifications','research_items','leadership'
  ]
  loop
    execute format(
      'create policy "Public read published %1$s" on public.%1$I for select to anon, authenticated using (is_published = true or public.is_portfolio_admin())',
      tbl
    );
    execute format(
      'create policy "Admin write %1$s" on public.%1$I for all to authenticated using (public.is_portfolio_admin()) with check (public.is_portfolio_admin())',
      tbl
    );
  end loop;
end $$;

create policy "Admin write site_profile" on public.site_profile
  for all to authenticated using (public.is_portfolio_admin()) with check (public.is_portfolio_admin());

-- Enquiries: public insert only; admin read/update/delete only
create policy "Public submit enquiry" on public.enquiries
  for insert to anon, authenticated with check (true);

create policy "Admin manage enquiries" on public.enquiries
  for all to authenticated using (public.is_portfolio_admin()) with check (public.is_portfolio_admin());

-- Media Assets: public read, admin write
create policy "Public read media_assets" on public.media_assets
  for select to anon, authenticated using (true);

create policy "Admin write media_assets" on public.media_assets
  for all to authenticated using (public.is_portfolio_admin()) with check (public.is_portfolio_admin());

-- Storage Bucket for certificates, logos, project images, portraits, research PDFs
insert into storage.buckets (id, name, public)
values ('portfolio-assets', 'portfolio-assets', true)
on conflict (id) do nothing;

create policy "Public view portfolio-assets" on storage.objects
  for select to anon, authenticated using (bucket_id = 'portfolio-assets');

create policy "Admin upload portfolio-assets" on storage.objects
  for insert to authenticated with check (bucket_id = 'portfolio-assets' and public.is_portfolio_admin());

create policy "Admin update portfolio-assets" on storage.objects
  for update to authenticated using (bucket_id = 'portfolio-assets' and public.is_portfolio_admin());

create policy "Admin delete portfolio-assets" on storage.objects
  for delete to authenticated using (bucket_id = 'portfolio-assets' and public.is_portfolio_admin());
