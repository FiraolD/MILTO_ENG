import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useCallback, useRef } from "react";
import { Plus, Trash, UploadSimple, FilmSlate, SpinnerGap } from "@phosphor-icons/react";
import { mediaApi } from "@/lib/api";
import { isVideoUrl } from "@/lib/mediaUtils";
import { toast } from "sonner";
import { SkeletonRows } from "./AdminPanels";
export default function MediaPanel() {
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const [newAlt, setNewAlt] = useState("");
    const [newUrl, setNewUrl] = useState("");
    const [newSection, setNewSection] = useState("");
    const fileRef = useRef(null);
    const fetch = useCallback(async () => {
        setLoading(true);
        try {
            const data = await mediaApi.list();
            setAssets(data ?? []);
        }
        catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to load media");
        }
        setLoading(false);
    }, []);
    useEffect(() => { fetch(); }, [fetch]);
    const uploadFiles = async (files) => {
        const list = Array.from(files);
        if (list.length === 0)
            return;
        setUploading(true);
        let added = 0;
        for (const file of list) {
            try {
                const created = await mediaApi.upload(file, undefined, newSection.trim() || undefined);
                setAssets((prev) => [created, ...prev]);
                added++;
            }
            catch (err) {
                toast.error(err instanceof Error ? err.message : `Failed to upload ${file.name}`);
            }
        }
        setUploading(false);
        if (added > 0)
            toast.success(`${added} file${added > 1 ? "s" : ""} uploaded to media assets`);
        if (fileRef.current)
            fileRef.current.value = "";
    };
    const addAsset = async () => {
        if (!newAlt.trim() || !newUrl.trim())
            return;
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
        }
        catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to add asset");
        }
    };
    const removeAsset = async (id) => {
        try {
            await mediaApi.remove(id);
            setAssets((prev) => prev.filter((a) => a.id !== id));
            toast.success("Media asset removed");
        }
        catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to remove asset");
        }
    };
    if (loading)
        return _jsx(SkeletonRows, { count: 2 });
    const sections = [...new Set(assets.map((a) => a.section).filter(Boolean))];
    const uncategorized = assets.filter((a) => !a.section);
    const renderAssetCard = (asset) => {
        const video = isVideoUrl(asset.url);
        return (_jsxs("div", { className: "bg-white rounded-xl border border-slate-200 p-3 flex items-start gap-3", children: [_jsx("div", { className: "w-14 h-14 rounded-lg bg-slate-100 flex-shrink-0 overflow-hidden relative", children: video ? (_jsx("div", { className: "w-full h-full flex items-center justify-center bg-blue-50", children: _jsx(FilmSlate, { size: 22, className: "text-blue-400" }) })) : (_jsx("img", { src: asset.url, alt: asset.alt, className: "w-full h-full object-cover", onError: (e) => { e.target.src = "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22%239ca3af%22><rect width=%2224%22 height=%2224%22 rx=%224%22/></svg>"; } })) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center gap-1.5", children: [_jsx("p", { className: "text-sm font-medium text-gray-900 truncate", children: asset.alt }), video && _jsx("span", { className: "text-[10px] font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded shrink-0", children: "Video" })] }), _jsx("p", { className: "text-xs text-gray-400 truncate", children: asset.url })] }), _jsx("button", { onClick: () => removeAsset(asset.id), className: "p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all flex-shrink-0", children: _jsx(Trash, { size: 14 }) })] }, asset.id));
    };
    return (_jsxs("div", { children: [_jsxs("div", { className: "mb-6", children: [_jsx("h2", { className: "text-xl font-bold text-blue-900", children: "Media Assets" }), _jsx("p", { className: "text-sm text-gray-500", children: "Upload and manage images and videos. These assets can be picked from any panel on the site." })] }), _jsxs("div", { onDragOver: (e) => { e.preventDefault(); setDragOver(true); }, onDragLeave: () => setDragOver(false), onDrop: (e) => { e.preventDefault(); setDragOver(false); uploadFiles(e.dataTransfer.files); }, className: `mb-5 rounded-xl border-2 border-dashed p-6 text-center transition-colors ${dragOver ? "border-blue-400 bg-blue-50" : "border-slate-300 bg-white"}`, children: [_jsx("input", { ref: fileRef, type: "file", multiple: true, accept: "image/*,video/*,.pdf", className: "hidden", onChange: (e) => e.target.files && uploadFiles(e.target.files) }), _jsx(UploadSimple, { size: 26, className: `mx-auto mb-2 ${dragOver ? "text-blue-500" : "text-gray-400"}` }), _jsx("p", { className: "text-sm text-gray-600 font-medium", children: "Drag & drop images or videos here, or" }), _jsxs("button", { onClick: () => fileRef.current?.click(), disabled: uploading, className: "mt-2 inline-flex items-center gap-1.5 px-4 py-2 bg-blue-900 text-white text-sm font-semibold rounded-lg hover:bg-blue-800 disabled:opacity-50 transition-colors", children: [uploading ? _jsx(SpinnerGap, { size: 15, className: "animate-spin" }) : _jsx(UploadSimple, { size: 15 }), uploading ? "Uploading..." : "Browse device"] }), _jsx("p", { className: "text-[11px] text-gray-400 mt-2", children: "JPG, PNG, WebP, GIF, MP4, WebM, PDF \u2014 up to 50 MB each" })] }), _jsxs("div", { className: "flex flex-wrap gap-2 mb-4", children: [_jsx("input", { value: newAlt, onChange: (e) => setNewAlt(e.target.value), placeholder: "Alt text", className: "flex-1 min-w-[120px] px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-200 outline-none" }), _jsx("input", { value: newUrl, onChange: (e) => setNewUrl(e.target.value), placeholder: "Or paste an external URL", className: "flex-1 min-w-[180px] px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-200 outline-none" }), _jsx("input", { value: newSection, onChange: (e) => setNewSection(e.target.value), placeholder: "Section (optional)", className: "flex-1 min-w-[120px] px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-200 outline-none" }), _jsxs("button", { onClick: addAsset, className: "flex items-center gap-1.5 px-4 py-2 bg-blue-900 text-white text-sm font-semibold rounded-lg hover:bg-blue-800 transition-all", children: [_jsx(Plus, { size: 16 }), " Add"] })] }), _jsxs("div", { className: "space-y-4", children: [sections.map((section) => (_jsxs("div", { children: [_jsx("h3", { className: "text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2", children: section || "Uncategorized" }), _jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3", children: assets.filter((a) => a.section === section).map(renderAssetCard) })] }, section))), uncategorized.length > 0 && (_jsxs("div", { children: [_jsx("h3", { className: "text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2", children: "Uncategorized" }), _jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3", children: uncategorized.map(renderAssetCard) })] })), assets.length === 0 && _jsx("p", { className: "text-sm text-gray-400 text-center py-6", children: "No media assets yet." })] })] }));
}
