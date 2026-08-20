import { useState, useEffect, useCallback } from "react";
import { Check, X, PencilSimple } from "@phosphor-icons/react";
import { contentApi, seoApi } from "@/lib/api";
import { toast } from "sonner";
import type { CmsTextBlock, SeoMeta } from "@/types";

export type TabId =
  | "content"
  | "seo"
  | "nav"
  | "media"
  | "inquiries"
  | "projects"
  | "gallery"
  | "announcements"
  | "news";

export function SkeletonRows({ count }: { count: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-xl border border-slate-200 p-4 animate-pulse">
          <div className="h-3 bg-slate-200 rounded w-1/4 mb-3" />
          <div className="h-4 bg-slate-200 rounded w-3/4" />
        </div>
      ))}
    </div>
  );
}

export function SiteContentPanel() {
  const [blocks, setBlocks] = useState<CmsTextBlock[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const data = await contentApi.list();
      setBlocks(data ?? []);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to load content");
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const save = async (id: string) => {
    try {
      await contentApi.update(id, { value: editValue });
      setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, value: editValue } : b)));
      setEditingId(null);
      toast.success("Content updated!");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to update content");
    }
  };

  if (loading) return <SkeletonRows count={6} />;

  return (
    <div>
      <div className="mb-6"><h2 className="text-xl font-bold text-blue-900">Site Content</h2><p className="text-sm text-gray-500">Edit text blocks across all sections</p></div>
      <div className="space-y-3">
        {blocks.map((block) => (
          <div key={block.id} className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">{block.section}</span>
                  <span className="text-xs text-gray-400 font-mono">{block.key}</span>
                </div>
                {editingId === block.id ? (
                  <div className="space-y-2">
                    <textarea value={editValue} onChange={(e) => setEditValue(e.target.value)} rows={3} className="w-full px-3 py-2 text-sm border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-200 outline-none" />
                    <div className="flex gap-2">
                      <button onClick={() => save(block.id)} className="flex items-center gap-1 px-3 py-1.5 bg-blue-900 text-white text-xs font-semibold rounded-lg hover:bg-blue-800"><Check size={14} /> Save</button>
                      <button onClick={() => setEditingId(null)} className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-600 text-xs font-semibold rounded-lg hover:bg-gray-200"><X size={14} /> Cancel</button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-700">{block.value}</p>
                )}
              </div>
              {editingId !== block.id && (
                <button onClick={() => { setEditingId(block.id); setEditValue(block.value); }} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all flex-shrink-0">
                  <PencilSimple size={16} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SeoPanel() {
  const [meta, setMeta] = useState<SeoMeta[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", description: "", keywords: "", og_image: "" });
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const data = await seoApi.list();
      setMeta(data ?? []);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to load SEO metadata");
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const save = async (id: string) => {
    try {
      await seoApi.update(id, form);
      setMeta((prev) => prev.map((m) => (m.id === id ? { ...m, ...form } : m)));
      setEditingId(null);
      toast.success("SEO updated!");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to update SEO metadata");
    }
  };

  if (loading) return <SkeletonRows count={2} />;

  return (
    <div>
      <div className="mb-6"><h2 className="text-xl font-bold text-blue-900">SEO Metadata</h2><p className="text-sm text-gray-500">Manage page titles, meta descriptions, and OG images</p></div>
      <div className="space-y-4">
        {meta.map((m) => (
          <div key={m.id} className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono text-gray-400 bg-gray-100 px-2 py-0.5 rounded">{m.route}</span>
            </div>
            {editingId === m.id ? (
              <div className="space-y-3">
                <div><label className="block text-xs font-medium text-gray-500 mb-1">Title</label><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 text-sm border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-200 outline-none" /></div>
                <div><label className="block text-xs font-medium text-gray-500 mb-1">Description</label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className="w-full px-3 py-2 text-sm border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-200 outline-none" /></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div><label className="block text-xs font-medium text-gray-500 mb-1">Keywords</label><input value={form.keywords} onChange={(e) => setForm({ ...form, keywords: e.target.value })} className="w-full px-3 py-2 text-sm border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-200 outline-none" /></div>
                  <div><label className="block text-xs font-medium text-gray-500 mb-1">OG Image URL</label><input value={form.og_image} onChange={(e) => setForm({ ...form, og_image: e.target.value })} className="w-full px-3 py-2 text-sm border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-200 outline-none" /></div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => save(m.id)} className="flex items-center gap-1 px-3 py-1.5 bg-blue-900 text-white text-xs font-semibold rounded-lg hover:bg-blue-800"><Check size={14} /> Save</button>
                  <button onClick={() => setEditingId(null)} className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-600 text-xs font-semibold rounded-lg hover:bg-gray-200"><X size={14} /> Cancel</button>
                </div>
              </div>
            ) : (
              <div className="space-y-1.5">
                <p className="text-sm font-semibold text-gray-900">{m.title}</p>
                <p className="text-xs text-gray-500">{m.description}</p>
                {m.keywords && <p className="text-xs text-gray-400"><span className="font-medium">Keywords:</span> {m.keywords}</p>}
                {m.og_image && <p className="text-xs text-gray-400"><span className="font-medium">OG Image:</span> {m.og_image}</p>}
                <button onClick={() => { setEditingId(m.id); setForm({ title: m.title, description: m.description, keywords: m.keywords, og_image: m.og_image }); }} className="mt-2 flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800"><PencilSimple size={14} /> Edit SEO</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}