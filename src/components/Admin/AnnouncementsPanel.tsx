import { useState, useEffect, useCallback } from "react";
import { Plus, PencilSimple, Trash, X, Check, Paperclip, Calendar } from "@phosphor-icons/react";
import { announcementsApi } from "@/lib/api";
import { toast } from "sonner";
import { SkeletonRows } from "./AdminPanels";

interface AnnouncementRow {
  id: string;
  slug: string;
  type: string;
  title: string;
  description: string;
  content: string;
  deadline_date: string | null;
  attachment_url: string;
  is_active: boolean;
  created_at: string;
}

const EMPTY_FORM: Omit<AnnouncementRow, "id" | "created_at"> = {
  slug: "",
  type: "vacancy",
  title: "",
  description: "",
  content: "",
  deadline_date: null,
  attachment_url: "",
  is_active: true,
};

const inputCls =
  "w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none";
const labelCls = "block text-xs font-medium text-gray-500 mb-1";

export default function AnnouncementsPanel() {
  const [items, setItems] = useState<AnnouncementRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"vacancy" | "bid">("vacancy");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<AnnouncementRow, "id" | "created_at">>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const data = await announcementsApi.list();
      setItems((data as AnnouncementRow[]) ?? []);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to load announcements");
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const openCreate = () => {
    setEditingId(null);
    setForm({ ...EMPTY_FORM, type: activeTab });
    setShowForm(true);
  };

  const openEdit = (item: AnnouncementRow) => {
    setEditingId(item.id);
    setForm({
      slug: item.slug,
      type: item.type,
      title: item.title,
      description: item.description,
      content: item.content,
      deadline_date: item.deadline_date,
      attachment_url: item.attachment_url,
      is_active: item.is_active,
    });
    setShowForm(true);
  };

  const save = async () => {
    if (!form.slug || !form.title || !form.type) {
      toast.error("Slug, type, and title are required");
      return;
    }
    setSaving(true);
    try {
      if (editingId) {
        const updated = await announcementsApi.update(editingId, form);
        setItems((prev) => prev.map((i) => (i.id === editingId ? { ...i, ...updated } : i)));
        toast.success("Announcement updated");
      } else {
        const created = await announcementsApi.create(form);
        setItems((prev) => [created as AnnouncementRow, ...prev]);
        toast.success("Announcement created");
      }
      setShowForm(false);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to save announcement");
    }
    setSaving(false);
  };

  const remove = async (id: string) => {
    if (!window.confirm("Delete this announcement?")) return;
    try {
      await announcementsApi.remove(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
      toast.success("Announcement deleted");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to delete announcement");
    }
  };

  const toggleActive = async (item: AnnouncementRow) => {
    try {
      await announcementsApi.update(item.id, { ...item, is_active: !item.is_active });
      setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, is_active: !item.is_active } : i)));
      toast.success(item.is_active ? "Announcement hidden" : "Announcement activated");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to update announcement");
    }
  };

  const filtered = items.filter((i) => i.type === activeTab);

  if (loading) return <SkeletonRows count={4} />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-blue-900">Announcements</h2>
          <p className="text-sm text-gray-500">Manage vacancies and bid announcements</p>
        </div>
        {!showForm && (
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-900 text-white text-sm font-semibold rounded-lg hover:bg-blue-800 transition-colors"
          >
            <Plus size={16} /> Add {activeTab === "vacancy" ? "Vacancy" : "Bid"}
          </button>
        )}
      </div>

      {/* Tab toggle */}
      <div className="flex gap-2 mb-6">
        {(["vacancy", "bid"] as const).map((t) => (
          <button
            key={t}
            onClick={() => { setActiveTab(t); setShowForm(false); }}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === t
                ? "bg-blue-900 text-white shadow-sm"
                : "bg-white text-gray-600 border border-slate-200 hover:bg-gray-50"
            }`}
          >
            {t === "vacancy" ? "Vacancies" : "Bids"} ({items.filter((i) => i.type === t).length})
          </button>
        ))}
      </div>

      {/* Create/Edit form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-blue-900">
              {editingId ? "Edit Announcement" : "New Announcement"}
            </h3>
            <button onClick={() => setShowForm(false)} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
              <X size={16} />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Slug *</label>
              <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className={inputCls} placeholder="unique-slug" />
            </div>
            <div>
              <label className={labelCls}>Type *</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className={inputCls}>
                <option value="vacancy">Vacancy</option>
                <option value="bid">Bid</option>
              </select>
            </div>
          </div>
          <div className="mt-4">
            <label className={labelCls}>Title *</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputCls} />
          </div>
          <div className="mt-4">
            <label className={labelCls}>Short Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className={inputCls} />
          </div>
          <div className="mt-4">
            <label className={labelCls}>Full Content</label>
            <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={5} className={inputCls} />
          </div>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Deadline Date</label>
              <input
                type="date"
                value={form.deadline_date ? form.deadline_date.slice(0, 10) : ""}
                onChange={(e) => setForm({ ...form, deadline_date: e.target.value || null })}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Attachment URL</label>
              <input value={form.attachment_url} onChange={(e) => setForm({ ...form, attachment_url: e.target.value })} className={inputCls} placeholder="https://..." />
            </div>
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
              <Check size={16} /> {saving ? "Saving..." : editingId ? "Update" : "Create"}
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

      {/* List */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-sm text-gray-500">
            No {activeTab === "vacancy" ? "vacancies" : "bids"} yet.
          </div>
        )}
        {filtered.map((item) => (
          <div key={item.id} className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded ${item.is_active ? "text-green-700 bg-green-50" : "text-gray-500 bg-gray-100"}`}>
                    {item.is_active ? "Active" : "Hidden"}
                  </span>
                  {item.deadline_date && (
                    <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded flex items-center gap-1">
                      <Calendar size={12} /> {new Date(item.deadline_date).toLocaleDateString()}
                    </span>
                  )}
                  {item.attachment_url && (
                    <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded flex items-center gap-1">
                      <Paperclip size={12} /> Attachment
                    </span>
                  )}
                </div>
                <p className="font-semibold text-gray-900 truncate">{item.title}</p>
                <p className="text-xs text-gray-500 line-clamp-2 mt-1">{item.description}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => toggleActive(item)} className={`px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors ${item.is_active ? "text-gray-500 hover:bg-gray-100" : "text-green-600 hover:bg-green-50"}`}>
                  {item.is_active ? "Hide" : "Show"}
                </button>
                <button onClick={() => openEdit(item)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                  <PencilSimple size={16} />
                </button>
                <button onClick={() => remove(item.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                  <Trash size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
