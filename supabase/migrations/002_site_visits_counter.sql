-- Pradhap Digital Universe: Live Website Visit Counter Migration
-- Run in Supabase SQL Editor or via Supabase CLI migrations.
-- Safe to run multiple times without resetting existing visit counts.

-- Ensure updated_at trigger helper exists even if 001_portfolio_cms_schema.sql was not run first
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

-- 1. Single-row website visitor statistics table
create table if not exists public.site_stats (
  id text primary key default 'primary' check (id = 'primary'),
  total_visits integer not null default 0 check (total_visits >= 0),
  updated_at timestamptz not null default timezone('utc', now())
);

-- Seed the single primary stats row idempotently (preserves existing total_visits)
insert into public.site_stats (id, total_visits)
values ('primary', 0)
on conflict (id) do nothing;

-- Keep updated_at current on every update
drop trigger if exists trg_site_stats_updated_at on public.site_stats;
create trigger trg_site_stats_updated_at
  before update on public.site_stats
  for each row
  execute function public.set_updated_at();

-- 2. Row Level Security & strict least-privilege grants
alter table public.site_stats enable row level security;

-- Revoke direct write permissions from client roles so public users cannot overwrite or reset counts
revoke all on table public.site_stats from anon, authenticated;
grant select on table public.site_stats to anon, authenticated;

drop policy if exists "Public read site_stats" on public.site_stats;
create policy "Public read site_stats" on public.site_stats
  for select to anon, authenticated
  using (id = 'primary');

-- 3. Atomic server-side increment RPC (concurrency-safe under simultaneous visitors)
create or replace function public.increment_site_visits()
returns table (
  total_visits integer,
  updated_at timestamptz
)
language sql
security definer
set search_path = public
as $$
  insert into public.site_stats as s (id, total_visits, updated_at)
  values ('primary', 1, timezone('utc', now()))
  on conflict (id) do update
    set total_visits = s.total_visits + 1,
        updated_at = timezone('utc', now())
  returning s.total_visits, s.updated_at;
$$;

revoke all on function public.increment_site_visits() from public;
grant execute on function public.increment_site_visits() to anon, authenticated;

-- Prompt PostgREST to refresh schema cache immediately
notify pgrst, 'reload schema';
