import { useState } from "react";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const FILE_TYPE_ICONS = {
  pdf:   "📄",
  image: "🖼️",
  video: "🎬",
  audio: "🎵",
  doc:   "📝",
  zip:   "📦",
};

function getFileIcon(type = "") {
  const t = type.toLowerCase();
  if (t.includes("pdf"))                                          return FILE_TYPE_ICONS.pdf;
  if (t.includes("image") || t.includes("png") || t.includes("jpg")) return FILE_TYPE_ICONS.image;
  if (t.includes("video"))                                        return FILE_TYPE_ICONS.video;
  if (t.includes("audio"))                                        return FILE_TYPE_ICONS.audio;
  if (t.includes("zip")  || t.includes("rar"))                   return FILE_TYPE_ICONS.zip;
  return FILE_TYPE_ICONS.doc;
}

function formatDate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (isNaN(d)) return null;
  return d.toLocaleDateString("en-AU", { day: "2-digit", month: "short", year: "numeric" });
}

export default function FileCard({ file, token }) {
  const [downloading, setDownloading] = useState(false);

  if (!file) return null;

  const fileName    = file.filename || file.name || "Untitled";
  const fileType    = file.type     || "Document";
  const fileId      = file.id       || file._id  || null;
  const cid         = file.cid      || null;
  const createdAt   = formatDate(file.createdAt || file.created_at || file.uploadedAt);
  const isProtected = !!(
    file.nominees?.length ||
    file.keyHolderList?.length ||
    file.protected
  );
  const icon = getFileIcon(fileType);

  const handleView = async () => {
    if (!cid && !fileId) return;
    setDownloading(true);

    try {
      // Prefer backend download endpoint so the server returns the file with
      // correct headers (Content-Disposition: attachment; filename="...").
      // Fall back to a proxied CID fetch if no fileId available.
      const url = fileId
        ? `${API_BASE_URL}/api/file/${fileId}/download`
        : `${API_BASE_URL}/api/download?cid=${encodeURIComponent(cid)}`;

      const res = await fetch(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!res.ok) throw new Error("Download failed");

      const blob = await res.blob();

      // Try to read the filename from the Content-Disposition header first,
      // then fall back to the stored fileName.
      let downloadName = fileName;
      const disposition = res.headers.get("Content-Disposition");
      if (disposition) {
        const match = disposition.match(/filename\*?=(?:UTF-8''|")?([^";]+)/i);
        if (match) downloadName = decodeURIComponent(match[1].replace(/"/g, ""));
      }

      // Trigger browser download with the correct filename
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = downloadName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(objectUrl);
    } catch (err) {
      console.error("Download error:", err);
      // Last-resort fallback: open the IPFS gateway in a new tab
      if (cid) window.open(`https://ipfs.io/ipfs/${cid}`, "_blank", "noopener,noreferrer");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="flex items-center gap-4 bg-dark-card border border-dark-border rounded-xl px-5 py-4 hover:border-primary transition">
      {/* Icon */}
      <div className="text-3xl flex-shrink-0">{icon}</div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white truncate">{fileName}</p>

        <div className="flex items-center gap-2 flex-wrap mt-0.5">
          <p className="text-xs text-gray-400">{fileType}</p>

          {isProtected && (
            <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-medium">
              🔒 Nominee Protected
            </span>
          )}
        </div>

        {createdAt && (
          <p className="text-xs text-gray-500 mt-1">Added {createdAt}</p>
        )}
      </div>

      {/* View / Download button */}
      {(cid || fileId) && (
        <button
          onClick={handleView}
          disabled={downloading}
          className="flex-shrink-0 text-xs px-3 py-1.5 rounded-lg bg-primary/20 hover:bg-primary/40 text-primary border border-primary/30 transition font-medium disabled:opacity-50"
        >
          {downloading ? "…" : "View"}
        </button>
      )}
    </div>
  );
}
