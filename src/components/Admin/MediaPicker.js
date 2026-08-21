import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useCallback, useRef } from "react";
import { X, UploadSimple, FilmSlate, ImageSquare, SpinnerGap, FolderOpen } from "@phosphor-icons/react";
import { mediaApi } from "@/lib/api";
import { isVideoUrl } from "@/lib/mediaUtils";
import { toast } from "sonner";
export default function MediaPicker({ open, onClose, onSelect, mediaType = "all", title = "Browse Media Assets", }) {
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileRef = useRef(null);
    const fetch = useCallback(async () => {
        setLoading(true);
        try {
            const data = await mediaApi.list();
            setAssets(data ?? []);
        }
        catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to load media assets");
        }
        setLoading(false);
    }, []);
    useEffect(() => {
        if (open)
            fetch();
    }, [open, fetch]);
    const handleUpload = async (files) => {
        if (!files || files.length === 0)
            return;
        setUploading(true);
        let added = 0;
        for (const file of Array.from(files)) {
            try {
                const created = await mediaApi.upload(file);
                setAssets((prev) => [created, ...prev]);
                added++;
            }
            catch (err) {
                toast.error(err instanceof Error ? err.message : `Failed to upload ${file.name}`);
            }
        }
        setUploading(false);
        if (added > 0)
            toast.success(`${added} file${added > 1 ? "s" : ""} uploaded`);
        if (fileRef.current)
            fileRef.current.value = "";
    };
    if (!open)
        return null;
    const filtered = assets.filter((a) => {
        if (mediaType === "all")
            return true;
        const video = isVideoUrl(a.url);
        return mediaType === "video" ? video : !video;
    });
    return (_jsx("div", { className: "fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50", onClick: onClose, children: _jsxs("div", { className: "bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col", onClick: (e) => e.stopPropagation(), children: [_jsxs("div", { className: "flex items-center justify-between px-5 py-4 border-b border-slate-200", children: [_jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-blue-900", children: title }), _jsx("p", { className: "text-xs text-gray-500", children: "Pick an existing asset or upload a new one from your device" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsxs("button", { onClick: () => fileRef.current?.click(), disabled: uploading, className: "flex items-center gap-1.5 px-3 py-2 bg-blue-900 text-white text-xs font-semibold rounded-lg hover:bg-blue-800 disabled:opacity-50", children: [uploading ? _jsx(SpinnerGap, { size: 14, className: "animate-spin" }) : _jsx(UploadSimple, { size: 14 }), uploading ? "Uploading..." : "Upload from device"] }), _jsx("input", { ref: fileRef, type: "file", multiple: true, accept: "image/*,video/*,.pdf", className: "hidden", onChange: (e) => handleUpload(e.target.files) }), _jsx("button", { onClick: onClose, className: "p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg", children: _jsx(X, { size: 16 }) })] })] }), _jsx("div", { className: "flex-1 overflow-y-auto p-5", children: loading ? (_jsxs("div", { className: "flex items-center justify-center py-16 text-gray-400 text-sm gap-2", children: [_jsx(SpinnerGap, { size: 18, className: "animate-spin" }), " Loading assets..."] })) : filtered.length === 0 ? (_jsxs("div", { className: "text-center py-16", children: [_jsx(ImageSquare, { size: 36, className: "mx-auto text-gray-300 mb-2" }), _jsxs("p", { className: "text-sm text-gray-500", children: ["No ", mediaType === "all" ? "" : mediaType + " ", "assets yet. Upload one from your device."] })] })) : (_jsx("div", { className: "grid grid-cols-3 sm:grid-cols-4 gap-3", children: filtered.map((asset) => {
                            const video = isVideoUrl(asset.url);
                            return (_jsxs("button", { onClick: () => {
                                    onSelect(asset.url);
                                    onClose();
                                }, className: "group relative aspect-square rounded-xl border border-slate-200 overflow-hidden bg-slate-50 hover:border-blue-400 hover:ring-2 hover:ring-blue-200 transition-all", title: asset.alt, children: [video ? (_jsxs("div", { className: "w-full h-full flex flex-col items-center justify-center gap-1 bg-blue-50", children: [_jsx(FilmSlate, { size: 26, className: "text-blue-400" }), _jsx("span", { className: "text-[10px] text-blue-500 font-medium px-2 truncate w-full text-center", children: asset.alt })] })) : (_jsx("img", { src: asset.url, alt: asset.alt, className: "w-full h-full object-cover group-hover:scale-105 transition-transform", onError: (e) => {
                                            e.target.style.display = "none";
                                        } })), _jsx("span", { className: "absolute bottom-0 inset-x-0 bg-black/50 text-white text-[10px] px-2 py-1 truncate opacity-0 group-hover:opacity-100 transition-opacity", children: asset.alt })] }, asset.id));
                        }) })) }), _jsxs("div", { className: "px-5 py-3 border-t border-slate-200 flex items-center justify-between", children: [_jsxs("p", { className: "text-xs text-gray-400", children: [filtered.length, " asset", filtered.length !== 1 ? "s" : ""] }), _jsx("button", { onClick: onClose, className: "px-4 py-2 bg-gray-100 text-gray-600 text-sm font-semibold rounded-lg hover:bg-gray-200", children: "Cancel" })] })] }) }));
}
/**
 * URL input paired with a "Browse" button that opens the MediaPicker.
 * Drop-in replacement for plain media URL inputs in admin forms.
 */
export function MediaUrlField({ value, onChange, mediaType = "all", placeholder = "https://...", inputClassName = "w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none", }) {
    const [pickerOpen, setPickerOpen] = useState(false);
    return (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("input", { value: value, onChange: (e) => onChange(e.target.value), className: `${inputClassName} flex-1 min-w-0`, placeholder: placeholder }), _jsxs("button", { type: "button", onClick: () => setPickerOpen(true), title: "Browse media assets", className: "flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors shrink-0", children: [_jsx(FolderOpen, { size: 14 }), " Browse"] }), _jsx(MediaPicker, { open: pickerOpen, onClose: () => setPickerOpen(false), onSelect: onChange, mediaType: mediaType })] }));
}
