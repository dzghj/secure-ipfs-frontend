import React from "react";
import FolderCard from "./FolderCard";

export const FOLDER_TYPES = [
  { id: "personal", label: "Personal", color: "#9b87f5" },
  { id: "finance",  label: "Finance",  color: "#4a7fd4" },
  { id: "work",     label: "Work",     color: "#2eaaa0" },
  { id: "family",   label: "Family",   color: "#7e78d2" },
  { id: "photos",   label: "Photos",   color: "#3fa89e" },
  { id: "videos",   label: "Videos",   color: "#7e9c4a" },
  { id: "medical",  label: "Medical",  color: "#e07b6a" },
  { id: "legal",    label: "Legal",    color: "#c47fc0" },
  { id: "other",    label: "Other",    color: "#a0a0a0" },
];

export default function FolderGrid({ files, categories, onFolderClick }) {
  const displayCategories = categories.length > 0 ? categories : ["Personal"];

  return (
    <div className="grid grid-cols-3 gap-4">
      {displayCategories.map((cat, i) => {
        const ft =
          FOLDER_TYPES.find(
            (f) => f.label.toLowerCase() === cat.toLowerCase()
          ) || FOLDER_TYPES[i % FOLDER_TYPES.length];

        const count = files.filter(
          (f) => (f.category || "Personal") === cat
        ).length;

        return (
          <FolderCard
            key={cat}
            folder={ft}
            fileCount={count}
            onClick={() => onFolderClick(cat)}
          />
        );
      })}
    </div>
  );
}
