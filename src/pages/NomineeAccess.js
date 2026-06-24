import React, { useEffect, useState } from "react";
import { fetchNomineeAccess, downloadNomineeAccessFile } from "../services/api";

function FileRow({ file, onDownload }) {
  return (
    <div className="flex items-center justify-between p-3 border-b border-dark-border">
      <div>
        <div className="font-semibold">{file.filename}</div>
        <div className="text-xs text-gray-400">{new Date(file.uploadedAt).toLocaleString()}</div>
      </div>
      <div>
        <button
          onClick={() => onDownload(file)}
          className="px-3 py-2 bg-primary rounded-md text-white text-sm"
        >
          Download
        </button>
      </div>
    </div>
  );
}

export default function NomineeAccess() {
  const [token, setToken] = useState("");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get("token");
    if (!t) {
      setError("No access token provided in URL.");
      setLoading(false);
      return;
    }
    setToken(t);
    (async () => {
      try {
        const files = await fetchNomineeAccess(t);
        setFiles(files || []);
      } catch (err) {
        setError(err.message || "Failed to load files");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleDownload = async (file) => {
    try {
      const blob = await downloadNomineeAccessFile(token, file.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.filename || "download";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert(err.message || "Download failed");
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-400">{error}</div>;

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Temporary Access</h1>
      <p className="text-sm text-gray-400 mb-6">You have temporary access to the following files.</p>
      {files.length === 0 ? (
        <div className="p-6 bg-dark-card rounded-xl text-gray-400">No files available.</div>
      ) : (
        <div className="bg-dark-card rounded-xl overflow-hidden">
          {files.map(f => (
            <FileRow key={f.id} file={f} onDownload={handleDownload} />
          ))}
        </div>
      )}
    </div>
  );
}
