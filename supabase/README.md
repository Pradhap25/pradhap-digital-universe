# Supabase Backend Setup Guide

The frontend works immediately in **Local Browser CMS Mode** when Supabase environment variables are absent. To connect a live Supabase Postgres database, Auth, and Storage:

1. Create a Supabase project at https://supabase.com.
2. In **Authentication -> Providers -> Email**, disable **Allow new users to sign up** so only your manually created admin user exists.
3. Create your admin user in **Authentication -> Users**, and assign `{"role": "admin"}` in **app_metadata** (via SQL or Dashboard):
   ```sql
   update auth.users
   set raw_app_meta_data = raw_app_meta_data || '{"role": "admin"}'::jsonb
   where email = 'your-admin-email@example.com';
   ```
4. Run `supabase/migrations/001_portfolio_cms_schema.sql` in the **SQL Editor**.
5. Create `.env.local` in the project root (never commit it):
   ```env
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=your-public-anon-key
   ```
   *(Never expose `service_role` keys in Vite frontend variables.)*
6. Restart `npm run dev` and sign in at `/admin/login`.
