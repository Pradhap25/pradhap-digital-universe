import type { ReactNode } from 'react';

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
  headingId: string;
  action?: ReactNode;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  headingId,
  action,
}: SectionHeadingProps) {
  return (
    <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        <p className="mb-2 font-mono text-xs uppercase tracking-[0.22em] text-cyan-400">
          {eyebrow}
        </p>
        <h2
          id={headingId}
          className="text-2xl font-bold tracking-tight text-white sm:text-3xl"
        >
          {title}
        </h2>
        {description ? (
          <p className="mt-2 text-sm leading-relaxed text-slate-300 sm:text-base">
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
