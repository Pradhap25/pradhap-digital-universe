import {
  ArrowDown,
  ArrowUp,
  Edit3,
  Eye,
  EyeOff,
  Plus,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import { type FormEvent, useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { NeonButton } from '@/components/ui/NeonButton';
import { resolveBrandLogo } from '@/services/logoResolver';
import { portfolioRepository } from '@/services/portfolioRepository';
import type { CmsCollectionKey } from '@/types/portfolio';
import { CMS_SCHEMAS, type CmsFieldConfig } from '../cmsSchemas';
import { ConfirmDialog } from './ConfirmDialog';
import { MediaPickerField } from './MediaPickerField';

interface CrudItemBase {
  id: string;
  sortOrder: number;
  isPublished: boolean;
  [key: string]: unknown;
}

interface CrudSectionManagerProps {
  collection: CmsCollectionKey;
  items: CrudItemBase[];
  onRefresh: () => Promise<void>;
}

export function CrudSectionManager({
  collection,
  items,
  onRefresh,
}: CrudSectionManagerProps) {
  const schema = CMS_SCHEMAS[collection];
  const sortedItems = [...items].sort((a, b) => a.sortOrder - b.sortOrder);

  const [query, setQuery] = useState('');
  const [editingItem, setEditingItem] = useState<Record<string, unknown> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CrudItemBase | null>(null);

  const filteredItems = sortedItems.filter((item) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    const primary = String(item[schema.primaryField] ?? '').toLowerCase();
    const secondary = schema.secondaryField
      ? String(item[schema.secondaryField] ?? '').toLowerCase()
      : '';
    return primary.includes(q) || secondary.includes(q);
  });

  const openCreate = () => {
    setIsNew(true);
    setSaveError(null);
    setEditingItem({
      ...schema.defaultValues,
      sortOrder: sortedItems.length + 1,
    });
  };

  const openEdit = (item: CrudItemBase) => {
    setIsNew(false);
    setSaveError(null);
    setEditingItem({ ...item });
  };

  const updateField = (key: string, value: unknown) => {
    setEditingItem((prev) => {
      if (!prev) return prev;
      const next = { ...prev, [key]: value };

      // Auto-suggest logo when editing the primary trigger field on new items if logo is currently blank
      if (isNew) {
        for (const field of schema.fields) {
          if (
            field.kind === 'media' &&
            field.autoLogoKind &&
            field.autoLogoSourceField === key &&
            !String(next[field.key] ?? '').trim()
          ) {
            const resolved = resolveBrandLogo(String(value ?? ''), field.autoLogoKind);
            if (resolved.found && resolved.url) {
              next[field.key] = resolved.url;
            }
          }
        }
      }

      return next;
    });
  };

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingItem) return;

    setIsSaving(true);
    setSaveError(null);

    try {
      const payload = { ...editingItem };
      if (collection === 'projects' && !String(payload.slug ?? '').trim()) {
        payload.slug = String(payload.title ?? 'project')
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '');
      }

      await portfolioRepository.upsertItem(
        collection,
        payload as never,
      );
      setEditingItem(null);
      await onRefresh();
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Unable to save item.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTogglePublished = async (item: CrudItemBase) => {
    await portfolioRepository.upsertItem(collection, {
      ...item,
      isPublished: !item.isPublished,
    } as never);
    await onRefresh();
  };

  const handleMove = async (index: number, direction: -1 | 1) => {
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= sortedItems.length) return;
    const reordered = [...sortedItems];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIdx, 0, moved);
    await portfolioRepository.reorderItems(
      collection,
      reordered.map((x) => x.id),
    );
    await onRefresh();
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    await portfolioRepository.deleteItem(collection, deleteTarget.id);
    setDeleteTarget(null);
    await onRefresh();
  };

  const renderField = (field: CmsFieldConfig) => {
    if (!editingItem) return null;
    const val = editingItem[field.key];

    if (field.kind === 'checkbox') {
      return (
        <label
          key={field.key}
          className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-slate-800 bg-slate-950/60 px-3.5 py-2.5 text-xs font-medium text-slate-200"
        >
          <input
            type="checkbox"
            checked={Boolean(val)}
            onChange={(e) => updateField(field.key, e.target.checked)}
            className="h-4 w-4 rounded border-slate-600 accent-cyan-400"
          />
          <span>{field.label}</span>
        </label>
      );
    }

    if (field.kind === 'media') {
      const autoSourceVal = field.autoLogoSourceField
        ? String(editingItem[field.autoLogoSourceField] ?? '')
        : '';

      return (
        <div key={field.key} className={field.colSpan2 ? 'sm:col-span-2' : undefined}>
          <MediaPickerField
            label={field.label}
            value={String(val ?? '')}
            onChange={(nextUrl) => updateField(field.key, nextUrl)}
            mediaCategory={field.mediaCategory ?? 'image'}
            autoLogoKind={field.autoLogoKind}
            autoLogoQuery={autoSourceVal}
            accept={field.accept}
          />
        </div>
      );
    }

    if (field.kind === 'select') {
      return (
        <div key={field.key} className={field.colSpan2 ? 'sm:col-span-2' : undefined}>
          <label className="mb-1.5 block text-xs font-medium text-slate-300">
            {field.label}
          </label>
          <select
            value={String(val ?? '')}
            onChange={(e) => updateField(field.key, e.target.value)}
            className="w-full rounded-xl border border-slate-700/90 bg-slate-950/80 px-3 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
          >
            {(field.options ?? []).map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      );
    }

    if (field.kind === 'textarea') {
      return (
        <div key={field.key} className={field.colSpan2 ? 'sm:col-span-2' : undefined}>
          <label className="mb-1.5 block text-xs font-medium text-slate-300">
            {field.label}
          </label>
          <textarea
            rows={3}
            required={field.required}
            value={String(val ?? '')}
            onChange={(e) => updateField(field.key, e.target.value)}
            placeholder={field.placeholder}
            className="w-full rounded-xl border border-slate-700/90 bg-slate-950/80 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
          />
        </div>
      );
    }

    if (field.kind === 'tags') {
      const tagsText = Array.isArray(val) ? val.join(', ') : String(val ?? '');
      return (
        <div key={field.key} className={field.colSpan2 ? 'sm:col-span-2' : undefined}>
          <label className="mb-1.5 block text-xs font-medium text-slate-300">
            {field.label}
          </label>
          <input
            type="text"
            value={tagsText}
            onChange={(e) =>
              updateField(
                field.key,
                e.target.value
                  .split(',')
                  .map((s) => s.trim())
                  .filter(Boolean),
              )
            }
            placeholder={field.placeholder ?? 'Item 1, Item 2, Item 3'}
            className="w-full rounded-xl border border-slate-700/90 bg-slate-950/80 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
          />
        </div>
      );
    }

    if (field.kind === 'lines') {
      const linesText = Array.isArray(val) ? val.join('\n') : String(val ?? '');
      return (
        <div key={field.key} className={field.colSpan2 ? 'sm:col-span-2' : undefined}>
          <label className="mb-1.5 block text-xs font-medium text-slate-300">
            {field.label}
          </label>
          <textarea
            rows={3}
            value={linesText}
            onChange={(e) =>
              updateField(
                field.key,
                e.target.value
                  .split('\n')
                  .map((s) => s.trim())
                  .filter(Boolean),
              )
            }
            placeholder={field.placeholder ?? 'One item per line'}
            className="w-full rounded-xl border border-slate-700/90 bg-slate-950/80 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
          />
        </div>
      );
    }

    if (field.kind === 'number') {
      return (
        <div key={field.key} className={field.colSpan2 ? 'sm:col-span-2' : undefined}>
          <label className="mb-1.5 block text-xs font-medium text-slate-300">
            {field.label}
          </label>
          <input
            type="number"
            min={0}
            max={100}
            value={val === undefined || val === null ? '' : String(val)}
            onChange={(e) =>
              updateField(
                field.key,
                e.target.value === '' ? undefined : Number(e.target.value),
              )
            }
            placeholder={field.placeholder}
            className="w-full rounded-xl border border-slate-700/90 bg-slate-950/80 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
          />
        </div>
      );
    }

    return (
      <div key={field.key} className={field.colSpan2 ? 'sm:col-span-2' : undefined}>
        <label className="mb-1.5 block text-xs font-medium text-slate-300">
          {field.label}
        </label>
        <input
          type="text"
          required={field.required}
          value={String(val ?? '')}
          onChange={(e) => updateField(field.key, e.target.value)}
          placeholder={field.placeholder}
          className="w-full rounded-xl border border-slate-700/90 bg-slate-950/80 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
        />
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">{schema.title}</h2>
          <p className="mt-1 text-sm text-slate-400">{schema.subtitle}</p>
        </div>
        <NeonButton onClick={openCreate}>
          <Plus className="h-4 w-4" aria-hidden="true" />
          <span>Add {schema.singularName}</span>
        </NeonButton>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search
          className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400"
          aria-hidden="true"
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Search ${schema.title.toLowerCase()}...`}
          className="w-full rounded-xl border border-slate-800 bg-slate-950/75 py-2.5 pr-4 pl-10 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
        />
      </div>

      {/* Item List */}
      {filteredItems.length === 0 ? (
        <GlassCard className="py-10 text-center">
          <p className="text-sm text-slate-400">
            No {schema.title.toLowerCase()} entries match your filter.
          </p>
        </GlassCard>
      ) : (
        <div className="space-y-3">
          {filteredItems.map((item, idx) => {
            const primary = String(item[schema.primaryField] ?? '');
            const secondary = schema.secondaryField
              ? String(item[schema.secondaryField] ?? '')
              : '';
            const badge = schema.badgeField
              ? String(item[schema.badgeField] ?? '')
              : '';
            const logo = schema.logoField ? String(item[schema.logoField] ?? '') : '';

            return (
              <GlassCard
                key={item.id}
                className="flex flex-col justify-between gap-4 p-4 sm:flex-row sm:items-center"
              >
                <div className="flex min-w-0 items-center gap-3.5">
                  {logo ? (
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-700 bg-slate-900/90 p-1.5">
                      <img src={logo} alt="" className="h-full w-full object-contain" />
                    </span>
                  ) : null}
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="truncate text-sm font-semibold text-white sm:text-base">
                        {primary}
                      </h3>
                      {badge ? (
                        <span className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-2 py-0.5 font-mono text-[10px] text-cyan-200">
                          {badge}
                        </span>
                      ) : null}
                      {!item.isPublished ? (
                        <span className="rounded-full border border-amber-400/35 bg-amber-500/10 px-2 py-0.5 font-mono text-[10px] text-amber-200">
                          Hidden / Draft
                        </span>
                      ) : null}
                    </div>
                    {secondary ? (
                      <p className="mt-0.5 truncate text-xs text-slate-400">
                        {secondary}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="flex shrink-0 flex-wrap items-center gap-1.5">
                  {!query.trim() ? (
                    <>
                      <button
                        type="button"
                        onClick={() => void handleMove(idx, -1)}
                        disabled={idx === 0}
                        aria-label={`Move ${primary} up`}
                        className="cursor-pointer rounded-lg border border-slate-800 bg-slate-900/70 p-2 text-slate-300 hover:border-cyan-400/40 disabled:opacity-30"
                      >
                        <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleMove(idx, 1)}
                        disabled={idx === filteredItems.length - 1}
                        aria-label={`Move ${primary} down`}
                        className="cursor-pointer rounded-lg border border-slate-800 bg-slate-900/70 p-2 text-slate-300 hover:border-cyan-400/40 disabled:opacity-30"
                      >
                        <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                    </>
                  ) : null}

                  <button
                    type="button"
                    onClick={() => void handleTogglePublished(item)}
                    aria-label={item.isPublished ? `Hide ${primary}` : `Publish ${primary}`}
                    title={item.isPublished ? 'Published (click to hide)' : 'Hidden (click to publish)'}
                    className="cursor-pointer rounded-lg border border-slate-800 bg-slate-900/70 p-2 text-slate-300 hover:border-cyan-400/40"
                  >
                    {item.isPublished ? (
                      <Eye className="h-3.5 w-3.5 text-cyan-300" aria-hidden="true" />
                    ) : (
                      <EyeOff className="h-3.5 w-3.5 text-amber-300" aria-hidden="true" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => openEdit(item)}
                    aria-label={`Edit ${primary}`}
                    className="cursor-pointer rounded-lg border border-slate-800 bg-slate-900/70 p-2 text-slate-200 hover:border-cyan-400/40"
                  >
                    <Edit3 className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeleteTarget(item)}
                    aria-label={`Delete ${primary}`}
                    className="cursor-pointer rounded-lg border border-rose-500/25 bg-rose-500/10 p-2 text-rose-300 hover:bg-rose-500/20"
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}

      {/* Create / Edit Modal */}
      {editingItem ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="cms-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-sm"
        >
          <div className="glass-panel max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-cyan-400/25 p-6">
            <div className="mb-5 flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 id="cms-modal-title" className="text-lg font-bold text-white">
                {isNew ? `Add ${schema.singularName}` : `Edit ${schema.singularName}`}
              </h3>
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                aria-label="Close editor"
                className="cursor-pointer rounded-lg border border-slate-700 p-1.5 text-slate-300 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                {schema.fields.map((field) => renderField(field))}
              </div>

              {saveError ? (
                <p className="text-xs text-rose-300">{saveError}</p>
              ) : null}

              <div className="flex items-center justify-end gap-3 border-t border-slate-800 pt-4">
                <NeonButton
                  variant="ghost"
                  onClick={() => setEditingItem(null)}
                  disabled={isSaving}
                >
                  Cancel
                </NeonButton>
                <NeonButton type="submit" disabled={isSaving}>
                  {isSaving ? 'Saving...' : isNew ? `Save & Publish` : 'Save Changes'}
                </NeonButton>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title={`Delete ${schema.singularName}?`}
        description={`Are you sure you want to permanently remove "${String(
          deleteTarget?.[schema.primaryField] ?? 'this entry',
        )}"? This action cannot be undone.`}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => void handleConfirmDelete()}
      />
    </div>
  );
}
