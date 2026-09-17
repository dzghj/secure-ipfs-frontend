import { useState } from "react";
import { verifyFileProofAPI } from "../../services/api";

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

export default function FileCard({ file, token, nominees = [] }) {
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState(null); // { verified, pending, bitcoinTime, note } | { error }

  if (!file) return null;

  const fileName     = file.filename || file.name || "Untitled";
  const fileType     = file.type     || "Document";
  const cid          = file.cid      || null;
  const fileCategory = file.category || "Personal";
  const createdAt    = formatDate(file.createdAt || file.created_at || file.uploadedAt);

  // Protected if any full-access nominee exists (covers all files),
  // or a partial nominee covers this file's category, or legacy keyHolderList
  const isProtected = !!(
    nominees.some((n) => n.accessLevel === "full") ||
    nominees.some(
      (n) =>
        n.accessLevel === "partial" &&
        Array.isArray(n.allowedFolders) &&
        n.allowedFolders.includes(fileCategory)
    ) ||
    file.keyHolderList?.length ||
    file.protected
  );
  const icon = getFileIcon(fileType);

  const handleView = async () => {
    if (!file.id && !cid) return;
    setDownloading(true);
    setError("");

    const authToken = token || localStorage.getItem("token");
    const viewUrl = file.viewUrl
      || `${process.env.REACT_APP_API_BASE_URL}/api/file/${file.id}/view`;

    try {
      const res = await fetch(viewUrl, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Server returned ${res.status}: ${text}`);
      }

      const json = await res.json();

      // Backend returns { data: "<base64>", mimeType: "image/jpeg", filename: "..." }
      const base64 = json.data;
      const mimeType = json.mimeType || "application/octet-stream";
      const downloadName = json.filename || fileName;

      // Decode base64 → binary → Blob
      const byteChars = atob(base64);
      const byteArray = new Uint8Array(byteChars.length);
      for (let i = 0; i < byteChars.length; i++) {
        byteArray[i] = byteChars.charCodeAt(i);
      }
      const blob = new Blob([byteArray], { type: mimeType });

      // Trigger download with correct filename
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = downloadName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(objectUrl);
    } catch (err) {
      console.error("Download failed:", err);
      setError(err.message);
    } finally {
      setDownloading(false);
    }
  };

  const handleVerify = async () => {
    if (!file.id) return;
    setVerifying(true);
    setVerifyResult(null);

    const authToken = token || localStorage.getItem("token");
    try {
      const result = await verifyFileProofAPI(authToken, file.id);
      setVerifyResult(result);
    } catch (err) {
      setVerifyResult({ error: err.message });
    } finally {
      setVerifying(false);
    }
  };

  const handleDownloadProof = async () => {
    if (!file.id) return;
    setError("");
    const authToken = token || localStorage.getItem("token");
    const proofUrl = `${process.env.REACT_APP_API_BASE_URL}/api/file/${file.id}/proof`;

    try {
      const res = await fetch(proofUrl, { headers: { Authorization: `Bearer ${authToken}` } });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || `Server returned ${res.status}`);
      }
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = `${fileName}.ots`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(objectUrl);
    } catch (err) {
      console.error("Proof download failed:", err);
      setError(`Couldn't download proof: ${err.message}`);
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

          {verifyResult && (
            <span
              title={
                verifyResult.error
                  ? verifyResult.error
                  : verifyResult.verified
                  ? `Confirmed in Bitcoin block at ${new Date(verifyResult.bitcoinTime).toLocaleString()}`
                  : verifyResult.note || "Bitcoin attestation not yet available."
              }
              className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium border ${
                verifyResult.error
                  ? "bg-red-500/10 border-red-500/30 text-red-400"
                  : verifyResult.verified
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                  : "bg-amber-500/10 border-amber-500/30 text-amber-400"
              }`}
            >
              {verifyResult.error
                ? "⚠️ Verify failed"
                : verifyResult.verified
                ? "✓ Verified on Bitcoin"
                : "⏳ Pending Bitcoin confirmation"}
            </span>
          )}
        </div>

        {createdAt && (
          <p className="text-xs text-gray-500 mt-1">Added {createdAt}</p>
        )}

        {verifyResult && (
          <p
            className={`text-xs mt-1 ${
              verifyResult.error ? "text-red-400" : verifyResult.verified ? "text-emerald-400" : "text-gray-400"
            }`}
          >
            {verifyResult.error
              ? `Couldn't verify: ${verifyResult.error}`
              : verifyResult.verified
              ? `Confirmed in Bitcoin block at ${new Date(verifyResult.bitcoinTime).toLocaleString()}`
              : verifyResult.note || "Bitcoin attestation not yet available — this can take a few hours after upload."}
          </p>
        )}
      </div>

      {/* View / Verify buttons */}
      {(cid || file.id) && (
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <div className="flex gap-2">
            <button
              onClick={handleView}
              disabled={downloading}
              className="text-xs px-3 py-1.5 rounded-lg bg-primary/20 hover:bg-primary/40 text-primary border border-primary/30 transition font-medium disabled:opacity-50"
            >
              {downloading ? "…" : "View"}
            </button>
            {file.otsAnchoredAt && (
              file.otsUpgradedAt ? (
                <button
                  onClick={handleVerify}
                  disabled={verifying}
                  title="Check this file's OpenTimestamps proof against the Bitcoin blockchain"
                  className="text-xs px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 transition font-medium disabled:opacity-50"
                >
                  {verifying ? "…" : "₿ Verify on Bitcoin"}
                </button>
              ) : (
                <span
                  title="This file's proof hasn't reached a Bitcoin confirmation yet — usually a few hours after upload. Nothing to click until then; check back later."
                  className="text-xs px-3 py-1.5 rounded-lg bg-dark-bg text-gray-500 border border-dark-border font-medium cursor-default"
                >
                  ⏳ Pending Bitcoin
                </span>
              )
            )}
          </div>
          {file.otsAnchoredAt && (
            <button
              onClick={handleDownloadProof}
              title="Download the raw .ots proof file to verify independently"
              className="text-xs text-gray-500 hover:text-gray-300 underline decoration-dotted transition"
            >
              ⇩ Download proof
            </button>
          )}
          {error && <p className="text-xs text-red-400">{error}</p>}
        </div>
      )}
    </div>
  );
}
