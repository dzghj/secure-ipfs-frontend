import React, { useState } from "react";
import FolderGrid from "./FolderGrid";
import FolderDetail from "./FolderDetail";

export default function VaultPage({ files, token, hasReachedLimit, onUpgrade, user }) {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "U";

  const categories = [...new Set(files.map((f) => f.category || "Personal"))];

  const now = new Date();
  const checkinStr =
    now.toLocaleDateString("en-AU", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }) +
    " · " +
    now.toLocaleTimeString("en-AU", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

  // ── Folder detail drill-down ──────────────────────────────────────────────
  if (selectedCategory) {
    return (
      <FolderDetail
        category={selectedCategory}
        files={files}
        token={token}
        onBack={() => setSelectedCategory(null)}
      />
    );
  }

  // ── Vault dashboard ───────────────────────────────────────────────────────
  return (
    <div className="px-8 py-10">

      {/* Greeting */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center font-bold text-white text-lg flex-shrink-0">
          {initials}
        </div>
        <div>
          <p className="text-gray-400 text-sm">Hi,</p>
          <h1 className="text-2xl font-bold leading-tight">{user?.name || "User"}</h1>
        </div>
      </div>

      {/* Plan limit warning */}
      {hasReachedLimit && (
        <div className="bg-yellow-600 text-black p-4 rounded-xl mb-6 flex items-center justify-between">
          <span className="font-medium text-sm">You've reached your plan limit.</span>
          <button
            onClick={onUpgrade}
            className="ml-4 bg-black text-white px-4 py-2 rounded-lg text-sm font-semibold"
          >
            Upgrade Plan
          </button>
        </div>
      )}

      {/* Vault Summary */}
      <div className="bg-dark-card border border-dark-border rounded-2xl p-6 mb-6 hover:border-primary transition">
        <h2 className="text-lg font-bold mb-4">Vault Summary</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-primary to-primary-dark rounded-xl p-5 text-white">
            <div className="text-4xl font-bold mb-1">
              {String(categories.length || 0).padStart(2, "0")}
            </div>
            <div className="text-sm opacity-80">Categories</div>
          </div>
          <div className="bg-gradient-to-br from-primary to-primary-dark rounded-xl p-5 text-white">
            <div className="text-4xl font-bold mb-1">
              {String(files.length).padStart(2, "0")}
            </div>
            <div className="text-sm opacity-80">Documents</div>
          </div>
        </div>
      </div>

      {/* Continuity Switch status */}
      <div className="bg-dark-card border border-dark-border rounded-2xl p-6 mb-6 hover:border-primary transition">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold mb-1">Continuity Switch</h2>
            <p className="text-sm text-emerald-400 font-medium mb-1">Checked-in Successfully!</p>
            <p className="text-xs text-gray-500">{checkinStr}</p>
            <p className="text-xs text-gray-400 mt-1">Your next check-in is in 90 days.</p>
          </div>
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg flex-shrink-0">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
              stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <polyline points="9 12 11 14 15 10" />
            </svg>
          </div>
        </div>
      </div>

      {/* My Vault folder grid */}
      <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold">My Vault</h2>
        </div>

        {files.length === 0 && categories.length === 0 ? (
          <div className="text-center py-10">
            <div className="text-5xl mb-3">🗄️</div>
            <p className="text-gray-400 text-sm">No files yet. Add a folder to get started.</p>
          </div>
        ) : (
          <>
            <FolderGrid
              files={files}
              categories={categories}
              onFolderClick={setSelectedCategory}
            />

            <p className="text-xs text-gray-500 text-center mt-5">
              Click a category to view its files.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
