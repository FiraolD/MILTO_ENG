import { useState, useEffect, useCallback } from "react";
import { Plus, Trash, ArrowUp, ArrowDown, Link } from "@phosphor-icons/react";
import { navigationApi } from "@/lib/api";
import { toast } from "sonner";
import type { NavLinkItem } from "@/types";
import { SkeletonRows } from "./AdminPanels";

export default function NavPanel() {
  const [links, setLinks] = useState<NavLinkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [newLabel, setNewLabel] = useState("");
  const [newHref, setNewHref] = useState("");

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const data = await navigationApi.list();
      setLinks(data ?? []);
    } catch (err: any) {
      toast.error(err.message);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const addLink = async () => {
    if (!newLabel.trim() || !newHref.trim()) return;
    const maxOrder = links.reduce((m, l) => Math.max(m, l.sort_order), 0);
    try {
      const created = await navigationApi.create({
        label: newLabel.trim(),
        href: newHref.trim(),
        sort_order: maxOrder + 1,
        is_active: true,
      });
      setLinks((prev) => [...prev, created]);
      setNewLabel("");
      setNewHref("");
      toast.success("Link added!");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const removeLink = async (id: string) => {
    try {
      await navigationApi.remove(id);
      setLinks((prev) => prev.filter((l) => l.id !== id));
      toast.success("Link removed");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const toggleActive = async (id: string, current: boolean) => {
    try {
      await navigationApi.update(id, { is_active: !current });
      setLinks((prev) => prev.map((l) => (l.id === id ? { ...l, is_active: !current } : l)));
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const moveUp = async (idx: number) => {
    if (idx <= 0) return;
    const a = links[idx];
    const b = links[idx - 1];
    try {
      await navigationApi.update(a.id, { sort_order: b.sort_order });
      await navigationApi.update(b.id, { sort_order: a.sort_order });
      const next = [...links];
      next[idx] = b;
      next[idx - 1] = a;
      setLinks(next);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const moveDown = async (idx: number) => {
    if (idx >= links.length - 1) return;
    const a = links[idx];
    const b = links[idx + 1];
    try {
      await navigationApi.update(a.id, { sort_order: b.sort_order });
      await navigationApi.update(b.id, { sort_order: a.sort_order });
      const next = [...links];
      next[idx] = b;
      next[idx + 1] = a;
      setLinks(next);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  if (loading) return <SkeletonRows count={3} />;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-blue-900">Navigation Links</h2>
        <p className="text-sm text-gray-500">Manage nav bar links, order, and visibility</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <input value={newLabel} onChange={(e) => setNewLabel(e.target.value)} placeholder="Label" className="flex-1 min-w-[140px] px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-200 outline-none" />
        <input value={newHref} onChange={(e) => setNewHref(e.target.value)} placeholder="e.g. #services" className="flex-1 min-w-[120px] px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-200 outline-none" />
        <button onClick={addLink} className="flex items-center gap-1.5 px-4 py-2 bg-blue-900 text-white text-sm font-semibold rounded-lg hover:bg-blue-800 transition-all">
          <Plus size={16} /> Add
        </button>
      </div>

      <div className="space-y-2">
        {links.map((link, idx) => (
          <div key={link.id} className="flex items-center gap-2 bg-white rounded-xl border border-slate-200 px-4 py-3">
            <div className="flex flex-col gap-0.5">
              <button onClick={() => moveUp(idx)} disabled={idx === 0} className="p-0.5 text-gray-400 hover:text-blue-600 disabled:opacity-30"><ArrowUp size={12} /></button>
              <button onClick={() => moveDown(idx)} disabled={idx === links.length - 1} className="p-0.5 text-gray-400 hover:text-blue-600 disabled:opacity-30"><ArrowDown size={12} /></button>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">{link.label}</p>
              <p className="text-xs text-gray-400 flex items-center gap-1"><Link size={12} /> {link.href}</p>
            </div>
            <button onClick={() => toggleActive(link.id, link.is_active)} className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${link.is_active ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-400"}`}>
              {link.is_active ? "Active" : "Hidden"}
            </button>
            <button onClick={() => removeLink(link.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><Trash size={16} /></button>
          </div>
        ))}
        {links.length === 0 && <p className="text-sm text-gray-400 text-center py-6">No navigation links yet.</p>}
      </div>
    </div>
  );
}