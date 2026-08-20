import { useState, useEffect, useCallback } from "react";
import { Trash } from "@phosphor-icons/react";
import { inquiriesApi } from "@/lib/api";
import { toast } from "sonner";
import type { ContactInquiry } from "@/types";
import { SkeletonRows } from "./AdminPanels";

export default function InquiriesPanel() {
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const data = await inquiriesApi.list();
      setInquiries(data ?? []);
    } catch (err: any) {
      toast.error(err.message);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const updateStatus = async (id: string, status: string) => {
    try {
      await inquiriesApi.updateStatus(id, status);
      setInquiries((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)));
      toast.success(`Marked as ${status}`);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const removeInquiry = async (id: string) => {
    try {
      await inquiriesApi.remove(id);
      setInquiries((prev) => prev.filter((i) => i.id !== id));
      setSelectedId(null);
      toast.success("Inquiry removed");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  if (loading) return <SkeletonRows count={3} />;

  const statusColor = (s: string) => {
    switch (s) {
      case "new": return "bg-blue-50 text-blue-700";
      case "read": return "bg-amber-50 text-amber-700";
      case "replied": return "bg-green-50 text-green-700";
      default: return "bg-gray-100 text-gray-500";
    }
  };

  const selected = inquiries.find((i) => i.id === selectedId);

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-blue-900">Contact Inquiries</h2>
        <p className="text-sm text-gray-500">Review and manage messages from the contact form</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-2">
          {inquiries.length === 0 && <p className="text-sm text-gray-400 text-center py-6">No inquiries yet.</p>}
          {inquiries.map((inq) => (
            <button
              key={inq.id}
              onClick={() => setSelectedId(inq.id)}
              className={`w-full text-left bg-white rounded-xl border p-4 transition-all ${selectedId === inq.id ? "border-blue-400 ring-2 ring-blue-100" : "border-slate-200 hover:border-slate-300"}`}
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-sm font-semibold text-gray-900 truncate">{inq.name}</span>
                <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${statusColor(inq.status)}`}>{inq.status}</span>
              </div>
              <p className="text-xs text-gray-500 truncate">{inq.subject}</p>
              <p className="text-[10px] text-gray-400 mt-1">{new Date(inq.created_at).toLocaleDateString()}</p>
            </button>
          ))}
        </div>

        <div>
          {selected ? (
            <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{selected.name}</h3>
                  <p className="text-sm text-gray-500">{selected.subject}</p>
                </div>
                <span className={`text-xs font-semibold uppercase px-2.5 py-1 rounded-full ${statusColor(selected.status)}`}>{selected.status}</span>
              </div>
              <div className="text-xs text-gray-500 space-y-1">
                <p><span className="font-medium">Email:</span> {selected.email}</p>
                {selected.phone && <p><span className="font-medium">Phone:</span> {selected.phone}</p>}
                {selected.organization && <p><span className="font-medium">Organization:</span> {selected.organization}</p>}
                <p><span className="font-medium">Date:</span> {new Date(selected.created_at).toLocaleString()}</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-3">
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{selected.message}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {selected.status !== "read" && <button onClick={() => updateStatus(selected.id, "read")} className="flex items-center gap-1 px-3 py-1.5 bg-amber-50 text-amber-700 text-xs font-semibold rounded-lg hover:bg-amber-100">Mark as Read</button>}
                {selected.status !== "replied" && <button onClick={() => updateStatus(selected.id, "replied")} className="flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-700 text-xs font-semibold rounded-lg hover:bg-green-100">Mark as Replied</button>}
                <button onClick={() => removeInquiry(selected.id)} className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 text-xs font-semibold rounded-lg hover:bg-red-100"><Trash size={14} /> Delete</button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
              <p className="text-sm text-gray-400">Select an inquiry to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}