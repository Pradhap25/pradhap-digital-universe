import type { SiteProfile } from '@/types/portfolio';

export function Footer({ profile }: { profile: SiteProfile }) {
  return (
    <footer className="relative z-10 border-t border-slate-800/80 bg-[#030614]/85 pt-8 pb-24 backdrop-blur-md md:pb-28">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-4 px-4 text-xs text-slate-400 sm:flex-row sm:items-center sm:px-6 lg:px-8">
        <div>
          <p className="font-semibold text-slate-200">{profile.brandTitle}</p>
          <p className="mt-1">
            {profile.fullName} &bull; {profile.location}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <a href="#identity" className="hover:text-cyan-300">
            Return to top
          </a>
          <span aria-hidden="true" className="text-slate-700">
            |
          </span>
          <span>&copy; {new Date().getFullYear()} {profile.fullName}</span>
        </div>
      </div>
    </footer>
  );
}
