import type { EducationItem } from '@/types/portfolio';

interface EducationSectionProps {
  education: EducationItem[];
}

interface AcademicMeta {
  category: string;
  subtitle: string;
}

function getAcademicMeta(item: EducationItem, index: number): AcademicMeta {
  const haystack = `${item.id} ${item.degree} ${item.institution}`.toLowerCase();
  const isSchooling =
    haystack.includes('school') ||
    haystack.includes('higher secondary') ||
    haystack.includes('10th') ||
    haystack.includes('12th') ||
    index > 0;

  if (isSchooling) {
    return {
      category: 'SCHOOLING',
      subtitle: 'Higher Secondary',
    };
  }

  return {
    category: 'COLLEGE',
    subtitle: 'Undergraduate',
  };
}

export function EducationSection({ education }: EducationSectionProps) {
  return (
    <section
      id="education"
      aria-labelledby="education-heading"
      className="snap-section relative mx-auto flex w-full max-w-7xl flex-col justify-center px-4 py-24 sm:px-6 lg:px-8"
    >
      <div className="mx-auto w-full max-w-5xl">
        <header className="mb-10">
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-cyan-400">
            03 // Education
          </p>
          <h2
            id="education-heading"
            className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl"
          >
            Academic <span className="text-gradient-universe">Foundation</span>
          </h2>
        </header>

        {education.length === 0 ? (
          <div className="rounded-2xl border border-slate-800/80 bg-slate-950/60 py-10 text-center backdrop-blur-md">
            <p className="text-sm text-slate-400">No education entries published yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-800/80">
            {education.map((edu, index) => {
              const meta = getAcademicMeta(edu, index);
              const period = edu.startDate ? `${edu.startDate} – ${edu.endDate}` : edu.endDate;
              const qualification = edu.fieldOfStudy
                ? `${edu.degree} – ${edu.fieldOfStudy}`
                : edu.degree;
              const performanceParts = edu.gradeOrGpa
                ? edu.gradeOrGpa
                    .split('|')
                    .map((part) => part.trim())
                    .filter(Boolean)
                : [];

              return (
                <article
                  key={edu.id}
                  className="grid gap-5 py-8 first:pt-0 last:pb-0 md:grid-cols-12 md:items-start md:gap-8"
                >
                  {/* LEFT SIDE – Academic Category */}
                  <div className="border-l-2 border-cyan-400/50 pl-4 md:col-span-4 md:py-1">
                    <p className="font-mono text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">
                      {meta.category}
                    </p>
                    <p className="mt-2 font-mono text-lg font-semibold tracking-tight text-white sm:text-xl">
                      {period}
                    </p>
                    <p className="mt-1 text-sm text-slate-400">{meta.subtitle}</p>
                  </div>

                  {/* RIGHT SIDE – Information Panel */}
                  <div className="rounded-2xl border border-cyan-400/18 bg-slate-950/60 p-6 backdrop-blur-md transition-colors hover:border-cyan-400/35 sm:p-7 md:col-span-8">
                    <h3 className="text-lg font-bold tracking-tight text-white sm:text-xl">
                      {edu.institution}
                    </h3>
                    <p className="mt-1.5 text-sm font-medium text-blue-200 sm:text-base">
                      {qualification}
                    </p>

                    {edu.description ? (
                      <p className="mt-3 text-sm leading-relaxed text-slate-300">
                        {edu.description}
                      </p>
                    ) : null}

                    {performanceParts.length > 0 ? (
                      <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-slate-800/80 pt-4 font-mono text-xs text-cyan-300">
                        {performanceParts.map((part) => (
                          <span key={part} className="font-medium">
                            {part}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
