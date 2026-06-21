import React, { useState } from "react";
import { FolderSvg } from "./FolderCard";
import { FOLDER_TYPES } from "./FolderGrid";

// Remove Photos, Videos, Other
const SELECTABLE_TYPES = FOLDER_TYPES.filter(
  (ft) => !["photos", "videos", "other"].includes(ft.id)
);

export default function AddFolderPage({ onFolderCreated, existingCategories = [] }) {
  const [selected,  setSelected]  = useState("personal");
  const [creating,  setCreating]  = useState(false);
  const [success,   setSuccess]   = useState("");
  const [error,     setError]     = useState("");

  const selectedType = SELECTABLE_TYPES.find((ft) => ft.id === selected) || SELECTABLE_TYPES[0];
  const categoryName = selectedType.label;

  const handleCreate = async () => {
    if (!categoryName) return;

    // Check if category already exists
    if (existingCategories.map((c) => c.toLowerCase()).includes(categoryName.toLowerCase())) {
      setError(`"${categoryName}" folder already exists.`);
      return;
    }

    setCreating(true);
    setError("");

    try {
      // Notify parent — parent adds it to the categories list and switches to vault tab
      if (onFolderCreated) onFolderCreated(categoryName);
      setSuccess(`"${categoryName}" folder created!`);
    } catch (err) {
      setError("Failed to create folder.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="px-8 py-10">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-1">Add New Folder</h1>
          <p className="text-gray-400 text-sm">Organise your vault with custom categories.</p>
        </div>

        <div className="mb-8">
          <label className="text-sm text-gray-400 mb-3 block font-medium">
            Select Folder Type
          </label>
          <div className="grid grid-cols-3 gap-3">
            {SELECTABLE_TYPES.map((ft) => (
              <button
                key={ft.id}
                onClick={() => { setSelected(ft.id); setError(""); setSuccess(""); }}
                className={`flex flex-col items-center py-5 px-2 rounded-2xl border-2 transition-all hover:border-primary ${
                  selected === ft.id
                    ? "border-primary bg-dark-card"
                    : "border-dark-border bg-dark-card bg-opacity-50"
                }`}
              >
                <FolderSvg color={ft.color} />
                <span className="text-sm text-gray-300 mt-2 font-medium">{ft.label}</span>
              </button>
            ))}
          </div>
        </div>

        {error   && <p className="text-red-400 text-sm mb-4">{error}</p>}
        {success && <p className="text-emerald-400 text-sm mb-4">✓ {success}</p>}

        <button
          onClick={handleCreate}
          disabled={creating}
          className="w-full bg-primary text-white py-4 rounded-xl font-semibold text-lg hover:bg-primary-dark transition disabled:opacity-50"
        >
          {creating ? "Creating…" : "✨ Create Folder"}
        </button>
      </div>
    </div>
  );
}
