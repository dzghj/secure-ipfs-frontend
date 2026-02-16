import React, { useEffect, useState, useCallback } from "react";
import FileUploader from "../components/FileUploader";

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
 
   fetch("https://ipfs-data-server.onrender.com/api/myfiles", {
    headers: {
     Authorization: `Bearer ${token}`,
    },
   })
    .then(async (res) => {
     const data = await res.json();
 
     if (!res.ok) throw new Error(data?.error || "Failed to load files");
 
     if (Array.isArray(data.files)) setFiles(data.files);
     else setFiles([]);
    })
    .catch((err) => {
     console.error(err);
     setError(err.message);
     setFiles([]);
    })
    .finally(() => setLoading(false));
  }, [token]);
 
  useEffect(() => {
   fetchFiles();
  }, [fetchFiles]);
 
  // 🔹 New function to view/decrypt file via backend
  const viewFile = async (fileId, filename) => {
   if (!token) return;
   try {
    const res = await fetch(
     `https://ipfs-data-server.onrender.com/api/file/${fileId}/view`,
     {
      headers: { Authorization: `Bearer ${token}` },
     }
    );
 
    if (!res.ok) throw new Error("Failed to fetch file");

      // 🔹 Check integrity header
      const integrityVerified = res.headers.get("X-Integrity-Verified") === "true";
      if (!integrityVerified) {
        alert("⚠️ Warning: File integrity could not be verified!");
      }
      
 
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
 
    // Open in new tab
    const a = document.createElement("a");
    a.href = url;
    a.target = "_blank";
    a.download = filename; // filename preserved
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
   } catch (err) {
    console.error(err);
    alert("Failed to view file: " + err.message);
   }
  };
 
  return (
   <div className="min-h-screen bg-neutral-900 p-6 text-gray-100">
    <h2 className="text-2xl font-bold mb-6">📄 My Files</h2>
 
    {/* Upload Section */}
    <div className="mb-8">
     <FileUploader token={token} user={user} onUploadComplete={fetchFiles} />
    </div>
 
    {/* Files List */}
    <div className="bg-neutral-800 shadow-lg rounded-lg p-4">
     {loading && <p className="text-gray-400">Loading files...</p>}
     {error && <p className="text-red-400 mb-3">⚠️ {error}</p>}
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
        {files.map((f) => (
         <tr key={f.id} className="hover:bg-neutral-700 transition">
          <td className="p-2 border border-neutral-700">{f.filename}</td>
          <td className="p-2 border border-neutral-700 text-xs text-blue-400">{f.cid}</td>
          <td className="p-2 border border-neutral-700">
           <button
            className="text-green-400 hover:underline"
            onClick={() => viewFile(f.id, f.filename)}
           >
            View
           </button>
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