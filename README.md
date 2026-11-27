# Pradhap Digital Universe

A section-aware 3D interactive developer portfolio and full-featured Content Management System (CMS) built with React, TypeScript, Three.js (`@react-three/fiber` / `@react-three/drei`), Framer Motion, Tailwind CSS v4, and Supabase.

## Features

- **Full-Screen Scroll-Based Scrollytelling**: Vertical scroll-snap experience spanning 11 dedicated sections (`identity`, `about`, `education`, `experience`, `skills`, `interests`, `projects`, `achievements`, `certifications`, `research`, `contact`).
- **Dynamic Section-Reactive 3D Backdrop**: Real-time Three.js scenes (`UniverseBackdrop`, `UniverseScene`, `BrandMonolith`, `InterestSceneGroup`, `SectionSceneGroups`) that transition based on the active section, company highlight (`LivaNova` / `SAP Labs`), selected technical skill, project, achievement, or area of interest, with WebGL fallback and reduced-motion support.
- **Official Brand & Tech Assets**: Dedicated SVG brand/technology assets in `src/assets/brands/` rendered across UI cards and 3D monoliths.
- **Admin CMS (`/admin` & `/admin/login`)**:
  - Manage Profile/Hero, About, Education, Experience, Skills, Area of Interests, Projects, Achievements, Certifications, Research, Leadership, and Contact Details.
  - Create, edit, delete, reorder, and toggle visibility (`enabled`) per item.
  - Media Library manager (`MediaLibraryManager`, `MediaPickerField`) for images, logos, and documents.
  - Enquiry Inbox (`EnquiriesManager`) for visitor submissions from the Contact section.
  - Works out of the box in **Local Browser CMS Mode** or with a live **Supabase** backend (Postgres, Auth, and Storage).

## Tech Stack

- **Frontend**: React 19, TypeScript 5.7, Vite 6, React Router v7
- **Styling & Motion**: Tailwind CSS v4 (`@tailwindcss/vite`), Framer Motion 12, Lucide React
- **3D Graphics**: Three.js, `@react-three/fiber`, `@react-three/drei`
- **Backend / Persistence**: Supabase (`@supabase/supabase-js`) with schema migration in [`supabase/migrations/001_portfolio_cms_schema.sql`](supabase/migrations/001_portfolio_cms_schema.sql) and local browser fallback

## Project Structure

```text
├── public/                     # Static public assets (favicon.svg, robots.txt)
├── src/
│   ├── assets/                 # Brand SVGs, portrait image, orbital emblem SVG
│   ├── components/             # Layout shell, navigation, footer, UI primitives, feedback
│   ├── features/
│   │   ├── admin/              # Admin guard, CMS schemas, CRUD & media/enquiry managers
│   │   ├── public/             # 11 public portfolio section components
│   │   └── three/              # R3F canvas, camera rig, section-reactive 3D scenes
│   ├── hooks/                  # Portfolio data, active section, WebGL & motion hooks
│   ├── integrations/supabase/  # Supabase client & environment helpers
│   ├── pages/                  # Public Home/404 pages and Admin login/dashboard pages
│   ├── services/               # Portfolio repository, logo resolver, default seed data
│   ├── styles/                 # Global Tailwind v4 & scroll-snap CSS
│   └── types/                  # Portfolio & Supabase database TypeScript types
├── supabase/
│   ├── migrations/             # SQL schema & RLS policies (001_portfolio_cms_schema.sql)
│   └── README.md               # Detailed Supabase setup guide
├── .env.example                # Environment variable template
└── package.json
```

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Run the development server

```bash
npm run dev
```

The app runs in **Local Browser CMS Mode** immediately without requiring environment variables.

### 3. Optional: Connect Supabase

1. Copy `.env.example` to `.env.local`:
   ```env
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=your-public-anon-key
   ```
2. Follow [`supabase/README.md`](supabase/README.md) to configure Auth, assign the `admin` role in `app_metadata`, and run [`supabase/migrations/001_portfolio_cms_schema.sql`](supabase/migrations/001_portfolio_cms_schema.sql).

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start Vite local development server |
| `npm run typecheck` | Run TypeScript type checking (`tsc -b --noEmit`) |
| `npm run lint` | Run ESLint across the repository |
| `npm run build` | Typecheck and build production bundle into `dist/` |
| `npm run preview` | Preview the production build locally |

## Routes

- `/` — Public interactive portfolio
- `/admin/login` — Admin CMS sign-in
- `/admin` — Admin CMS dashboard (requires admin session)
