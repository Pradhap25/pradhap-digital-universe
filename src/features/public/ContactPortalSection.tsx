import { motion } from 'framer-motion';
import {
  AlertCircle,
  CheckCircle2,
  Code2,
  ExternalLink,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Send,
} from 'lucide-react';
import { type FormEvent, type ReactNode, useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { NeonButton } from '@/components/ui/NeonButton';
import { useReducedMotionPref } from '@/hooks/useReducedMotionPref';
import { portfolioRepository } from '@/services/portfolioRepository';
import type { EnquiryPayload, SiteProfile } from '@/types/portfolio';

interface ContactPortalSectionProps {
  profile: SiteProfile;
  footer?: ReactNode;
}

export function ContactPortalSection({ profile, footer }: ContactPortalSectionProps) {
  const reducedMotion = useReducedMotionPref();
  const [formState, setFormState] = useState<EnquiryPayload>({
    senderName: '',
    senderEmail: '',
    senderPhone: '',
    opportunityType: 'Recruiter',
    subject: '',
    message: '',
    honeypot: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setFeedback(null);

    try {
      const result = await portfolioRepository.submitEnquiry(formState);
      if (result.accepted) {
        setFeedback({
          ok: true,
          text:
            result.mode === 'supabase'
              ? 'Enquiry received and stored safely. Thank you for reaching out.'
              : 'Enquiry saved in Local Browser CMS and ready in your Admin Enquiries inbox.',
        });
        setFormState({
          senderName: '',
          senderEmail: '',
          senderPhone: '',
          opportunityType: 'Recruiter',
          subject: '',
          message: '',
          honeypot: '',
        });
      } else {
        setFeedback({
          ok: false,
          text: result.error ?? 'Please verify your details and try again.',
        });
      }
    } catch (err) {
      setFeedback({
        ok: false,
        text: err instanceof Error ? err.message : 'Unable to send enquiry right now.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="snap-section relative flex flex-col justify-between pt-24"
    >
      <div className="mx-auto flex w-full max-w-7xl flex-1 items-center px-4 pb-10 sm:px-6 lg:px-8">
        <motion.div
          initial={reducedMotion ? undefined : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="grid w-full items-center gap-8 lg:grid-cols-12"
        >
          {/* Left Floating Portal Info */}
          <div className="flex flex-col justify-between space-y-6 lg:col-span-5">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.24em] text-cyan-400">
                11 // Connect With the Future
              </p>
              <h2
                id="contact-heading"
                className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl"
              >
                Open for <span className="text-gradient-universe">Impact &amp; Collaboration</span>
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-300 sm:text-base">
                Reach out for AI/ML engineering roles, data analytics opportunities, research collaborations, or technical discussions.
              </p>
            </div>

            <GlassCard glowAccent="cyan" className="space-y-3 p-5">
              {profile.location ? (
                <div className="flex items-center justify-between rounded-xl border border-slate-800/80 bg-slate-950/45 px-4 py-2.5 text-xs text-slate-300">
                  <span className="inline-flex items-center gap-2.5">
                    <MapPin className="h-4 w-4 text-cyan-400" aria-hidden="true" />
                    <span>{profile.location}</span>
                  </span>
                </div>
              ) : null}

              {profile.contactEmail ? (
                <a
                  href={`mailto:${profile.contactEmail}`}
                  className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/65 px-4 py-3 text-sm text-slate-200 transition-colors hover:border-cyan-400/45 hover:text-cyan-200"
                >
                  <span className="inline-flex items-center gap-2.5">
                    <Mail className="h-4 w-4 text-cyan-400" aria-hidden="true" />
                    <span>Direct Email Contact</span>
                  </span>
                  <span className="font-mono text-xs text-cyan-300">Compose</span>
                </a>
              ) : null}

              {profile.contactPhone ? (
                <a
                  href={`tel:${profile.contactPhone}`}
                  className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/65 px-4 py-3 text-sm text-slate-200 transition-colors hover:border-cyan-400/45 hover:text-cyan-200"
                >
                  <span className="inline-flex items-center gap-2.5">
                    <Phone className="h-4 w-4 text-cyan-400" aria-hidden="true" />
                    <span>{profile.contactPhone}</span>
                  </span>
                  <span className="font-mono text-xs text-slate-400">Call</span>
                </a>
              ) : null}

              {profile.githubUrl ? (
                <a
                  href={profile.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/65 px-4 py-3 text-sm text-slate-200 transition-colors hover:border-cyan-400/45 hover:text-cyan-200"
                >
                  <span className="inline-flex items-center gap-2.5">
                    <Github className="h-4 w-4 text-blue-400" aria-hidden="true" />
                    <span>GitHub</span>
                  </span>
                  <span className="font-mono text-xs text-slate-400">Open</span>
                </a>
              ) : null}

              {profile.leetcodeUrl ? (
                <a
                  href={profile.leetcodeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/65 px-4 py-3 text-sm text-slate-200 transition-colors hover:border-purple-400/45 hover:text-purple-200"
                >
                  <span className="inline-flex items-center gap-2.5">
                    <Code2 className="h-4 w-4 text-purple-400" aria-hidden="true" />
                    <span>LeetCode</span>
                  </span>
                  <span className="font-mono text-xs text-slate-400">Open</span>
                </a>
              ) : null}

              {profile.linkedinUrl ? (
                <a
                  href={profile.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/65 px-4 py-3 text-sm text-slate-200 transition-colors hover:border-blue-400/45 hover:text-blue-200"
                >
                  <span className="inline-flex items-center gap-2.5">
                    <Linkedin className="h-4 w-4 text-blue-400" aria-hidden="true" />
                    <span>LinkedIn Profile</span>
                  </span>
                  <span className="font-mono text-xs text-slate-400">Open</span>
                </a>
              ) : null}

              {(profile.otherSocialLinks ?? []).map((link) => (
                <a
                  key={`${link.label}-${link.url}`}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/65 px-4 py-3 text-sm text-slate-200 transition-colors hover:border-cyan-400/45 hover:text-cyan-200"
                >
                  <span className="inline-flex items-center gap-2.5">
                    <ExternalLink className="h-4 w-4 text-cyan-400" aria-hidden="true" />
                    <span>{link.label}</span>
                  </span>
                  <span className="font-mono text-xs text-slate-400">Open</span>
                </a>
              ))}
            </GlassCard>
          </div>

          {/* Right Collaboration Enquiry Form */}
          <div className="lg:col-span-7">
            <GlassCard glowAccent="purple" className="p-6 sm:p-8">
              <h3 className="text-xl font-bold text-white">Send a Collaboration Enquiry</h3>
              <p className="mt-1 text-xs text-slate-400">
                Messages are stored privately for Admin review only.
              </p>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                {/* Honeypot anti-spam trap */}
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  value={formState.honeypot ?? ''}
                  onChange={(e) =>
                    setFormState((prev) => ({ ...prev, honeypot: e.target.value }))
                  }
                  className="hidden"
                />

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="enquiry-name" className="mb-1.5 block text-xs font-medium text-slate-300">
                      Full Name
                    </label>
                    <input
                      id="enquiry-name"
                      type="text"
                      required
                      value={formState.senderName}
                      onChange={(e) =>
                        setFormState((prev) => ({ ...prev, senderName: e.target.value }))
                      }
                      placeholder="Recruiter / Collaborator Name"
                      className="w-full rounded-xl border border-slate-700/90 bg-slate-950/75 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="enquiry-email" className="mb-1.5 block text-xs font-medium text-slate-300">
                      Email Address
                    </label>
                    <input
                      id="enquiry-email"
                      type="email"
                      required
                      value={formState.senderEmail}
                      onChange={(e) =>
                        setFormState((prev) => ({ ...prev, senderEmail: e.target.value }))
                      }
                      placeholder="you@organization.com"
                      className="w-full rounded-xl border border-slate-700/90 bg-slate-950/75 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label htmlFor="enquiry-phone" className="mb-1.5 block text-xs font-medium text-slate-300">
                      Phone Number (Optional)
                    </label>
                    <input
                      id="enquiry-phone"
                      type="tel"
                      value={formState.senderPhone ?? ''}
                      onChange={(e) =>
                        setFormState((prev) => ({ ...prev, senderPhone: e.target.value }))
                      }
                      placeholder="+91 ..."
                      className="w-full rounded-xl border border-slate-700/90 bg-slate-950/75 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="enquiry-type" className="mb-1.5 block text-xs font-medium text-slate-300">
                      Opportunity Type
                    </label>
                    <select
                      id="enquiry-type"
                      value={formState.opportunityType}
                      onChange={(e) =>
                        setFormState((prev) => ({
                          ...prev,
                          opportunityType: e.target.value as EnquiryPayload['opportunityType'],
                        }))
                      }
                      className="w-full rounded-xl border border-slate-700/90 bg-slate-950/75 px-3.5 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none"
                    >
                      <option value="Recruiter">Recruiter / Hiring</option>
                      <option value="Collaboration">Research / AI Collaboration</option>
                      <option value="Freelance">Engineering Consulting</option>
                      <option value="General">General Enquiry</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="enquiry-subject" className="mb-1.5 block text-xs font-medium text-slate-300">
                      Subject
                    </label>
                    <input
                      id="enquiry-subject"
                      type="text"
                      required
                      value={formState.subject}
                      onChange={(e) =>
                        setFormState((prev) => ({ ...prev, subject: e.target.value }))
                      }
                      placeholder="Role, project, or topic"
                      className="w-full rounded-xl border border-slate-700/90 bg-slate-950/75 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="enquiry-message" className="mb-1.5 block text-xs font-medium text-slate-300">
                    Message
                  </label>
                  <textarea
                    id="enquiry-message"
                    rows={4}
                    required
                    value={formState.message}
                    onChange={(e) =>
                      setFormState((prev) => ({ ...prev, message: e.target.value }))
                    }
                    placeholder="Share role details, project context, or collaboration goals..."
                    className="w-full rounded-xl border border-slate-700/90 bg-slate-950/75 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
                  <NeonButton type="submit" disabled={isSubmitting}>
                    <Send className="h-4 w-4" aria-hidden="true" />
                    <span>{isSubmitting ? 'Transmitting...' : 'Send Enquiry'}</span>
                  </NeonButton>

                  {feedback ? (
                    <p
                      role="status"
                      className={`inline-flex items-center gap-2 text-xs ${
                        feedback.ok ? 'text-cyan-200' : 'text-rose-300'
                      }`}
                    >
                      {feedback.ok ? (
                        <CheckCircle2 className="h-4 w-4 text-cyan-400" aria-hidden="true" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-rose-400" aria-hidden="true" />
                      )}
                      <span>{feedback.text}</span>
                    </p>
                  ) : null}
                </div>
              </form>
            </GlassCard>
          </div>
        </motion.div>
      </div>
      {footer}
    </section>
  );
}
