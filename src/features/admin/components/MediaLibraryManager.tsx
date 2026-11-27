import { Check, Copy, FileText, Trash2, Upload } from 'lucide-react';
import { type ChangeEvent, useState } from 'react';
import { cn } from '@/components/ui/cn';
import { GlassCard } from '@/components/ui/GlassCard';
import { portfolioRepository } from '@/services/portfolioRepository';
import type { MediaAsset, MediaCategory } from '@/types/portfolio';
import { ConfirmDialog } from './ConfirmDialog';

interface MediaLibraryManagerProps {
  assets: MediaAsset[];
  onRefresh: () => Promise<void>;
}

const CATEGORIES: { value: MediaCategory; label: string }[] = [
  { value: 'image', label: 'Project / General Image' },
  { value: 'company-logo', label: 'Company Logo' },
  { value: 'tech-logo', label: 'Technology Logo' },
  { value: 'certificate', label: 'Certificate PDF / Image' },
  { value: 'research-paper', label: 'Research Paper PDF' },
  { value: 'portrait', label: 'Personal Portrait' },
];

export function MediaLibraryManager({ assets, onRefresh }: MediaLibraryManagerProps) {
  const [uploadCategory, setUploadCategory] = useState<MediaCategory>('image');
  const [filterCategory, setFilterCategory] = useState<'all' | MediaCategory>('all');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MediaAsset | null>(null);

  const handleUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    setIsUploading(true);
    setError(null);
    try {
      await portfolioRepository.uploadMediaAsset(file, uploadCategory);
      await onRefresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCopy = async (asset: MediaAsset) => {
    try {
      await navigator.clipboard.writeText(asset.url);
      setCopiedId(asset.id);
      setTimeout(() => setCopiedId(null), 1800);
    } catch {
      // Clipboard unavailable
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    await portfolioRepository.deleteMediaAsset(deleteTarget);
    setDeleteTarget(null);
    await onRefresh();
  };

  const filtered =
    filterCategory === 'all'
      ? assets
      : assets.filter((a) => a.category === filterCategory);

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Media Library</h2>
          <p className="mt-1 text-sm text-slate-400">
            Upload and reuse images, company/tech logos, certificates, and research PDFs (max 5 MB).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            aria-label="Upload asset category"
            value={uploadCategory}
            onChange={(e) => setUploadCategory(e.target.value as MediaCategory)}
            className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white"
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>

          <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 px-4 py-2 text-xs font-semibold text-slate-950">
            <Upload className="h-4 w-4" aria-hidden="true" />
            <span>{isUploading ? 'Uploading...' : 'Upload Asset'}</span>
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/svg+xml,application/pdf"
              disabled={isUploading}
              onChange={handleUpload}
              className="sr-only"
            />
          </label>
        </div>
      </div>

      {error ? (
        <p className="rounded-xl border border-rose-500/35 bg-rose-500/10 px-4 py-2.5 text-xs text-rose-200">
          {error}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-1.5">
        <button
          type="button"
          onClick={() => setFilterCategory('all')}
          className={cn(
            'cursor-pointer rounded-xl border px-3 py-1.5 text-xs font-medium',
            filterCategory === 'all'
              ? 'border-cyan-400/55 bg-cyan-500/20 text-white'
              : 'border-slate-800 bg-slate-900/70 text-slate-300',
          )}
        >
          All ({assets.length})
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            type="button"
            onClick={() => setFilterCategory(cat.value)}
            className={cn(
              'cursor-pointer rounded-xl border px-3 py-1.5 text-xs font-medium',
              filterCategory === cat.value
                ? 'border-cyan-400/55 bg-cyan-500/20 text-white'
                : 'border-slate-800 bg-slate-900/70 text-slate-300',
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <GlassCard className="py-12 text-center">
          <p className="text-sm text-slate-400">
            No media assets uploaded in this category yet.
          </p>
        </GlassCard>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((asset) => (
            <GlassCard key={asset.id} className="flex flex-col justify-between p-4">
              <div>
                <div className="flex h-36 items-center justify-center overflow-hidden rounded-xl border border-slate-800 bg-slate-950/80 p-3">
                  {asset.mimeType === 'application/pdf' ? (
                    <div className="flex flex-col items-center gap-2 text-cyan-300">
                      <FileText className="h-10 w-10" aria-hidden="true" />
                      <span className="font-mono text-[11px]">PDF Document</span>
                    </div>
                  ) : (
                    <img
                      src={asset.url}
                      alt={asset.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  )}
                </div>

                <h3 className="mt-3 truncate text-sm font-semibold text-white">
                  {asset.name}
                </h3>
                <p className="mt-0.5 font-mono text-[11px] text-slate-400">
                  {asset.category} &bull; {(asset.sizeBytes / 1024).toFixed(1)} KB
                </p>
              </div>

              <div className="mt-4 flex items-center justify-between gap-2 border-t border-slate-800 pt-3">
                <button
                  type="button"
                  onClick={() => void handleCopy(asset)}
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-xs text-slate-200 hover:border-cyan-400/50"
                >
                  {copiedId === asset.id ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-cyan-400" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy URL</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setDeleteTarget(asset)}
                  aria-label={`Delete ${asset.name}`}
                  className="cursor-pointer rounded-lg border border-rose-500/30 bg-rose-500/10 p-1.5 text-rose-300 hover:bg-rose-500/20"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete Media Asset?"
        description={`Remove "${deleteTarget?.name ?? ''}" from your Media Library? Sections still referencing this URL may lose their preview.`}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => void handleConfirmDelete()}
      />
    </div>
  );
}
