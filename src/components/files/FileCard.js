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
  if (t.includes("pdf"))                          return FILE_TYPE_ICONS.pdf;
  if (t.includes("image") || t.includes("png") || t.includes("jpg")) return FILE_TYPE_ICONS.image;
  if (t.includes("video"))                        return FILE_TYPE_ICONS.video;
  if (t.includes("audio"))                        return FILE_TYPE_ICONS.audio;
  if (t.includes("zip") || t.includes("rar"))     return FILE_TYPE_ICONS.zip;
  return FILE_TYPE_ICONS.doc;
}

export default function FileCard({ file }) {
  const [copied, setCopied] = useState(false);

  if (!file) return null;

  const fileName  = file.filename || file.name || "Untitled";
  const fileType  = file.type || "Document";
  const cid       = file.cid || null;
  const icon      = getFileIcon(fileType);

  const copyCID = async () => {
    if (!cid) return;
    try {
      await navigator.clipboard.writeText(cid);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      window.alert("Unable to copy. Please copy manually.");
    }
  };

  return (
    <div className="flex items-center gap-4 bg-dark-card border border-dark-border rounded-xl px-5 py-4 hover:border-primary transition">
      {/* Icon */}
      <div className="text-3xl flex-shrink-0">{icon}</div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white truncate">{fileName}</p>
        <p className="text-xs text-gray-400 mt-0.5">{fileType}</p>
        {cid && (
          <p className="text-xs text-blue-400 truncate mt-1 font-mono">{cid}</p>
        )}
      </div>

      {/* Copy CID button */}
      {cid && (
        <button
          onClick={copyCID}
          className="flex-shrink-0 text-xs px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-gray-300 transition"
        >
          {copied ? "✓ Copied" : "Copy ID"}
        </button>
      )}
    </div>
  );
}
