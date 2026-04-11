import { useState, useEffect } from "react";
import KeyHolderManager from "./KeyHolderManager";

export default function FileCard({ file, token }) {
  const [copied, setCopied] = useState(false);
  const [remainingDays, setRemainingDays] = useState(null);

  // 🔥 Smart countdown
  useEffect(() => {
    if (!file.protectionOn || !file.lastAccessedAt) return;

    const last = new Date(file.lastAccessedAt);
    const now = new Date();
    const diff = Math.floor((now - last) / (1000 * 60 * 60 * 24));
    setRemainingDays(Math.max(30 - diff, 0));
  }, [file]);

  const copyCID = () => {
    navigator.clipboard.writeText(file.cid);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  // 🔥 Simple risk score logic (can upgrade later)
  const riskScore = file.protectionOn
    ? remainingDays < 5
      ? "High"
      : "Low"
    : "Medium";

  return (
    <div className="bg-neutral-900/80 backdrop-blur-md p-6 rounded-2xl border border-neutral-700 shadow-xl space-y-6">

      {/* 🔷 HEADER */}
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-white">
            {file.filename}
          </h3>
          <p className="text-xs text-gray-400">
            Created {new Date(file.uploadedAt).toLocaleDateString()}
          </p>
        </div>

        {/* 🔐 Risk Badge */}
        <div
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            riskScore === "High"
              ? "bg-red-600/20 text-red-400"
              : riskScore === "Medium"
              ? "bg-yellow-600/20 text-yellow-400"
              : "bg-green-600/20 text-green-400"
          }`}
        >
          Risk: {riskScore}
        </div>
      </div>

      {/* ⛓ BLOCKCHAIN STATUS */}
      <div className="flex items-center justify-between bg-neutral-800 p-4 rounded-xl">
        <div>
          <p className="text-sm text-gray-400">Integrity</p>
          <p className="text-blue-400 font-medium flex items-center gap-2">
            ⛓ Verified on chain
            <span className="animate-pulse text-xs text-gray-500">
              ●
            </span>
          </p>
          {file.verifiedAt && (
            <p className="text-xs text-gray-500">
              {new Date(file.verifiedAt).toLocaleString()}
            </p>
          )}
        </div>

        {/* CID */}
        <button
          onClick={copyCID}
          className="text-xs bg-neutral-700 px-3 py-1 rounded hover:bg-neutral-600"
        >
          {copied ? "Copied CID" : "Copy CID"}
        </button>
      </div>

      {/* 🔐 DEAD MAN STATUS */}
      <div className="bg-neutral-800 p-4 rounded-xl space-y-2">
        <p className="text-sm text-gray-400">Dead-Man Switch</p>

        <div className="flex justify-between items-center">
          <span
            className={`text-xs px-3 py-1 rounded ${
              file.protectionOn
                ? "bg-green-600 text-white"
                : "bg-neutral-700 text-gray-400"
            }`}
          >
            {file.protectionOn ? "Active" : "Disabled"}
          </span>

          {remainingDays !== null && (
            <span className="text-purple-400 text-sm">
              {remainingDays} days remaining
            </span>
          )}
        </div>

        {/* 🧠 Timeline Preview */}
        {file.protectionOn && (
          <div className="text-xs text-gray-400 pt-2 border-t border-neutral-700">
            Day 30 → Reminder email<br />
            Day 40 → Keyholder access unlock
          </div>
        )}
      </div>

      {/* 👥 KEYHOLDERS */}
      <div className="bg-neutral-800 p-4 rounded-xl space-y-3">
        <p className="text-sm text-gray-400">Keyholders</p>

        <KeyHolderManager file={file} token={token} />

        {/* Status */}
        <div className="flex flex-wrap gap-2">
          {(file.keyholders || []).map((k, i) => (
            <span
              key={i}
              className={`px-2 py-1 rounded text-xs ${
                k.confirmed
                  ? "bg-green-600/20 text-green-300"
                  : "bg-yellow-600/20 text-yellow-300"
              }`}
            >
              {k.email} • {k.confirmed ? "Confirmed" : "Pending"}
            </span>
          ))}
        </div>
      </div>

      {/* 📊 ACTIVITY TIMELINE */}
      <div className="bg-neutral-800 p-4 rounded-xl">
        <p className="text-sm text-gray-400 mb-3">Activity Timeline</p>

        <div className="space-y-2 max-h-40 overflow-y-auto text-xs">
          {file.auditLogs?.length ? (
            file.auditLogs.map((log, i) => (
              <div key={i} className="flex justify-between text-gray-400">
                <span>{log.action}</span>
                <span>{new Date(log.time).toLocaleDateString()}</span>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No activity</p>
          )}
        </div>
      </div>

      {/* 🌍 ACCESS INFO */}
      <div className="bg-neutral-800 p-4 rounded-xl text-xs text-gray-400">
        <p>Last Access IP: {file.lastIp || "Unknown"}</p>
        <p>Location: {file.lastLocation || "Unknown"}</p>
      </div>

      {/* 🔓 ACTION */}
      <div className="flex justify-end">
        <button className="px-5 py-2 rounded-md text-sm font-medium bg-green-600 hover:bg-green-700">
          Secure View
        </button>
      </div>
    </div>
  );
}