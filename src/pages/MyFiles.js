import React, { useEffect, useState, useCallback } from "react";
import FileUploader from "../components/FileUploader";

function MyFiles() {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

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
        `https://ipfs-data-server.onrender.com/api/file/${fileId}/view`,
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
          🏛 ShadowVault — Primary Legal Asset Vault
        </h2>

        <p className="text-gray-400 leading-relaxed text-sm max-w-3xl">
          ShadowVault is engineered to safeguard a single mission-critical legal document.
          This vault is purpose-built for high-value records such as:
          Legal Wills, Estate Directives, Power of Attorney, Foundational Corporate Agreements,
          or other legally binding instruments.
          <br /><br />
          All assets are encrypted at rest, access-controlled via secure token authentication,
          and cryptographically integrity-verified upon retrieval.
          This architecture aligns with modern digital security and compliance standards.
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

            <div className="border border-neutral-700 rounded-lg p-6 bg-neutral-900">

              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold">
                    {files[0].filename}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    Classified: Confidential Legal Instrument
                  </p>
                </div>

                <button
                  className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-md text-sm font-medium transition"
                  onClick={() =>
                    viewFile(files[0].id, files[0].filename)
                  }
                >
                  Secure Access
                </button>
              </div>

              <div className="grid grid-cols-2 gap-8 mt-8 text-sm">

                <div>
                  <p className="text-gray-500">Document Classification</p>
                  <p className="text-white font-medium">
                    Legal / Estate / High Sensitivity
                  </p>
                </div>

                <div>
                  <p className="text-gray-500">Uploaded Date</p>
                  <p className="text-white font-medium">
                    {files[0].createdAt
                      ? new Date(files[0].createdAt).toLocaleDateString()
                      : "—"}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500">Encryption Standard</p>
                  <p className="text-green-400 font-medium">
                    AES-256 Encryption (At Rest)
                  </p>
                </div>

                <div>
                  <p className="text-gray-500">Integrity Verification</p>
                  <p className="text-blue-400 font-medium">
                    Cryptographically Verified
                  </p>
                </div>

                <div>
                  <p className="text-gray-500">Integrity Reference (CID)</p>
                  <p className="text-xs text-blue-400 break-all">
                    {files[0].cid}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500">Access Control Model</p>
                  <p className="text-white font-medium">
                    Token-Based Zero-Trust Authorization
                  </p>
                </div>

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