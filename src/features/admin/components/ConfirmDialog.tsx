import { AlertTriangle } from 'lucide-react';
import { NeonButton } from '@/components/ui/NeonButton';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  isBusy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Delete Permanently',
  isBusy = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4 backdrop-blur-sm"
    >
      <div className="glass-panel w-full max-w-md rounded-2xl border border-rose-500/35 p-6">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-rose-500/35 bg-rose-500/15 text-rose-300">
            <AlertTriangle className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <h2 id="confirm-dialog-title" className="text-lg font-bold text-white">
              {title}
            </h2>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-300">
              {description}
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <NeonButton variant="ghost" onClick={onCancel} disabled={isBusy}>
            Cancel
          </NeonButton>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isBusy}
            className="cursor-pointer rounded-xl border border-rose-400/50 bg-rose-600/80 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-rose-500 disabled:opacity-50"
          >
            {isBusy ? 'Deleting...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
