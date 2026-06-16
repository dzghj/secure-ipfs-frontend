import React from "react";
import FileList from "./FileList";
import { FOLDER_TYPES } from "./FolderGrid";
import { FolderSvg } from "./FolderCard";

export default function FolderDetail({ category, files, token, onBack }) {
  const ft =
    FOLDER_TYPES.find(
      (f) => f.label.toLowerCase() === category.toLowerCase()
    ) || FOLDER_TYPES[0];

  const categoryFiles = files.filter(
    (f) => (f.category || "Personal") === category
  );

  return (
    <div className="w-full px-8 py-10">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={onBack}
          className="w-9 h-9 flex items-center justify-center rounded-xl border border-dark-border text-primary hover:bg-white/5 transition text-xl font-bold"
          aria-label="Back to vault"
        >
          ‹
        </button>
        <FolderSvg color={ft.color} size={36} />
        <div>
          <h1 className="text-2xl font-bold leading-tight">{category}</h1>
          <p className="text-sm text-gray-400">
            {categoryFiles.length} file{categoryFiles.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Files */}
      {categoryFiles.length === 0 ? (
        <div className="text-center py-16 bg-dark-card border border-dark-border rounded-2xl">
          <div className="text-5xl mb-3">📂</div>
          <p className="text-gray-400 text-sm">No files in this folder yet.</p>
        </div>
      ) : (
        <FileList files={categoryFiles} token={token} />
      )}
    </div>
  );
}
