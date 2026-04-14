import KeyHolderManager from "./KeyHolderManager";
import { useState } from "react";

export default function FileCard({ file, token }) {
  const [copied, setCopied] = useState(false);

  const createdDate = file.uploadedAt
    ? new Date(file.uploadedAt).toLocaleDateString()
    : "—";

  const lastAccessDate = file.lastAccessedAt
    ? new Date(file.lastAccessedAt).toLocaleString()
    : "—";

  const isProtected = file.protectionOn;
const deleteFile = async (fileId) => {
  if (!window.confirm("Are you sure you want to delete this file?")) return;

  try {
    const res = await fetch(`/api/file/${fileId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Delete failed");

    alert("File deleted");

    // 🔥 refresh UI (choose ONE)

    // Option A: reload page
    window.location.reload();

    // Option B (better if you pass setFiles):
    // setFiles(prev => prev.filter(f => f.id !== fileId));

  } catch (err) {
    console.error(err);
    alert("Delete failed");
  }
};

  const copyCID = () => {
    if (!file.cid) return;
    navigator.clipboard.writeText(file.cid);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  // 🔥 Mock risk (replace with real later)
  const riskScore = file.riskScore ?? 72;

  const riskColor =
    riskScore > 80
      ? "text-green-400 bg-green-900"
      : riskScore > 50
      ? "text-yellow-400 bg-yellow-900"
      : "text-red-400 bg-red-900";

  return (
    <div className="group bg-blue-800 border border-neutral-800 rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">

      {/* HEADER */}
      <div className="flex justify-between items-start mb-5">
        <div>
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            {file.filename}

            {/* 🔔 ALERT DOT */}
            {file.hasAlert && (
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            )}
          </h3>

          <p className="text-xs text-gray-500 mt-1">
            Created: {createdDate}
          </p>
        </div>

        {/* 📊 RISK BADGE */}
        <div className={`text-xs px-3 py-1 rounded-full ${riskColor}`}>
          Risk: {riskScore}
        </div>
      </div>

      {/* 🧠 AI SUMMARY */}
      {file.riskSummary && (
        <div className="mb-5 bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-xs text-gray-300">
          🤖 {file.riskSummary}
        </div>
      )}

      {/* METADATA */}
      <div className="grid grid-cols-2 gap-4 mb-5 text-sm">

        <div>
          <p className="text-gray-500 text-xs">Last Access</p>
          <p className="text-gray-300">{lastAccessDate}</p>
        </div>

        <div>
          <p className="text-gray-500 text-xs">IP Address</p>
          <p className="text-gray-300">{file.lastIp || "Unknown"}</p>
        </div>

        <div>
          <p className="text-gray-500 text-xs">Location</p>
          <p className="text-gray-300">{file.lastLocation || "Unknown"}</p>
        </div>

        <div>
          <p className="text-gray-500 text-xs">Unlock Timer</p>
          <p className="text-purple-400">
            {isProtected ? "30 days remaining" : "—"}
          </p>
        </div>

      </div>

      {/* CID */}
      <div className="mb-5">
        <p className="text-gray-500 text-xs mb-1">CID Reference</p>

        <div className="flex items-center gap-2 bg-neutral-950 border border-neutral-800 rounded-lg p-2 group-hover:border-blue-600 transition">
          <span className="text-xs text-blue-400 break-all flex-1">
            {file.cid || "—"}
          </span>

          {file.cid && (
            <button
              onClick={copyCID}
              className="text-xs bg-neutral-700 px-2 py-1 rounded hover:bg-neutral-600"
            >
              {copied ? "Copied" : "Copy"}
            </button>
          )}
        </div>
      </div>
       {/* CID */}
      <div className="mb-5">
        <p className="text-gray-500 text-xs mb-1">View Audit</p>

        <div className="flex items-center gap-2 bg-neutral-950 border border-neutral-800 rounded-lg p-2 group-hover:border-blue-600 transition">
          <span className="text-xs text-blue-400 break-all flex-1">
            {file.audit || "—"}
          </span>

          
        </div>
      </div>

      {/* 🔐 PROTECTION STATUS */}
      <div className="mb-5 flex justify-between items-center">
        <div>
          <p className="text-gray-500 text-xs">Protection</p>
          <p
            className={`text-sm ${
              isProtected ? "text-green-400" : "text-gray-400"
            }`}
          >
            {isProtected ? "Active" : "Inactive"}
          </p>
        </div>

        <button
          className={`px-4 py-1 rounded-md text-xs font-medium transition ${
            isProtected
              ? "bg-green-600 hover:bg-green-500"
              : "bg-neutral-700 hover:bg-neutral-600"
          }`}
        >
          {isProtected ? "Disable" : "Enable"}
        </button>
      </div>

      {/* 👥 KEYHOLDERS */}
      <div className="mb-5">
        <p className="text-gray-500 text-xs mb-2">KeyHolders</p>

        <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-3">
          <KeyHolderManager file={file} token={token} />
        </div>
      </div>

      {/* ACTIONS */}
      <div className="flex justify-between items-center pt-4 border-t border-neutral-800">

        <button 
         className="text-xs text-red-400 hover:text-red-300 transition"
  onClick={() => deleteFile(file.id)}
        >
           Delete File
        </button>

        <button
          className="px-5 py-2 rounded-lg text-sm font-medium bg-green-600 hover:bg-green-700 transition"
          onClick={() => {
            window.open(`/api/file/${file.id}/view`, "_blank");
          }}
        >
          View File
        </button>

      </div>

    </div>
  );
}