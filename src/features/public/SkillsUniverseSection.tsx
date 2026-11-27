import { motion, useScroll, useTransform } from 'framer-motion';
import { Cpu, Network, Sparkles } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import { cn } from '@/components/ui/cn';
import { GlassCard } from '@/components/ui/GlassCard';
import { useReducedMotionPref } from '@/hooks/useReducedMotionPref';
import type { SkillCategory, SkillItem } from '@/types/portfolio';

interface SkillsUniverseSectionProps {
  skills: SkillItem[];
  onSkillFocusChange?: (category: 'All' | SkillCategory, skillId: string | null) => void;
}

const CATEGORIES: readonly ('All' | SkillCategory)[] = [
  'All',
  'Programming',
  'AI / Machine Learning',
  'Generative AI / LLM / RAG',
  'Data Science & Analytics',
  'Cloud & Automation',
  'Backend & Deployment',
];

const FLOATING_GLYPHS = ['{ }', 'λ', '∇', 'RAG', 'MCP', 'SQL', 'CNN', '</>'];

export function SkillsUniverseSection({
  skills,
  onSkillFocusChange,
}: SkillsUniverseSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotionPref();
  const [selectedCategory, setSelectedCategory] = useState<'All' | SkillCategory>('All');
  const [inspectedId, setInspectedId] = useState<string | null>(skills[0]?.id ?? null);

  const filteredSkills = useMemo(() => {
    if (selectedCategory === 'All') {
      return skills;
    }
    return skills.filter((skill) => skill.category === selectedCategory);
  }, [skills, selectedCategory]);

  const hoveredSkill =
    skills.find((s) => s.id === inspectedId) ?? filteredSkills[0] ?? skills[0] ?? null;

  const handleSelectCategory = (category: 'All' | SkillCategory) => {
    setSelectedCategory(category);
    onSkillFocusChange?.(category, hoveredSkill?.id ?? null);
  };

  const handleInspectSkill = (skill: SkillItem) => {
    setInspectedId(skill.id);
    onSkillFocusChange?.(selectedCategory, skill.id);
  };

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const latticeY = useTransform(scrollYProgress, [0, 1], ['-6%', '8%']);

  return (
    <section
      ref={sectionRef}
      id="skills"
      aria-labelledby="skills-heading"
      className="snap-section relative flex flex-col justify-center overflow-hidden py-24"
    >
      {/* Crisp Neural Boundary without opaque mist blocking 3D objects */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 border-y border-cyan-500/15"
      />

      {/* Animated Neural Network Constellation SVG Layer */}
      <motion.div
        aria-hidden="true"
        style={reducedMotion ? undefined : { y: latticeY }}
        className="pointer-events-none absolute inset-0 opacity-30"
      >
        <svg className="h-full w-full" viewBox="0 0 1200 700" fill="none">
          <g stroke="#22d3ee" strokeOpacity="0.28" strokeWidth="1">
            <line x1="120" y1="130" x2="380" y2="210" />
            <line x1="380" y1="210" x2="640" y2="120" />
            <line x1="640" y1="120" x2="940" y2="230" />
            <line x1="380" y1="210" x2="480" y2="440" />
            <line x1="640" y1="120" x2="770" y2="410" />
            <line x1="480" y1="440" x2="770" y2="410" />
            <line x1="770" y1="410" x2="1050" y2="520" />
            <line x1="180" y1="510" x2="480" y2="440" />
          </g>
          {[
            [120, 130],
            [380, 210],
            [640, 120],
            [940, 230],
            [480, 440],
            [770, 410],
            [1050, 520],
            [180, 510],
          ].map(([cx, cy], idx) => (
            <circle
              key={idx}
              cx={cx}
              cy={cy}
              r="5"
              fill={idx % 2 === 0 ? '#22d3ee' : '#a855f7'}
            />
          ))}
        </svg>

        {/* Subtle Floating Code/AI Glyphs */}
        <div className="hidden lg:block">
          {FLOATING_GLYPHS.map((glyph, idx) => (
            <span
              key={glyph}
              className="absolute font-mono text-xs text-cyan-300/25"
              style={{
                top: `${14 + ((idx * 17) % 72)}%`,
                left: `${8 + ((idx * 23) % 84)}%`,
              }}
            >
              {glyph}
            </span>
          ))}
        </div>
      </motion.div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-cyan-400">
              05 // Technology Universe
            </p>
            <h2
              id="skills-heading"
              className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl"
            >
              Neural Stack &amp; <span className="text-gradient-universe">Skill Constellation</span>
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-300 sm:text-base">
              Hover or focus any technology node to inspect how it powers real ML pipelines, GenAI retrieval, and cloud systems.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 self-start rounded-xl border border-cyan-400/25 bg-slate-950/75 px-3.5 py-2 font-mono text-xs text-cyan-200">
            <Network className="h-4 w-4 text-cyan-400" aria-hidden="true" />
            <span>{filteredSkills.length} Active Nodes</span>
          </div>
        </div>

        {/* Category Constellation Filter */}
        <div
          role="tablist"
          aria-label="Skill category filters"
          className="mt-8 flex flex-wrap gap-2"
        >
          {CATEGORIES.map((category) => {
            const isSelected = selectedCategory === category;
            return (
              <button
                key={category}
                role="tab"
                type="button"
                aria-selected={isSelected}
                onClick={() => handleSelectCategory(category)}
                className={cn(
                  'cursor-pointer rounded-xl border px-3.5 py-2 text-xs font-medium transition-all',
                  isSelected
                    ? 'border-cyan-400/60 bg-cyan-500/20 text-white shadow-[0_0_20px_rgba(34,211,238,0.2)]'
                    : 'border-slate-800 bg-slate-900/65 text-slate-300 hover:border-cyan-400/35 hover:text-cyan-200',
                )}
              >
                {category}
              </button>
            );
          })}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-12">
          {/* Interactive Skill Constellation Nodes */}
          <div className="lg:col-span-8">
            <GlassCard glowAccent="cyan" className="p-5 sm:p-6">
              <div className="flex flex-wrap gap-2.5">
                {filteredSkills.map((skill, idx) => {
                  const isInspected = hoveredSkill?.id === skill.id;
                  return (
                    <motion.button
                      key={skill.id}
                      type="button"
                      layout={!reducedMotion}
                      initial={reducedMotion ? undefined : { opacity: 0, scale: 0.92 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: false, amount: 0.1 }}
                      transition={{ duration: 0.25, delay: Math.min(idx * 0.015, 0.25) }}
                      onMouseEnter={() => handleInspectSkill(skill)}
                      onFocus={() => handleInspectSkill(skill)}
                      onClick={() => handleInspectSkill(skill)}
                      className={cn(
                        'group relative cursor-pointer rounded-xl border px-3.5 py-2 text-left text-xs font-medium transition-all sm:text-sm',
                        isInspected
                          ? 'border-cyan-300/70 bg-gradient-to-r from-cyan-500/25 via-blue-500/20 to-purple-500/25 text-white shadow-[0_0_24px_rgba(34,211,238,0.28)]'
                          : skill.isFeatured
                            ? 'border-blue-400/30 bg-slate-900/80 text-slate-100 hover:border-cyan-400/50'
                            : 'border-slate-800 bg-slate-950/65 text-slate-300 hover:border-purple-400/45 hover:text-white',
                      )}
                    >
                      <span className="inline-flex items-center gap-2">
                        {skill.logoUrl ? (
                          <img
                            src={skill.logoUrl}
                            alt=""
                            aria-hidden="true"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                            className="h-4 w-4 shrink-0 object-contain"
                          />
                        ) : (
                          <span
                            className={cn(
                              'h-1.5 w-1.5 rounded-full transition-transform group-hover:scale-125',
                              isInspected
                                ? 'bg-cyan-300 shadow-[0_0_8px_#22d3ee]'
                                : skill.isFeatured
                                  ? 'bg-blue-400'
                                  : 'bg-purple-400/70',
                            )}
                          />
                        )}
                        <span>{skill.name}</span>
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </GlassCard>
          </div>

          {/* Interactive Skill Node Inspector */}
          <div className="lg:col-span-4">
            <GlassCard glowAccent="purple" className="flex h-full flex-col justify-between p-6">
              <div>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-purple-300">
                    <Cpu className="h-4 w-4 text-cyan-400" aria-hidden="true" />
                    Node Inspector
                  </span>
                  {hoveredSkill?.isFeatured ? (
                    <span className="inline-flex items-center gap-1 rounded-full border border-cyan-400/35 bg-cyan-500/10 px-2.5 py-0.5 font-mono text-[10px] text-cyan-200">
                      <Sparkles className="h-3 w-3" aria-hidden="true" />
                      Core
                    </span>
                  ) : null}
                </div>

                {hoveredSkill ? (
                  <motion.div
                    key={hoveredSkill.id}
                    initial={reducedMotion ? undefined : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.22 }}
                    className="mt-5"
                  >
                    <div className="flex items-center gap-3">
                      {hoveredSkill.logoUrl ? (
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cyan-400/30 bg-slate-900/80 p-2">
                          <img
                            src={hoveredSkill.logoUrl}
                            alt=""
                            aria-hidden="true"
                            className="h-7 w-7 object-contain"
                          />
                        </span>
                      ) : null}
                      <div>
                        <p className="font-mono text-xs text-cyan-300">
                          {hoveredSkill.category}
                        </p>
                        <h3 className="mt-0.5 text-2xl font-bold text-white">
                          {hoveredSkill.name}
                        </h3>
                      </div>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-slate-300">
                      {hoveredSkill.summary ??
                        'Applied across engineering builds, coursework, and technical workflows.'}
                    </p>
                    {typeof hoveredSkill.proficiency === 'number' ? (
                      <div className="mt-4">
                        <div className="mb-1 flex justify-between font-mono text-[11px] text-slate-400">
                          <span>Proficiency</span>
                          <span className="text-cyan-300">{hoveredSkill.proficiency}%</span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-purple-500"
                            style={{ width: `${Math.min(100, Math.max(0, hoveredSkill.proficiency))}%` }}
                          />
                        </div>
                      </div>
                    ) : null}
                  </motion.div>
                ) : null}
              </div>

              <div className="mt-6 border-t border-slate-800 pt-4 font-mono text-[11px] text-slate-400">
                Fact-verified resume taxonomy &bull; No fabricated percentage bars
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </section>
  );
}
