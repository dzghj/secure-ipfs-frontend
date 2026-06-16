import React, { useState } from "react";
import { FolderSvg } from "./FolderCard";
import { FOLDER_TYPES } from "./FolderGrid";

export default function AddFolderPage() {
  const [categoryName, setCategoryName] = useState("Personal");
  const [description,  setDescription]  = useState("");
  const [selected,     setSelected]     = useState("personal");

  const handleCreate = () => {
    // TODO: wire up to API
    alert(`Folder "${categoryName}" created!`);
  };

  return (
    <div className="w-full px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1">Add New Folder</h1>
        <p className="text-gray-400 text-sm">Organise your vault with custom categories.</p>
      </div>

      <div className="max-w-2xl">
        <div className="mb-6">
          <label className="text-sm text-gray-400 mb-2 block font-medium">
            Category Name
          </label>
          <input
            className="w-full bg-dark-card border border-dark-border rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-primary transition"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="e.g. Personal, Medical, Legal..."
          />
        </div>

        <div className="mb-8">
          <label className="text-sm text-gray-400 mb-2 block font-medium">
            Description
          </label>
          <input
            className="w-full bg-dark-card border border-dark-border rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-primary transition"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter description"
          />
        </div>

        <div className="mb-8">
          <label className="text-sm text-gray-400 mb-3 block font-medium">
            Select Folder Colour
          </label>
          <div className="grid grid-cols-3 gap-3">
            {FOLDER_TYPES.map((ft) => (
              <button
                key={ft.id}
                onClick={() => {
                  setSelected(ft.id);
                  setCategoryName(ft.label);
                }}
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

        <button
          onClick={handleCreate}
          className="w-full bg-primary text-white py-4 rounded-xl font-semibold text-lg hover:bg-primary-dark transition"
        >
          ✨ Create Folder
        </button>
      </div>
    </div>
  );
}
