import { useState, useEffect, useCallback } from "react";
import { Plus, PencilSimple, Trash, X, Check, Play } from "@phosphor-icons/react";
import { galleryApi } from "@/lib/api";
import { toast } from "sonner";
import { SkeletonRows } from "./AdminPanels";

interface GalleryRow {
  id: string;
  title: string;
  description: string;
  media_type: string;
  url: string;
  thumbnail_url: string;
  category: string;
  sort_order: number;
  is_active: boolean;
}

const EMPTY_FORM: Omit<GalleryRow, "id"> = {
  title: "",
  description: "",
  media_type: "image",
  url: "",
  thumbnail_url: "",
  category: "",
  sort_order: 0,
  is_active: true,
};

const inputCls =
  "w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none";
const labelCls = "block text-xs font-medium text-gray-500 mb-1";

export default function GalleryPanel() {
  const [items, setItems] = useState<GalleryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<GalleryRow, "id">>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const data = await galleryApi.list();
      setItems((data as GalleryRow[]) ?? []);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to load gallery");
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  const openEdit = (item: GalleryRow) => {
    setEditingId(item.id);
    setForm({
      title: item.title,
      description: item.description,
      media_type: item.media_type,
      url: item.url,
      thumbnail_url: item.thumbnail_url,
      category: item.category,
      sort_order: item.sort_order,
      is_active: item.is_active,
    });
    setShowForm(true);
  };

  const save = async () => {
    if (!form.url) {
      toast.error("Media URL is required");
      return;
    }
    setSaving(true);
    try {
      if (editingId) {
        const updated = await galleryApi.update(editingId, form);
        setItems((prev) => prev.map((i) => (i.id === editingId ? { ...i, ...updated } : i)));
        toast.success("Gallery item updated");
      } else {
        const created = await galleryApi.create(form);
        setItems((prev) => [...prev, created as GalleryRow]);
        toast.success("Gallery item created");
      }
      setShowForm(false);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to save gallery item");
    }
    setSaving(false);
  };

  const remove = async (id: string) => {
    if (!window.confirm("Delete this gallery item?")) return;
    try {
      await galleryApi.remove(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
      toast.success("Gallery item deleted");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to delete gallery item");
    }
  };

  const toggleActive = async (item: GalleryRow) => {
    try {
      await galleryApi.update(item.id, { is_active: !item.is_active });
      setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, is_active: !item.is_active } : i)));
      toast.success(item.is_active ? "Item hidden" : "Item activated");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to update item");
    }
  };

  if (loading) return <SkeletonRows count={4} />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-blue-900">Gallery</h2>
          <p className="text-sm text-gray-500">Manage photos and videos shown in the gallery section</p>
        </div>
        {!showForm && (
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-900 text-white text-sm font-semibold rounded-lg hover:bg-blue-800 transition-colors"
          >
            <Plus size={16} /> Add Item
          </button>
        )}
      </div>

      {/* Create/Edit form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-blue-900">
              {editingId ? "Edit Gallery Item" : "New Gallery Item"}
            </h3>
            <button onClick={() => setShowForm(false)} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
              <X size={16} />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Title</label>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Category</label>
              <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputCls} placeholder="Field Work, Events, ..." />
            </div>
            <div>
              <label className={labelCls}>Media Type</label>
              <select value={form.media_type} onChange={(e) => setForm({ ...form, media_type: e.target.value })} className={inputCls}>
                <option value="image">Image</option>
                <option value="video">Video</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Sort Order</label>
              <input
                type="number"
                value={form.sort_order}
                onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })}
                className={inputCls}
              />
            </div>
          </div>
          <div className="mt-4">
            <label className={labelCls}>Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className={inputCls} />
          </div>
          <div className="mt-4">
            <label className={labelCls}>
              {form.media_type === "video" ? "Video Embed URL (YouTube embed link)" : "Image URL"} *
            </label>
            <input value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} className={inputCls} placeholder="https://..." />
          </div>
          <div className="mt-4">
            <label className={labelCls}>Thumbnail URL (optional – used as card preview)</label>
            <input value={form.thumbnail_url} onChange={(e) => setForm({ ...form, thumbnail_url: e.target.value })} className={inputCls} placeholder="https://..." />
          </div>
          <div className="mt-4">
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="w-4 h-4 accent-blue-900" />
              Active (visible on site)
            </label>
          </div>
          <div className="mt-5 flex gap-2">
            <button
              onClick={save}
              disabled={saving}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-900 text-white text-sm font-semibold rounded-lg hover:bg-blue-800 disabled:opacity-50"
            >
              <Check size={16} /> {saving ? "Saving..." : editingId ? "Update Item" : "Create Item"}
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2 bg-gray-100 text-gray-600 text-sm font-semibold rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Grid preview */}
      {items.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-sm text-gray-500">
          No gallery items yet. Add your first item.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden group">
              <div className="relative aspect-square bg-gray-100">
                <img
                  src={item.thumbnail_url || item.url}
                  alt={item.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
                {item.media_type === "video" && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <div className="w-10 h-10 rounded-full bg-white/80 flex items-center justify-center">
                      <Play size={16} weight="fill" className="text-blue-900 ml-0.5" />
                    </div>
                  </div>
                )}
                <span className={`absolute top-2 left-2 text-[10px] font-semibold px-2 py-0.5 rounded-full ${item.is_active ? "bg-green-50 text-green-700" : "bg-gray-200 text-gray-600"}`}>
                  {item.is_active ? "Active" : "Hidden"}
                </span>
              </div>
              <div className="p-3">
                <p className="text-sm font-semibold text-gray-900 truncate">{item.title || "Untitled"}</p>
                <p className="text-xs text-gray-400 truncate">{item.category || "No category"} · order {item.sort_order}</p>
                <div className="flex items-center gap-1 mt-2">
                  <button onClick={() => toggleActive(item)} className={`px-2 py-1 text-xs font-medium rounded-md ${item.is_active ? "text-gray-500 hover:bg-gray-100" : "text-green-600 hover:bg-green-50"}`}>
                    {item.is_active ? "Hide" : "Show"}
                  </button>
                  <button onClick={() => openEdit(item)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md ml-auto">
                    <PencilSimple size={14} />
                  </button>
                  <button onClick={() => remove(item.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md">
                    <Trash size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
