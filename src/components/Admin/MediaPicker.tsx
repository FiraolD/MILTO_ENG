import { useState, useEffect, useCallback, useRef } from "react";
import { X, UploadSimple, FilmSlate, ImageSquare, SpinnerGap, FolderOpen } from "@phosphor-icons/react";
import { mediaApi } from "@/lib/api";
import { isVideoUrl } from "@/lib/mediaUtils";
import { toast } from "sonner";
import type { MediaAsset } from "@/types";

interface MediaPickerProps {
  open: boolean;
  onClose: () => void;
  /** Called with the selected asset URL */
  onSelect: (url: string) => void;
  /** Limit the listed assets to a media type ("all" by default) */
  mediaType?: "image" | "video" | "all";
  title?: string;
}

export default function MediaPicker({
  open,
  onClose,
  onSelect,
  mediaType = "all",
  title = "Browse Media Assets",
}: MediaPickerProps) {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const data = await mediaApi.list();
      setAssets(data ?? []);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to load media assets");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (open) fetch();
  }, [open, fetch]);

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    let added = 0;
    for (const file of Array.from(files)) {
      try {
        const created = await mediaApi.upload(file);
        setAssets((prev) => [created, ...prev]);
        added++;
      } catch (err: unknown) {
        toast.error(err instanceof Error ? err.message : `Failed to upload ${file.name}`);
      }
    }
    setUploading(false);
    if (added > 0) toast.success(`${added} file${added > 1 ? "s" : ""} uploaded`);
    if (fileRef.current) fileRef.current.value = "";
  };

  if (!open) return null;

  const filtered = assets.filter((a) => {
    if (mediaType === "all") return true;
    const video = isVideoUrl(a.url);
    return mediaType === "video" ? video : !video;
  });

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
          <div>
            <h3 className="font-semibold text-blue-900">{title}</h3>
            <p className="text-xs text-gray-500">
              Pick an existing asset or upload a new one from your device
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-1.5 px-3 py-2 bg-blue-900 text-white text-xs font-semibold rounded-lg hover:bg-blue-800 disabled:opacity-50"
            >
              {uploading ? <SpinnerGap size={14} className="animate-spin" /> : <UploadSimple size={14} />}
              {uploading ? "Uploading..." : "Upload from device"}
            </button>
            <input
              ref={fileRef}
              type="file"
              multiple
              accept="image/*,video/*,.pdf"
              className="hidden"
              onChange={(e) => handleUpload(e.target.files)}
            />
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto p-5">
          {loading ? (
            <div className="flex items-center justify-center py-16 text-gray-400 text-sm gap-2">
              <SpinnerGap size={18} className="animate-spin" /> Loading assets...
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <ImageSquare size={36} className="mx-auto text-gray-300 mb-2" />
              <p className="text-sm text-gray-500">
                No {mediaType === "all" ? "" : mediaType + " "}assets yet. Upload one from your device.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {filtered.map((asset) => {
                const video = isVideoUrl(asset.url);
                return (
                  <button
                    key={asset.id}
                    onClick={() => {
                      onSelect(asset.url);
                      onClose();
                    }}
                    className="group relative aspect-square rounded-xl border border-slate-200 overflow-hidden bg-slate-50 hover:border-blue-400 hover:ring-2 hover:ring-blue-200 transition-all"
                    title={asset.alt}
                  >
                    {video ? (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-1 bg-blue-50">
                        <FilmSlate size={26} className="text-blue-400" />
                        <span className="text-[10px] text-blue-500 font-medium px-2 truncate w-full text-center">
                          {asset.alt}
                        </span>
                      </div>
                    ) : (
                      <img
                        src={asset.url}
                        alt={asset.alt}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    )}
                    <span className="absolute bottom-0 inset-x-0 bg-black/50 text-white text-[10px] px-2 py-1 truncate opacity-0 group-hover:opacity-100 transition-opacity">
                      {asset.alt}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-200 flex items-center justify-between">
          <p className="text-xs text-gray-400">{filtered.length} asset{filtered.length !== 1 ? "s" : ""}</p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-600 text-sm font-semibold rounded-lg hover:bg-gray-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * URL input paired with a "Browse" button that opens the MediaPicker.
 * Drop-in replacement for plain media URL inputs in admin forms.
 */
export function MediaUrlField({
  value,
  onChange,
  mediaType = "all",
  placeholder = "https://...",
  inputClassName = "w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none",
}: {
  value: string;
  onChange: (url: string) => void;
  mediaType?: "image" | "video" | "all";
  placeholder?: string;
  inputClassName?: string;
}) {
  const [pickerOpen, setPickerOpen] = useState(false);

  return (
    <div className="flex items-center gap-2">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${inputClassName} flex-1 min-w-0`}
        placeholder={placeholder}
      />
      <button
        type="button"
        onClick={() => setPickerOpen(true)}
        title="Browse media assets"
        className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors shrink-0"
      >
        <FolderOpen size={14} /> Browse
      </button>
      <MediaPicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={onChange}
        mediaType={mediaType}
      />
    </div>
  );
}
