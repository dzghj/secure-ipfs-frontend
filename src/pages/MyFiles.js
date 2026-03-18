import React, { useEffect, useState, useCallback } from "react";
import FileUploader from "../components/FileUploader";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const MAX_FILES = 3;



function MyFiles() {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  /* NEW KEYHOLDER STATES */
  const [keyHolderOn, setKeyHolderOn] = useState(false);
  const [keyHolderEmails, setKeyHolderEmails] = useState([]);
  const [isKeyHolderMode, setIsKeyHolderMode] = useState(false);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const hasReachedLimit = files.length >= MAX_FILES;

  /* Detect keyholder login */
  useEffect(() => {
    if (user?.role === "keyholder") {
      setIsKeyHolderMode(true);
    }
  }, [user]);

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

        /* Load keyholder settings if backend provides them */
        if (data.keyHolderOn !== undefined) {
          setKeyHolderOn(data.keyHolderOn);
        }

        if (Array.isArray(data.keyHolderEmails)) {
          setKeyHolderEmails(data.keyHolderEmails);
        }

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

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Secure retrieval failed");
      }

      const data = await res.json();

      if (!data.integrityVerified) {
        alert("Integrity verification failed. Please contact support.");
        return;
      }

      const byteCharacters = atob(data.data);
      const byteNumbers = new Array(byteCharacters.length);

      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: data.mimeType });

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.target = "_blank";
      a.download = data.filename || filename;
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
    <div className="min-h-screen bg-neutral-950 p-10 text-gray-100">

      {/* Header */}
      <div className="max-w-6xl mb-12 text-center">
        <h2 className="text-4xl font-bold mb-4 tracking-tight">
          🏛 ShadowVault — Enterprise Digital Asset Vault
        </h2>

        <p className="text-gray-400 max-w-3xl leading-relaxed">
          Secure, encrypted, and blockchain-verified storage for your most critical
          legal and ownership documents.
        </p>
      </div>

      {/* KEYHOLDER EXECUTOR BANNER */}
      {isKeyHolderMode && (
        <div className="mb-8 p-4 bg-purple-900 border border-purple-700 rounded-lg text-center">
          <p className="text-sm text-purple-200">
            Executor access mode enabled. You may download vault records but cannot modify data.
          </p>
        </div>
      )}

      {/* KEYHOLDER SETTINGS PANEL */}
      <div className="mb-12 bg-neutral-900 rounded-2xl p-8 border border-neutral-800 text-center">

        <h3 className="text-xl font-semibold mb-4">
          🔐 Dead-Man Switch Protection
        </h3>

        <p className="text-gray-400 text-sm mb-6">
          If enabled, ShadowVault monitors account inactivity.
          After 30 days a reminder email is sent.
          After 40 days your designated KeyHolder(s) receive recovery access.
        </p>

        <div className="space-y-2 mb-4">
          {keyHolderEmails.length === 0 && (
            <p className="text-gray-500 text-sm">No keyholders configured</p>
          )}

          {keyHolderEmails.map((email, i) => (
            <div key={i} className="text-sm text-gray-300">
              KeyHolder {i + 1}: {email}
            </div>
          ))}
        </div>

        <button
          onClick={() => setKeyHolderOn(!keyHolderOn)}
          className={`px-4 py-2 rounded-md ${
            keyHolderOn ? "bg-green-600" : "bg-neutral-700"
          }`}
        >
          {keyHolderOn ? "Enabled" : "Disabled"}
        </button>

      </div>

      {/* Vault Capacity Section */}
      <div className="mb-12 text-center bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-2xl p-8 shadow-2xl border border-neutral-800">

        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-xl font-semibold text-white">
              Vault Capacity
            </h3>
            <p className="text-sm text-gray-400 mt-1">
              Enterprise tier supports up to {MAX_FILES} immutable records.
            </p>
          </div>
          <div className="text-sm text-gray-300">
            {files.length} / {MAX_FILES}
          </div>
        </div>

        {!isKeyHolderMode && hasReachedLimit &&(
          <FileUploader
            token={token}
            user={user}
            onUploadComplete={fetchFiles}
          />
        )}

      </div>

      {/* Vault Records */}
      <div className="bg-neutral-900 shadow-2xl rounded-2xl p-10 max-w-6xl border border-neutral-800">

        {loading && (
          <p className="text-gray-400">Loading protected assets...</p>
        )}

        {error && (
          <p className="text-red-400 mb-4">⚠ {error}</p>
        )}

        {!loading && files.length > 0 && (
          <div className="space-y-10">
            {files.map((file) => (
              <div
                key={file.id}
                className="border border-neutral-800 rounded-xl p-6 bg-neutral-950"
              >
                <div className="overflow-hidden rounded-lg border border-neutral-800">
                  <table className="w-1/2 text-sm text-left text-gray-300">
                    <tbody className="divide-y divide-neutral-800">

                      <tr>
                        <td className="px-4 py-3 text-gray-500 w-1/3">
                          File Name
                        </td>
                        <td className="px-4 py-3 font-medium text-white">
                          {file.filename}
                        </td>
                      </tr>

                      <tr>
                        <td className="px-4 py-3 text-gray-500">
                          Created
                        </td>
                        <td className="px-4 py-3 font-medium text-white">
                          {file.uploadedAt
                            ? new Date(file.uploadedAt).toLocaleDateString()
                            : "—"}
                        </td>
                      </tr>

                      <tr>
                        <td className="px-4 py-3 text-gray-500">
                          Integrity Status
                        </td>
                        <td className="px-4 py-3 text-blue-400 font-medium">
                          Blockchain Anchored & Verified
                        </td>
                      </tr>

                      <tr>
                        <td className="px-4 py-3 text-gray-500 align-top">
                          CID Reference
                        </td>
                        <td className="px-4 py-3 text-xs text-blue-400 break-all">
                          {file.cid}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-gray-500">
                          Secure Access
                        </td>
                        <td className="px-4 py-3">
                          <button
                            className={`px-5 py-2 rounded-md text-sm font-medium ${
                              isKeyHolderMode
                                ? "bg-purple-600 hover:bg-purple-700"
                                : "bg-green-600 hover:bg-green-700"
                            }`}
                            onClick={() => viewFile(file.id, file.filename)}
                          >
                            {isKeyHolderMode ? "KeyHolder View" : "View"}
                          </button>
                        </td>
                      </tr>

                    </tbody>
                  </table>
                </div>
              </div>
            ))}
             <p className="text-xs text-gray-500 leading-relaxed border-t border-neutral-800 pt-6">
              ⚠ Once a record is stored and cryptographically anchored to the blockchain,
              it cannot be removed, altered, or overwritten. ShadowVault preserves
              the original immutable reference to maintain evidentiary integrity
              and legal authenticity.
            </p>
          </div>
        )}
      </div>
       {/* Request Access Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-neutral-900 border border-neutral-700 rounded-2xl p-8 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-semibold text-white mb-3">
              Request Extended Vault Access
            </h3>

            <p className="text-sm text-gray-400 mb-6">
              Your vault currently supports {MAX_FILES} immutable records.
              Upgrade your enterprise plan to expand capacity.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="text-gray-400 hover:text-white"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  setShowUpgradeModal(false);
                  window.location.href = "/upgrade";
                }}
                className="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded-lg font-medium text-black transition"
              >
                Upgrade Now
              </button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
}

export default MyFiles;
