import { useState, useEffect, useCallback } from "react";
import { Plus, PencilSimple, Trash, X, Check, UserCircle } from "@phosphor-icons/react";
import { teamApi } from "@/lib/api";
import { toast } from "sonner";
import { SkeletonRows } from "./AdminPanels";
import { MediaUrlField } from "./MediaPicker";

interface TeamRow {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatar_url: string;
  sort_order: number;
  is_active: boolean;
}

const EMPTY_FORM: Omit<TeamRow, "id"> = {
  name: "",
  role: "",
  bio: "",
  avatar_url: "",
  sort_order: 0,
  is_active: true,
};

const inputCls =
  "w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none";
const labelCls = "block text-xs font-medium text-gray-500 mb-1";

export default function TeamPanel() {
  const [members, setMembers] = useState<TeamRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<TeamRow, "id">>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const data = await teamApi.list();
      setMembers((data as TeamRow[]) ?? []);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to load team");
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  const openEdit = (m: TeamRow) => {
    setEditingId(m.id);
    setForm({
      name: m.name,
      role: m.role,
      bio: m.bio,
      avatar_url: m.avatar_url,
      sort_order: m.sort_order,
      is_active: m.is_active,
    });
    setShowForm(true);
  };

  const save = async () => {
    if (!form.name || !form.role) {
      toast.error("Name and role are required");
      return;
    }
    setSaving(true);
    try {
      if (editingId) {
        const updated = await teamApi.update(editingId, form);
        setMembers((prev) => prev.map((m) => (m.id === editingId ? { ...m, ...updated } : m)));
        toast.success("Team member updated");
      } else {
        const created = await teamApi.create(form);
        setMembers((prev) => [...prev, created as TeamRow]);
        toast.success("Team member added");
      }
      setShowForm(false);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to save team member");
    }
    setSaving(false);
  };

  const remove = async (id: string) => {
    if (!window.confirm("Remove this team member?")) return;
    try {
      await teamApi.remove(id);
      setMembers((prev) => prev.filter((m) => m.id !== id));
      toast.success("Team member removed");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to remove team member");
    }
  };

  const toggleActive = async (m: TeamRow) => {
    try {
      await teamApi.update(m.id, { ...m, is_active: !m.is_active });
      setMembers((prev) => prev.map((x) => (x.id === m.id ? { ...x, is_active: !m.is_active } : x)));
      toast.success(m.is_active ? "Member hidden" : "Member activated");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to update member");
    }
  };

  if (loading) return <SkeletonRows count={4} />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-blue-900">Team</h2>
          <p className="text-sm text-gray-500">Manage team members shown under About Us</p>
        </div>
        {!showForm && (
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-900 text-white text-sm font-semibold rounded-lg hover:bg-blue-800 transition-colors"
          >
            <Plus size={16} /> Add Member
          </button>
        )}
      </div>

      {/* Create/Edit form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-blue-900">
              {editingId ? "Edit Team Member" : "New Team Member"}
            </h3>
            <button onClick={() => setShowForm(false)} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
              <X size={16} />
            </button>
          </div>
          <div className="flex items-start gap-5">
            {/* Avatar preview */}
            <div className="shrink-0">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center">
                {form.avatar_url ? (
                  <img src={form.avatar_url} alt="Avatar preview" className="w-full h-full object-cover" />
                ) : (
                  <UserCircle size={48} className="text-slate-300" />
                )}
              </div>
              <p className="text-[10px] text-gray-400 text-center mt-1.5 w-24">Photo preview</p>
            </div>
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Name *</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} placeholder="Eng. Name" />
              </div>
              <div>
                <label className={labelCls}>Role *</label>
                <input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className={inputCls} placeholder="Senior Engineer" />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>Photo URL</label>
                <MediaUrlField
                  value={form.avatar_url}
                  onChange={(url) => setForm({ ...form, avatar_url: url })}
                  mediaType="image"
                />
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
              <div className="flex items-end pb-1">
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="w-4 h-4 accent-blue-900" />
                  Active (visible on site)
                </label>
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>Bio</label>
                <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={3} className={inputCls} />
              </div>
            </div>
          </div>
          <div className="mt-5 flex gap-2">
            <button
              onClick={save}
              disabled={saving}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-900 text-white text-sm font-semibold rounded-lg hover:bg-blue-800 disabled:opacity-50"
            >
              <Check size={16} /> {saving ? "Saving..." : editingId ? "Update Member" : "Add Member"}
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {members.length === 0 && (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-sm text-gray-500 md:col-span-2">
            No team members yet. Add your first member.
          </div>
        )}
        {members.map((m) => (
          <div key={m.id} className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-start gap-3">
              <div className="w-14 h-14 rounded-full overflow-hidden bg-slate-100 flex items-center justify-center shrink-0">
                {m.avatar_url ? (
                  <img src={m.avatar_url} alt={m.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-sm font-bold text-slate-400">
                    {m.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="font-semibold text-gray-900 truncate">{m.name}</p>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded shrink-0 ${m.is_active ? "text-green-700 bg-green-50" : "text-gray-500 bg-gray-100"}`}>
                    {m.is_active ? "Active" : "Hidden"}
                  </span>
                </div>
                <p className="text-xs text-blue-600 font-medium mb-1">{m.role}</p>
                <p className="text-xs text-gray-500 line-clamp-2">{m.bio}</p>
              </div>
              <div className="flex flex-col items-center gap-1 shrink-0">
                <button onClick={() => toggleActive(m)} className={`px-2 py-1 text-xs font-medium rounded-md ${m.is_active ? "text-gray-500 hover:bg-gray-100" : "text-green-600 hover:bg-green-50"}`}>
                  {m.is_active ? "Hide" : "Show"}
                </button>
                <div className="flex items-center gap-0.5">
                  <button onClick={() => openEdit(m)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md">
                    <PencilSimple size={14} />
                  </button>
                  <button onClick={() => remove(m.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md">
                    <Trash size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
