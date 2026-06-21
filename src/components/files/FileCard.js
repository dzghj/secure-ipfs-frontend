import { useState } from "react";

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
  const [viewing, setViewing] = useState(false);   // true while fetching / just opened

  if (!file) return null;

  const fileName    = file.filename || file.name || "Untitled";
  const fileType    = file.type     || "Document";
  const cid         = file.cid      || null;
  const createdAt   = formatDate(file.createdAt || file.created_at || file.uploadedAt);
  const isProtected = !!(
    file.nominees?.length ||
    file.keyHolderList?.length ||
    file.protected
  );
  const icon = getFileIcon(fileType);

  const handleView = async () => {
    if (!cid && !file.id) return;
    setViewing(true);

    try {
      // Use the backend's view endpoint — it fetches from IPFS server-side,
      // sets correct Content-Disposition and Content-Type headers, and
      // streams the original unmodified file back to the browser.
      const viewUrl = file.viewUrl || `${process.env.REACT_APP_API_BASE_URL}/api/file/${file.id}/view`;

      const res = await fetch(viewUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Fetch failed");

      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(objectUrl);
    } catch (err) {
      console.error("View error:", err);
      // Fallback: open backend view URL directly in new tab
      const viewUrl = file.viewUrl || `${process.env.REACT_APP_API_BASE_URL}/api/file/${file.id}/view`;
      window.open(viewUrl, "_blank", "noopener,noreferrer");
    } finally {
      setTimeout(() => setViewing(false), 1500);
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

      {/* View button */}
      {(cid || file.id) && (
        <button
          onClick={handleView}
          disabled={viewing}
          className="flex-shrink-0 text-xs px-3 py-1.5 rounded-lg bg-primary/20 hover:bg-primary/40 text-primary border border-primary/30 transition font-medium disabled:opacity-50"
        >
          {viewing ? "…" : "View"}
        </button>
      )}
    </div>
  );
}
