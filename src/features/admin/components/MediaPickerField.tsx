import {
  Building2,
  Cpu,
  FileText,
  FolderOpen,
  Image as ImageIcon,
  Search,
  Sparkles,
  Trash2,
  Upload,
} from 'lucide-react';
import { type ChangeEvent, useEffect, useState } from 'react';
import {
  type BrandAssetKind,
  resolveBrandLogo,
  searchBrandLogos,
} from '@/services/logoResolver';
import { portfolioRepository } from '@/services/portfolioRepository';
import type { MediaAsset, MediaCategory } from '@/types/portfolio';

interface MediaPickerFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  mediaCategory: MediaCategory;
  accept?: string;
  autoLogoKind?: BrandAssetKind;
  autoLogoQuery?: string;
  placeholder?: string;
}

export function MediaPickerField({
  label,
  value,
  onChange,
  mediaCategory,
  accept = 'image/png,image/jpeg,image/webp,image/svg+xml,application/pdf',
  autoLogoKind,
  autoLogoQuery,
  placeholder = 'https://... or upload / select asset',
}: MediaPickerFieldProps) {
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [previewError, setPreviewError] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);
  const [showCatalog, setShowCatalog] = useState(false);
  const [catalogFilter, setCatalogFilter] = useState('');
  const [libraryAssets, setLibraryAssets] = useState<MediaAsset[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    setPreviewError(false);
  }, [value]);

  const loadLibrary = async () => {
    const items = await portfolioRepository.getMediaAssets();
    setLibraryAssets(items);
  };

  const handleAutoDetect = () => {
    if (!autoLogoKind) return;
    const res = resolveBrandLogo(autoLogoQuery ?? '', autoLogoKind);
    if (res.found && res.url) {
      onChange(res.url);
      setPreviewError(false);
      setStatusMessage(`Detected ${res.matchedName} (${res.source}).`);
    } else {
      setStatusMessage(
        res.note ?? 'No verified logo found automatically. Upload or paste a URL.',
      );
    }
  };

  const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    setIsUploading(true);
    setStatusMessage(null);
    try {
      const asset = await portfolioRepository.uploadMediaAsset(file, mediaCategory);
      onChange(asset.url);
      setPreviewError(false);
      setStatusMessage(`Uploaded "${asset.name}" to Media Library.`);
    } catch (err) {
      setStatusMessage(err instanceof Error ? err.message : 'Upload failed.');
    } finally {
      setIsUploading(false);
    }
  };

  const isPdf =
    value.toLowerCase().endsWith('.pdf') || value.startsWith('data:application/pdf');
  const catalogMatches = searchBrandLogos(catalogFilter);

  return (
    <div className="space-y-2 rounded-xl border border-slate-800/90 bg-slate-950/60 p-3.5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-medium text-slate-300">{label}</span>
        <div className="flex flex-wrap items-center gap-1.5">
          {autoLogoKind ? (
            <button
              type="button"
              onClick={handleAutoDetect}
              className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-cyan-400/35 bg-cyan-500/10 px-2.5 py-1 text-[11px] font-medium text-cyan-200 hover:bg-cyan-500/20"
            >
              <Sparkles className="h-3 w-3" aria-hidden="true" />
              <span>Auto-Detect Logo</span>
            </button>
          ) : null}

          {autoLogoKind ? (
            <button
              type="button"
              onClick={() => {
                setShowCatalog((prev) => !prev);
                setShowLibrary(false);
              }}
              className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1 text-[11px] text-slate-200 hover:border-cyan-400/40"
            >
              <Search className="h-3 w-3" aria-hidden="true" />
              <span>Icon Catalog</span>
            </button>
          ) : null}

          <label className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-purple-400/35 bg-purple-500/10 px-2.5 py-1 text-[11px] font-medium text-purple-200 hover:bg-purple-500/20">
            <Upload className="h-3 w-3" aria-hidden="true" />
            <span>{isUploading ? 'Uploading...' : 'Upload'}</span>
            <input
              type="file"
              accept={accept}
              disabled={isUploading}
              onChange={handleFileUpload}
              className="sr-only"
            />
          </label>

          <button
            type="button"
            onClick={() => {
              const next = !showLibrary;
              setShowLibrary(next);
              setShowCatalog(false);
              if (next) void loadLibrary();
            }}
            className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1 text-[11px] text-slate-200 hover:border-cyan-400/40"
          >
            <FolderOpen className="h-3 w-3" aria-hidden="true" />
            <span>Library</span>
          </button>

          {value ? (
            <button
              type="button"
              onClick={() => {
                onChange('');
                setStatusMessage('Asset cleared.');
              }}
              aria-label={`Remove ${label}`}
              className="inline-flex cursor-pointer items-center rounded-lg border border-rose-500/30 bg-rose-500/10 p-1 text-rose-300 hover:bg-rose-500/20"
            >
              <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          ) : null}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Safe Live Preview with Fallback */}
        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-700/80 bg-slate-900/90 p-1.5">
          {value && isPdf ? (
            <FileText className="h-6 w-6 text-cyan-300" aria-hidden="true" />
          ) : value && !previewError ? (
            <img
              src={value}
              alt={`${label} preview`}
              onError={() => setPreviewError(true)}
              className="h-full w-full object-contain"
            />
          ) : autoLogoKind === 'company' ? (
            <Building2 className="h-5 w-5 text-slate-500" aria-hidden="true" />
          ) : autoLogoKind === 'technology' ? (
            <Cpu className="h-5 w-5 text-slate-500" aria-hidden="true" />
          ) : (
            <ImageIcon className="h-5 w-5 text-slate-500" aria-hidden="true" />
          )}
        </div>

        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-xl border border-slate-700/90 bg-slate-900/80 px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
        />
      </div>

      {statusMessage ? (
        <p className="font-mono text-[11px] text-cyan-300">{statusMessage}</p>
      ) : null}

      {previewError && value ? (
        <p className="font-mono text-[11px] text-amber-300">
          Preview could not load from that URL; category fallback icon will be used publicly.
        </p>
      ) : null}

      {showCatalog ? (
        <div className="mt-2 space-y-2 rounded-xl border border-slate-800 bg-slate-900/90 p-3">
          <input
            type="text"
            value={catalogFilter}
            onChange={(e) => setCatalogFilter(e.target.value)}
            placeholder="Search verified logos (Python, React, Azure, SAP, LivaNova...)"
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-1.5 text-xs text-white placeholder:text-slate-500"
          />
          <div className="grid max-h-40 grid-cols-2 gap-1.5 overflow-y-auto sm:grid-cols-3">
            {catalogMatches.map((entry) => (
              <button
                key={entry.canonical}
                type="button"
                onClick={() => {
                  onChange(entry.url);
                  setShowCatalog(false);
                  setStatusMessage(`Selected ${entry.canonical} (${entry.source}).`);
                }}
                className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-800 bg-slate-950/80 px-2.5 py-1.5 text-left text-xs text-slate-200 hover:border-cyan-400/50"
              >
                <img src={entry.url} alt="" className="h-4 w-4 shrink-0 object-contain" />
                <span className="truncate">{entry.canonical}</span>
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {showLibrary ? (
        <div className="mt-2 rounded-xl border border-slate-800 bg-slate-900/90 p-3">
          {libraryAssets.length === 0 ? (
            <p className="text-xs text-slate-400">
              No uploaded assets in Media Library yet. Use Upload above to add one.
            </p>
          ) : (
            <div className="grid max-h-44 grid-cols-2 gap-2 overflow-y-auto sm:grid-cols-3">
              {libraryAssets.map((asset) => (
                <button
                  key={asset.id}
                  type="button"
                  onClick={() => {
                    onChange(asset.url);
                    setShowLibrary(false);
                    setStatusMessage(`Selected "${asset.name}" from Media Library.`);
                  }}
                  className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-800 bg-slate-950/80 p-2 text-left text-xs text-slate-200 hover:border-cyan-400/50"
                >
                  {asset.mimeType === 'application/pdf' ? (
                    <FileText className="h-4 w-4 shrink-0 text-cyan-300" />
                  ) : (
                    <img src={asset.url} alt="" className="h-5 w-5 shrink-0 object-contain" />
                  )}
                  <span className="truncate">{asset.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
