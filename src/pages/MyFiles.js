import React, { useEffect, useState, useCallback } from "react";
import FileUploader from "./FileUploader";

function MyFiles() {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user")); // adjust if needed

  const fetchFiles = useCallback(() => {
    if (!token) return;

    setLoading(true);
    setError("");

    fetch("https://secure-ipfs-server.onrender.com/api/myfiles", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.error || "Failed to load files");
        }

        if (Array.isArray(data)) {
          setFiles(data);
        } else if (Array.isArray(data.files)) {
          setFiles(data.files);
        } else {
          throw new Error("Invalid API response format");
        }
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setFiles([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [token]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  return (
    <div className="min-h-screen bg-neutral-900 p-6 text-gray-100">
      <h2 className="text-2xl font-bold mb-6">📄 My Files</h2>

      {/* 🔼 Upload Section */}
      <div className="mb-8">
        <FileUploader
          token={token}
          user={user}
          onUploadComplete={fetchFiles}
        />
      </div>

      {/* 📂 Files List */}
      <div className="bg-neutral-800 shadow-lg rounded-lg p-4">
        {loading && <p className="text-gray-400">Loading files...</p>}

        {error && (
          <p className="text-red-400 mb-3">
            ⚠️ {error}
          </p>
        )}

        {!loading && files.length === 0 && (
          <p className="text-gray-400">No files uploaded yet.</p>
        )}

        {files.length > 0 && (
          <table className="min-w-full border border-neutral-700">
            <thead>
              <tr className="bg-neutral-700 text-left">
                <th className="p-2 border border-neutral-600">Filename</th>
                <th className="p-2 border border-neutral-600">CID</th>
                <th className="p-2 border border-neutral-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {files.map((f, idx) => (
                <tr key={idx} className="hover:bg-neutral-700 transition">
                  <td className="p-2 border border-neutral-700">
                    {f.fileName || f.filename || "—"}
                  </td>
                  <td className="p-2 border border-neutral-700 text-xs text-blue-400">
                    {f.cid}
                  </td>
                  <td className="p-2 border border-neutral-700">
                    <a
                      href={`https://ipfs.io/ipfs/${f.cid}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-green-400 hover:underline"
                    >
                      View
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default MyFiles;
