import { useState } from "react";
import KeyHolderManager from "./KeyHolderManager";

export default function FileCard({ file, token }) {
  if (!file) {
    return null;
  }

  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);

  const createdDate = file.uploadedAt
    ? new Date(file.uploadedAt).toLocaleDateString()
    : "—";

  const lastAccessDate = file.lastAccessedAt
    ? new Date(file.lastAccessedAt).toLocaleString()
    : "—";

  const isProtected = Boolean(file.protectionOn);
  const riskScore = typeof file.riskScore === "number" ? file.riskScore : null;
  const fileName = file.filename || file.name || "Untitled";
  const fileSize = file.size ? `${Math.round(file.size / 1024)} KB` : "—";
  const viewUrl = file.viewUrl || `/api/file/${file.id}/view`;

  const status =
    riskScore === null
      ? { label: "Unknown", color: "text-slate-400", dot: "bg-slate-400" }
      : riskScore > 80
      ? { label: "Secure", color: "text-emerald-400", dot: "bg-emerald-400" }
      : riskScore > 50
      ? { label: "Monitor", color: "text-amber-400", dot: "bg-amber-400" }
      : { label: "Risk", color: "text-red-400", dot: "bg-red-400" };

  const copyCID = async () => {
    if (!file.cid) return;

    try {
      await navigator.clipboard.writeText(file.cid);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch (err) {
      console.error(err);
      window.alert("Unable to copy CID. Please copy manually.");
    }
  };

  const deleteFile = async (fileId) => {
    if (!window.confirm("Delete this asset permanently?")) {
      return;
    }

    setBusy(true);
    try {
      const res = await fetch(`/api/file/${fileId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Could not delete asset");
      }

      window.location.reload();
    } catch (err) {
      console.error(err);
      window.alert(err.message || "Delete failed");
    } finally {
      setBusy(false);
    }
  };

  const openFile = () => {
    window.open(viewUrl, "_blank");
  };

  return (
    <div className="group relative rounded-2xl border border-white/10 bg-gradient-to-b from-neutral-950 to-neutral-900 shadow-xl hover:shadow-2xl transition-all duration-300">
      <div className="flex items-start justify-between p-6 border-b border-white/10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-white font-semibold text-sm tracking-wide">
              {fileName}
            </span>
            <span
              className={`w-2 h-2 rounded-full ${file.hasAlert ? "bg-red-500 animate-pulse" : "bg-transparent"}`}
            />
          </div>
          <p className="text-xs text-white/40">Uploaded {createdDate}</p>
        </div>

        <div
          className={`flex items-center gap-2 text-xs px-3 py-1 rounded-full border border-white/10 ${status.color}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
          {status.label} · {riskScore ?? "—"}
        </div>
      </div>

      <div className="p-6 grid grid-cols-2 gap-5 text-xs">
        <div>
          <p className="text-white/40">Last Access</p>
          <p className="text-white/80">{lastAccessDate}</p>
        </div>

        <div>
          <p className="text-white/40">IP</p>
          <p className="text-white/80">{file.lastIp || "—"}</p>
        </div>

        <div>
          <p className="text-white/40">Location</p>
          <p className="text-white/80">{file.lastLocation || "—"}</p>
        </div>

        <div>
          <p className="text-white/40">Protection</p>
          <p className={isProtected ? "text-emerald-400" : "text-white/40"}>
            {isProtected ? "Enabled" : "Disabled"}
          </p>
        </div>

        <div>
          <p className="text-white/40">Size</p>
          <p className="text-white/80">{fileSize}</p>
        </div>

        <div>
          <p className="text-white/40">Type</p>
          <p className="text-white/80">{file.type || "—"}</p>
        </div>
      </div>

      {file.riskSummary && (
        <div className="mx-6 mb-5 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-white/70">
          <span className="text-white/40">AI Insight:</span> {file.riskSummary}
        </div>
      )}

      <div className="mx-6 mb-5">
        <p className="text-xs text-white/40 mb-2">Content ID</p>
        <div className="flex items-center justify-between rounded-xl border border-white/10 bg-black/40 px-3 py-2">
          <span className="text-xs text-blue-400 truncate">{file.cid || "—"}</span>
          {file.cid && (
            <button
              type="button"
              onClick={copyCID}
              className="text-xs px-3 py-1 rounded-md bg-white/10 hover:bg-white/20 transition"
            >
              {copied ? "Copied" : "Copy"}
            </button>
          )}
        </div>
      </div>

      <div className="mx-6 mb-6">
        <p className="text-xs text-white/40 mb-2">Key Access Control</p>
        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
          <KeyHolderManager file={file} token={token} />
        </div>
      </div>

      <div className="flex items-center justify-between px-6 py-4 border-t border-white/10">
        <button
          type="button"
          disabled={busy}
          onClick={() => deleteFile(file.id)}
          className="text-xs text-red-400 transition hover:text-red-300 disabled:cursor-not-allowed disabled:text-red-700"
        >
          {busy ? "Deleting..." : "Delete Asset"}
        </button>

        <button
          type="button"
          onClick={openFile}
          className="px-5 py-2 rounded-xl text-sm font-medium bg-emerald-500 hover:bg-emerald-400 text-black transition"
        >
          Open File
        </button>
      </div>
    </div>
  );
}