import { useState, useEffect, useCallback } from "react";
import { Plus, Trash } from "@phosphor-icons/react";
import { mediaApi } from "@/lib/api";
import { toast } from "sonner";
import type { MediaAsset } from "@/types";
import { SkeletonRows } from "./AdminPanels";

export default function MediaPanel() {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [newAlt, setNewAlt] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newSection, setNewSection] = useState("");

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const data = await mediaApi.list();
      setAssets(data ?? []);
    } catch (err: any) {
      toast.error(err.message);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const addAsset = async () => {
    if (!newAlt.trim() || !newUrl.trim()) return;
    const maxOrder = assets.filter((a) => a.section === newSection).reduce((m, a) => Math.max(m, a.sort_order), 0);
    try {
      const created = await mediaApi.create({
        alt: newAlt.trim(),
        url: newUrl.trim(),
        section: newSection.trim() || "",
        sort_order: maxOrder + 1,
      });
      setAssets((prev) => [...prev, created]);
      setNewAlt("");
      setNewUrl("");
      toast.success("Media asset added!");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const removeAsset = async (id: string) => {
    try {
      await mediaApi.remove(id);
      setAssets((prev) => prev.filter((a) => a.id !== id));
      toast.success("Media asset removed");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  if (loading) return <SkeletonRows count={2} />;

  const sections = [...new Set(assets.map((a) => a.section).filter(Boolean))];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-blue-900">Media Assets</h2>
        <p className="text-sm text-gray-500">Manage images and multimedia assets across sections</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <input value={newAlt} onChange={(e) => setNewAlt(e.target.value)} placeholder="Alt text" className="flex-1 min-w-[120px] px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-200 outline-none" />
        <input value={newUrl} onChange={(e) => setNewUrl(e.target.value)} placeholder="Image URL" className="flex-1 min-w-[180px] px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-200 outline-none" />
        <input value={newSection} onChange={(e) => setNewSection(e.target.value)} placeholder="Section (optional)" className="flex-1 min-w-[120px] px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-200 outline-none" />
        <button onClick={addAsset} className="flex items-center gap-1.5 px-4 py-2 bg-blue-900 text-white text-sm font-semibold rounded-lg hover:bg-blue-800 transition-all">
          <Plus size={16} /> Add
        </button>
      </div>

      <div className="space-y-4">
        {sections.map((section) => (
          <div key={section}>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">{section || "Uncategorized"}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {assets.filter((a) => a.section === section).map((asset) => (
                <div key={asset.id} className="bg-white rounded-xl border border-slate-200 p-3 flex items-start gap-3">
                  <div className="w-14 h-14 rounded-lg bg-slate-100 flex-shrink-0 overflow-hidden">
                    <img src={asset.url} alt={asset.alt} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22%239ca3af%22><rect width=%2224%22 height=%2224%22 rx=%224%22/></svg>"; }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{asset.alt}</p>
                    <p className="text-xs text-gray-400 truncate">{asset.url}</p>
                  </div>
                  <button onClick={() => removeAsset(asset.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all flex-shrink-0"><Trash size={14} /></button>
                </div>
              ))}
            </div>
          </div>
        ))}
        {assets.length === 0 && <p className="text-sm text-gray-400 text-center py-6">No media assets yet.</p>}
      </div>
    </div>
  );
}