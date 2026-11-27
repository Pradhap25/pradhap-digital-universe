import { motion, type MotionValue, useSpring } from 'framer-motion';
import {
  Award,
  BadgeCheck,
  Briefcase,
  Compass,
  Cpu,
  FlaskConical,
  GraduationCap,
  Layers,
  Mail,
  Menu,
  Shield,
  Sparkles,
  User,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/components/ui/cn';
import { useReducedMotionPref } from '@/hooks/useReducedMotionPref';
import type { PortfolioSectionId } from '@/types/portfolio';

interface NavNode {
  id: PortfolioSectionId;
  label: string;
  shortLabel: string;
  code: string;
  icon: typeof Sparkles;
}

const UNIVERSE_NODES: readonly NavNode[] = [
  { id: 'identity', label: 'Home', shortLabel: 'Home', code: '01', icon: Sparkles },
  { id: 'about', label: 'About Me', shortLabel: 'About', code: '02', icon: User },
  { id: 'education', label: 'Education', shortLabel: 'Edu', code: '03', icon: GraduationCap },
  { id: 'experience', label: 'Experience', shortLabel: 'Exp', code: '04', icon: Briefcase },
  { id: 'skills', label: 'Technical Skills', shortLabel: 'Skills', code: '05', icon: Cpu },
  { id: 'interests', label: 'Area of Interests', shortLabel: 'Interests', code: '06', icon: Compass },
  { id: 'projects', label: 'Projects', shortLabel: 'Projects', code: '07', icon: Layers },
  { id: 'achievements', label: 'Achievements', shortLabel: 'Awards', code: '08', icon: Award },
  { id: 'certifications', label: 'Certifications', shortLabel: 'Certs', code: '09', icon: BadgeCheck },
  { id: 'research', label: 'Research', shortLabel: 'Research', code: '10', icon: FlaskConical },
  { id: 'contact', label: 'Contact', shortLabel: 'Contact', code: '11', icon: Mail },
];

interface UniverseNavProps {
  activeSection: PortfolioSectionId;
  brandTitle: string;
  scrollYProgress: MotionValue<number>;
}

export function UniverseNav({
  activeSection,
  brandTitle,
  scrollYProgress,
}: UniverseNavProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const reducedMotion = useReducedMotionPref();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 160,
    damping: 26,
    restDelta: 0.001,
  });

  const activeNode =
    UNIVERSE_NODES.find((node) => node.id === activeSection) ?? UNIVERSE_NODES[0];

  const jumpToSection = (id: PortfolioSectionId) => {
    setMobileOpen(false);
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({
        behavior: reducedMotion ? 'auto' : 'smooth',
        block: 'start',
      });
    }
  };

  return (
    <>
      {/* Top Floating Telemetry Header */}
      <header className="pointer-events-none fixed inset-x-0 top-0 z-40 px-4 pt-3 sm:px-6 sm:pt-4">
        <div className="pointer-events-auto mx-auto flex max-w-7xl items-center justify-between gap-3 rounded-2xl border border-cyan-400/18 bg-[#050a1b]/75 px-4 py-2.5 backdrop-blur-xl shadow-lg shadow-slate-950/60">
          <button
            type="button"
            onClick={() => jumpToSection('identity')}
            className="inline-flex cursor-pointer items-center gap-2.5 text-left"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-xl border border-cyan-400/35 bg-cyan-500/10 text-cyan-300">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
            </span>
            <span>
              <span className="text-gradient-universe block text-sm font-bold tracking-tight sm:text-base">
                {brandTitle}
              </span>
            </span>
          </button>

          <div className="hidden items-center gap-3 md:flex">
            <span className="rounded-full border border-slate-700/80 bg-slate-900/80 px-3 py-1 font-mono text-[11px] uppercase tracking-widest text-cyan-300">
              {activeNode.code} // {activeNode.label}
            </span>
            <Link
              to="/admin"
              className="inline-flex items-center gap-1.5 rounded-xl border border-purple-400/30 bg-purple-500/10 px-3 py-1.5 font-mono text-xs text-purple-200 transition-colors hover:border-purple-400/60 hover:bg-purple-500/20"
            >
              <Shield className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Admin</span>
            </Link>
          </div>

          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-700/80 bg-slate-900/70 px-3 py-1.5 text-xs font-medium text-slate-200 hover:border-cyan-400/40 md:hidden"
            aria-expanded={mobileOpen}
            aria-controls="mobile-universe-nav"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            onClick={() => setMobileOpen((prev) => !prev)}
          >
            <span className="font-mono text-cyan-300">{activeNode.code}</span>
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>

        {/* Top Scroll Progress Line */}
        <div className="mx-auto mt-1 max-w-7xl overflow-hidden rounded-full px-2">
          <motion.div
            style={{ scaleX: smoothProgress, transformOrigin: '0% 50%' }}
            className="h-[2px] w-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500"
          />
        </div>
      </header>

      {/* Mobile Glass Command Drawer */}
      {mobileOpen ? (
        <nav
          id="mobile-universe-nav"
          aria-label="Mobile universe navigation"
          className="glass-dock fixed inset-x-4 top-20 z-50 rounded-2xl p-4 md:hidden"
        >
          <div className="grid grid-cols-2 gap-2">
            {UNIVERSE_NODES.map((node) => {
              const Icon = node.icon;
              const isActive = activeSection === node.id;
              return (
                <button
                  key={node.id}
                  type="button"
                  onClick={() => jumpToSection(node.id)}
                  aria-current={isActive ? 'location' : undefined}
                  className={cn(
                    'flex items-center gap-2 rounded-xl border px-3 py-2 text-left text-xs font-medium transition-colors',
                    isActive
                      ? 'border-cyan-400/50 bg-cyan-500/15 text-cyan-200'
                      : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700 hover:text-white',
                  )}
                >
                  <Icon className="h-3.5 w-3.5 shrink-0 text-cyan-300" aria-hidden="true" />
                  <span>{node.label}</span>
                </button>
              );
            })}
          </div>
          <Link
            to="/admin"
            onClick={() => setMobileOpen(false)}
            className="mt-3 flex items-center justify-center gap-2 rounded-xl border border-purple-400/30 bg-purple-500/10 px-3 py-2 font-mono text-xs text-purple-200"
          >
            <Shield className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Admin Portal</span>
          </Link>
        </nav>
      ) : null}

      {/* Desktop Floating Bottom Glass Dock */}
      <nav
        aria-label="Primary universe dock navigation"
        className="fixed bottom-4 left-1/2 z-40 hidden max-w-[96vw] -translate-x-1/2 md:block"
      >
        <div className="glass-dock relative flex items-center gap-0.5 rounded-2xl p-1.5">
          {UNIVERSE_NODES.map((node) => {
            const Icon = node.icon;
            const isActive = activeSection === node.id;
            return (
              <button
                key={node.id}
                type="button"
                title={node.label}
                aria-label={node.label}
                onClick={() => jumpToSection(node.id)}
                aria-current={isActive ? 'location' : undefined}
                className={cn(
                  'group relative flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-xl px-2 py-2 text-[11px] font-medium transition-colors xl:px-2.5 xl:text-xs',
                  isActive ? 'text-white' : 'text-slate-300 hover:text-cyan-200',
                )}
              >
                {isActive ? (
                  <motion.span
                    layoutId="universe-dock-active"
                    transition={{ type: 'spring', stiffness: 360, damping: 30 }}
                    className="absolute inset-0 -z-10 rounded-xl border border-cyan-400/45 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 shadow-[0_0_20px_rgba(34,211,238,0.22)]"
                  />
                ) : null}
                <Icon
                  className={cn(
                    'h-3.5 w-3.5 shrink-0 transition-transform duration-200 group-hover:scale-110',
                    isActive ? 'text-cyan-300' : 'text-slate-400 group-hover:text-cyan-300',
                  )}
                  aria-hidden="true"
                />
                <span className={isActive ? 'inline' : 'hidden lg:inline'}>
                  {node.shortLabel}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
