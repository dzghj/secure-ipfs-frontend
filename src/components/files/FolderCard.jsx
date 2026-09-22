import React from "react";

function FolderSvg({ color, size = 44 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 44 44" fill="none">
      <path
        d="M4 12a3 3 0 0 1 3-3h9l3 4h17a3 3 0 0 1 3 3v16a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V12z"
        fill={color}
        opacity="0.75"
      />
      <path d="M4 18h36v14a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V18z" fill={color} />
    </svg>
  );
}

const FALLBACK_T = { file: "file", files: "files", full: "Full", partial: "Partial", nominee: "nominee", nominees: "nominees" };

export default function FolderCard({ folder, fileCount, onClick, nominees = [], t = FALLBACK_T }) {
  // Show up to 3 nominee avatars, then a "+N more" counter
  const shown = nominees.slice(0, 3);
  const extra = nominees.length - shown.length;

  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center bg-dark-bg border border-dark-border rounded-xl p-4 hover:border-primary transition cursor-pointer w-full"
    >
      <FolderSvg color={folder.color} size={40} />
      <span className="text-xs text-gray-300 mt-2 font-medium">{folder.label}</span>
      <span className="text-xs text-gray-500 mt-0.5">
        {fileCount} {fileCount !== 1 ? t.files : t.file}
      </span>

      {/* Nominee access indicator */}
      {nominees.length > 0 && (
        <div className="flex items-center gap-1 mt-2">
          {/* Stacked avatars */}
          <div className="flex -space-x-1">
            {shown.map((n) => (
              <div
                key={n.id}
                title={`${n.name} (${n.accessLevel === "full" ? t.full : t.partial})`}
                className="w-5 h-5 rounded-full bg-primary border border-dark-bg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
              >
                {n.name[0].toUpperCase()}
              </div>
            ))}
            {extra > 0 && (
              <div className="w-5 h-5 rounded-full bg-dark-border border border-dark-bg flex items-center justify-center text-gray-400 text-xs font-bold flex-shrink-0">
                +{extra}
              </div>
            )}
          </div>
          <span className="text-xs text-gray-500 ml-1">
            {nominees.length === 1 ? `1 ${t.nominee}` : `${nominees.length} ${t.nominees}`}
          </span>
        </div>
      )}
    </button>
  );
}

export { FolderSvg };
