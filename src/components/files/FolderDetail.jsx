import React, { useRef, useState } from "react";
import FileList from "./FileList";
import { FOLDER_TYPES } from "./FolderGrid";
import { FolderSvg } from "./FolderCard";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export default function FolderDetail({ category, files, token, onBack, onUploadComplete, nominees = [] }) {
  const ft =
    FOLDER_TYPES.find(
      (f) => f.label.toLowerCase() === category.toLowerCase()
    ) || FOLDER_TYPES[0];

  const categoryFiles = files.filter(
    (f) => (f.category || "Personal") === category
  );

  // ── Upload state ─────────────────────────────────────────────────────────
  const [showUpload,  setShowUpload]  = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading,   setUploading]   = useState(false);
  const [progress,    setProgress]    = useState(0);
  const [uploadDone,  setUploadDone]  = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef();

  const resetUpload = () => {
    setSelectedFile(null);
    setProgress(0);
    setUploadDone(false);
    setUploadError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (f) {
      setSelectedFile(f);
      setUploadDone(false);
      setUploadError("");
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    setProgress(0);
    setUploadError("");

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("category", category);

      // Simulate progress while waiting (fetch doesn't expose real upload progress)
      const interval = setInterval(() => {
        setProgress((p) => (p < 85 ? p + 5 : p));
      }, 200);

      const res = await fetch(`${API_BASE_URL}/api/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      clearInterval(interval);

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || data?.error || "Upload failed");
      }

      setProgress(100);
      setUploadDone(true);
      resetUpload();

      // Refresh file list in parent
      if (onUploadComplete) onUploadComplete();

      // Auto-close panel after success
      setTimeout(() => {
        setUploadDone(false);
        setShowUpload(false);
      }, 2000);
    } catch (err) {
      setUploadError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="px-8 py-10 flex flex-col min-h-full">
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
      {categoryFiles.length === 0 && !showUpload ? (
        <div className="text-center py-16 bg-dark-card border border-dark-border rounded-2xl mb-6">
          <div className="text-5xl mb-3">📂</div>
          <p className="text-gray-400 text-sm">No files in this folder yet.</p>
        </div>
      ) : (
        <div className="mb-6">
          <FileList files={categoryFiles} token={token} nominees={nominees} />
        </div>
      )}

      {/* ── Upload panel (shown when Add Content is clicked) ── */}
      {showUpload && (
        <div className="bg-dark-card border border-dark-border rounded-2xl p-6 mb-4 transition-all">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-semibold text-white">Add File to "{category}"</h3>
            <button
              onClick={() => { setShowUpload(false); resetUpload(); }}
              className="text-gray-500 hover:text-white transition text-lg leading-none"
              aria-label="Close upload panel"
            >
              ✕
            </button>
          </div>

          {/* Drop / select area */}
          <label
            htmlFor="folder-file-input"
            className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-dark-border rounded-xl py-10 cursor-pointer hover:border-primary transition mb-4"
          >
            <div className="text-4xl">📁</div>
            <p className="text-sm text-gray-400">
              {selectedFile ? selectedFile.name : "Click to select a file"}
            </p>
            {selectedFile && (
              <p className="text-xs text-gray-500">
                {(selectedFile.size / 1024).toFixed(1)} KB
              </p>
            )}
            <input
              id="folder-file-input"
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileChange}
              disabled={uploading}
            />
          </label>

          {/* Progress bar */}
          {uploading && (
            <div className="mb-4">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Uploading…</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-dark-bg rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Success */}
          {uploadDone && (
            <div className="flex items-center gap-2 text-emerald-400 text-sm mb-4">
              <span>✓</span> File uploaded successfully!
            </div>
          )}

          {/* Error */}
          {uploadError && (
            <div className="text-red-400 text-sm mb-4">{uploadError}</div>
          )}

          <button
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
            className="w-full py-3 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary-dark transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {uploading ? `Uploading… ${progress}%` : "Upload File"}
          </button>
        </div>
      )}

      {/* ── Add Content bar ── */}
      <button
        onClick={() => { setShowUpload((v) => !v); if (showUpload) resetUpload(); }}
        className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl border-2 border-dashed border-primary/40 hover:border-primary bg-primary/5 hover:bg-primary/10 text-primary font-semibold text-sm transition mt-auto"
      >
        <span className="text-lg">＋</span>
        Add Content
      </button>
    </div>
  );
}
