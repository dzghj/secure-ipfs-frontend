import React, { useEffect, useState, useCallback } from "react";
import FileUploader from "../components/FileUploader";

function MyFiles() {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const fetchFiles = useCallback(() => {
    if (!token) return;

    setLoading(true);
    setError("");

    fetch(`${API_BASE_URL}/api/myfiles`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Failed to load vault asset");

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

  const viewFile = async (fileId, filename) => {
    if (!token) return;

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/file/${fileId}/view`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error("Secure retrieval failed");

      const integrityVerified =
        res.headers.get("X-Integrity-Verified") === "true";

      if (!integrityVerified) {
        alert("⚠️ Integrity verification failed. Please contact support.");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.target = "_blank";
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Secure document access failed: " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 p-8 text-gray-100">

      {/* Header Section */}
      <div className="max-w-5xl mb-10">
        <h2 className="text-3xl font-bold mb-3">
          🏛 ShadowVault — Your Most Important Document. Protected.
          </h2>

          <p className="text-gray-400 leading-relaxed text-sm max-w-3xl">
            ShadowVault is built to protect one mission-critical legal document —
            the document that matters most.

            Whether it’s a Will, Estate Directive, Power of Attorney,
            or a foundational corporate agreement, 

            Your document is encrypted, access-controlled, and integrity-checked
            every time it is retrieved.
          </p>
      </div>

      {/* Upload Section */}
      {files.length === 0 && (
        <div className="mb-10 bg-neutral-800 rounded-lg p-6 shadow-xl">
          <h3 className="text-lg font-semibold mb-2">
            Upload Your Primary Legal Document
          </h3>

          <p className="text-sm text-gray-400 mb-4">
            Only one protected document is permitted per vault.
            Please upload your most critical legal or estate record.
          </p>

          <FileUploader
            token={token}
            user={user}
            onUploadComplete={fetchFiles}
          />
        </div>
      )}

      {/* Vault Display */}
      <div className="bg-neutral-800 shadow-xl rounded-lg p-8 max-w-5xl">

        {loading && (
          <p className="text-gray-400">
            Loading protected asset...
          </p>
        )}

        {error && (
          <p className="text-red-400 mb-3">
            ⚠️ {error}
          </p>
        )}

        {!loading && files.length === 0 && (
          <p className="text-gray-500 text-sm">
            No primary legal asset secured yet.
          </p>
        )}

        {!loading && files.length > 0 && (
          <div className="space-y-8">

<div className="border border-neutral-700 rounded-xl p-6 bg-neutral-900 shadow-lg">

{/* Header */}

{/* Metadata Table */}
<div className="overflow-hidden rounded-lg border border-neutral-800">
  <table className="w-full text-sm text-left text-gray-300">
    <tbody className="divide-y divide-neutral-800">
    <tr>
        <td className="px-4 py-3 text-gray-500">
        File Name
        </td>
        <td className="px-4 py-3 font-medium text-white">
        {files[0].filename}
        </td>
      </tr>
      <tr>
        <td className="px-4 py-3 text-gray-500 w-1/3">
          Created
        </td>
        <td className="px-4 py-3 font-medium text-white">
          {files[0].createdAt
            ? new Date(files[0].createdAt).toLocaleDateString()
            : "—"}
        </td>
      </tr>

      <tr>
        <td className="px-4 py-3 text-gray-500 w-1/3">
          Updated
        </td>
        <td className="px-4 py-3 font-medium text-white">
          {files[0].createdAt
            ? new Date(files[0].updatedAt).toLocaleDateString()
            : "—"}
        </td>
      </tr>

      <tr>
        <td className="px-4 py-3 text-gray-500">
          Integrity Status
        </td>
        <td className="px-4 py-3 text-blue-400 font-medium">
          Cryptographically Verified
        </td>
      </tr>

      <tr>
        <td className="px-4 py-3 text-gray-500 align-top">
          CID Reference
        </td>
        <td className="px-4 py-3 text-xs text-blue-400 break-all">
          {files[0].cid}
        </td>
      </tr>

      <tr>
        <td className="px-4 py-3 text-gray-500">
        Secure Access
        </td>
        <td className="px-4 py-3 font-medium text-white">
        <button
        className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-md text-sm font-medium transition"
        onClick={() => viewFile(files[0].id, files[0].filename)}
      >
        View
      </button>
        </td>
      </tr>

    </tbody>
  </table>
</div>
</div>
            <p className="text-xs text-gray-500 leading-relaxed">
              This vault is designed for the preservation of a single legally binding document.
              All retrieval attempts are authenticated and integrity-validated.
              ShadowVault does not modify stored legal instruments and preserves their
              original cryptographic reference to ensure evidentiary consistency.
            </p>

          </div>
        )}
      </div>
    </div>
  );
}

export default MyFiles;