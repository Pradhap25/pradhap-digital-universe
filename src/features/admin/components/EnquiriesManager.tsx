import { Clock, Mail, Phone, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/components/ui/cn';
import { GlassCard } from '@/components/ui/GlassCard';
import { portfolioRepository } from '@/services/portfolioRepository';
import type { EnquiryItem, EnquiryStatus } from '@/types/portfolio';
import { ConfirmDialog } from './ConfirmDialog';

interface EnquiriesManagerProps {
  enquiries: EnquiryItem[];
  onRefresh: () => Promise<void>;
}

const STATUS_STYLES: Record<EnquiryStatus, string> = {
  new: 'border-cyan-400/50 bg-cyan-500/15 text-cyan-200',
  read: 'border-blue-400/40 bg-blue-500/10 text-blue-200',
  replied: 'border-emerald-400/40 bg-emerald-500/10 text-emerald-200',
  archived: 'border-slate-700 bg-slate-800 text-slate-400',
};

export function EnquiriesManager({ enquiries, onRefresh }: EnquiriesManagerProps) {
  const [statusFilter, setStatusFilter] = useState<'all' | EnquiryStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(enquiries[0]?.id ?? null);
  const [deleteTarget, setDeleteTarget] = useState<EnquiryItem | null>(null);

  const unreadCount = enquiries.filter((e) => e.status === 'new').length;

  const filtered = enquiries.filter((item) => {
    if (statusFilter !== 'all' && item.status !== statusFilter) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.senderName.toLowerCase().includes(q) ||
      item.senderEmail.toLowerCase().includes(q) ||
      item.subject.toLowerCase().includes(q) ||
      item.message.toLowerCase().includes(q)
    );
  });

  const selected =
    filtered.find((e) => e.id === selectedId) ?? filtered[0] ?? null;

  const handleStatusChange = async (id: string, status: EnquiryStatus) => {
    await portfolioRepository.updateEnquiryStatus(id, status);
    await onRefresh();
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    await portfolioRepository.deleteEnquiry(deleteTarget.id);
    if (selectedId === deleteTarget.id) {
      setSelectedId(null);
    }
    setDeleteTarget(null);
    await onRefresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Enquiries Inbox</h2>
          <p className="mt-1 text-sm text-slate-400">
            Private recruiter and collaboration messages submitted through your Contact portal.
          </p>
        </div>
        <span className="rounded-full border border-cyan-400/40 bg-cyan-500/15 px-3.5 py-1.5 font-mono text-xs text-cyan-200">
          {unreadCount} Unread
        </span>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-1.5">
          {(['all', 'new', 'read', 'replied', 'archived'] as const).map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={cn(
                'cursor-pointer rounded-xl border px-3 py-1.5 text-xs font-medium capitalize',
                statusFilter === status
                  ? 'border-cyan-400/55 bg-cyan-500/20 text-white'
                  : 'border-slate-800 bg-slate-900/70 text-slate-300 hover:border-slate-700',
              )}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="relative sm:w-64">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search enquiries..."
            className="w-full rounded-xl border border-slate-800 bg-slate-950/75 py-2 pr-3 pl-9 text-xs text-white placeholder:text-slate-500"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <GlassCard className="py-12 text-center">
          <Mail className="mx-auto h-8 w-8 text-slate-500" aria-hidden="true" />
          <p className="mt-3 text-sm text-slate-300">No enquiries found.</p>
        </GlassCard>
      ) : (
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Enquiry List */}
          <div className="space-y-2.5 lg:col-span-5">
            {filtered.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedId(item.id)}
                className={cn(
                  'w-full cursor-pointer rounded-2xl border p-4 text-left transition-all',
                  selected?.id === item.id
                    ? 'glass-panel border-cyan-400/55'
                    : 'border-slate-800/80 bg-slate-950/60 hover:border-slate-700',
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-sm font-semibold text-white">
                    {item.senderName}
                  </span>
                  <span
                    className={cn(
                      'rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase',
                      STATUS_STYLES[item.status],
                    )}
                  >
                    {item.status}
                  </span>
                </div>
                <p className="mt-1 truncate text-xs text-cyan-200">{item.subject}</p>
                <p className="mt-1 truncate text-xs text-slate-400">{item.message}</p>
              </button>
            ))}
          </div>

          {/* Enquiry Detail Reader */}
          {selected ? (
            <div className="lg:col-span-7">
              <GlassCard className="space-y-5 p-6">
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-800 pb-4">
                  <div>
                    <span className="font-mono text-[11px] uppercase tracking-wider text-purple-300">
                      {selected.opportunityType}
                    </span>
                    <h3 className="mt-1 text-xl font-bold text-white">
                      {selected.subject}
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={() => setDeleteTarget(selected)}
                    aria-label="Delete enquiry"
                    className="cursor-pointer rounded-xl border border-rose-500/30 bg-rose-500/10 p-2 text-rose-300 hover:bg-rose-500/20"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid gap-2 text-xs text-slate-300 sm:grid-cols-2">
                  <p>
                    <strong className="text-slate-400">From:</strong> {selected.senderName}
                  </p>
                  <p className="inline-flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-cyan-400" aria-hidden="true" />
                    <a href={`mailto:${selected.senderEmail}`} className="text-cyan-300 hover:underline">
                      {selected.senderEmail}
                    </a>
                  </p>
                  {selected.senderPhone ? (
                    <p className="inline-flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5 text-blue-400" aria-hidden="true" />
                      <span>{selected.senderPhone}</span>
                    </p>
                  ) : null}
                  <p className="inline-flex items-center gap-1.5 text-slate-400">
                    <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>{new Date(selected.createdAt).toLocaleString()}</span>
                  </p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950/75 p-4 text-sm leading-relaxed whitespace-pre-wrap text-slate-200">
                  {selected.message}
                </div>

                <div className="flex flex-wrap items-center gap-2 border-t border-slate-800 pt-4">
                  <span className="mr-2 font-mono text-xs text-slate-400">Mark as:</span>
                  {(['new', 'read', 'replied', 'archived'] as const).map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => void handleStatusChange(selected.id, status)}
                      className={cn(
                        'cursor-pointer rounded-xl border px-3 py-1.5 text-xs font-medium capitalize',
                        selected.status === status
                          ? STATUS_STYLES[status]
                          : 'border-slate-800 bg-slate-900/70 text-slate-300 hover:border-slate-700',
                      )}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </GlassCard>
            </div>
          ) : null}
        </div>
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete Enquiry?"
        description={`Permanently delete the message from "${deleteTarget?.senderName ?? ''}"?`}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => void handleConfirmDelete()}
      />
    </div>
  );
}
