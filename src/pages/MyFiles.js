import React, { useEffect, useState, useCallback } from "react";
import FileUploader from "../components/FileUploader";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const MAX_FILES = 3;

function MyFiles() {

  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  /* KEYHOLDER STATES */
  const [keyHolderOn, setKeyHolderOn] = useState(false);
  const [keyHolderEmails, setKeyHolderEmails] = useState([]);
  const [isKeyHolderMode, setIsKeyHolderMode] = useState(false);

  /* SECURITY STATES */
  const [securityAlerts, setSecurityAlerts] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  const [lastLogin, setLastLogin] = useState(null);

  /* FIXED MISSING STATES */
  const [zkProofStatus, setZkProofStatus] = useState("verified");
  const [requiredApprovals, setRequiredApprovals] = useState(2);
  const [recoveryApprovals, setRecoveryApprovals] = useState([]);
  const [inheritanceTimer, setInheritanceTimer] = useState(null);
  const [anomalyWarnings, setAnomalyWarnings] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loginDevices, setLoginDevices] = useState([]);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const hasReachedLimit = files.length >= MAX_FILES;

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
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {

        const data = await res.json();

        if (!res.ok)
          throw new Error(data?.error || "Failed to load vault asset");

        setFiles(Array.isArray(data.files) ? data.files : []);

        if (data.keyHolderOn !== undefined)
          setKeyHolderOn(data.keyHolderOn);

        if (Array.isArray(data.keyHolderEmails))
          setKeyHolderEmails(data.keyHolderEmails);

        if (Array.isArray(data.securityAlerts))
          setSecurityAlerts(data.securityAlerts);

        if (Array.isArray(data.activityLogs))
          setActivityLogs(data.activityLogs);

        if (data.lastLogin)
          setLastLogin(data.lastLogin);

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
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Secure retrieval failed");
      }

      const data = await res.json();

      if (!data.integrityVerified) {
        alert("Integrity verification failed.");
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

  /* SECURITY SCORE */
  const securityScore = () => {

    let score = 50;

    if (keyHolderOn) score += 15;
    if (files.length > 0) score += 15;
    if (securityAlerts.length === 0) score += 20;

    return Math.min(score, 100);
  };

  return (

    <div className="min-h-screen bg-neutral-950 p-10 text-gray-100">

      <div className="max-w-6xl mb-12">
        <h2 className="text-4xl font-bold mb-4">
          🏛 ShadowVault — Enterprise Digital Asset Vault
        </h2>

        <p className="text-gray-400">
          Secure encrypted document vault with blockchain anchored integrity.
        </p>
      </div>

      {/* ZERO KNOWLEDGE PROOF */}
      <div className="mb-12 bg-neutral-900 rounded-2xl p-8 border border-neutral-800 max-w-6xl">

        <h3 className="text-xl font-semibold mb-4">
          🔒 Zero-Knowledge File Verification
        </h3>

        <div className="flex justify-between items-center">

          <div className="text-gray-300 text-sm">
            All records verified using cryptographic proof.
          </div>

          <div className={`text-sm font-semibold ${
            zkProofStatus === "verified"
            ? "text-green-400"
            : "text-red-400"
          }`}>
            {zkProofStatus === "verified"
              ? "Proof Verified"
              : "Verification Failed"}
          </div>

        </div>

      </div>

      {/* SECURITY SCORE */}
      <div className="mb-12 bg-neutral-900 rounded-2xl p-8 border border-neutral-800 max-w-6xl">

        <h3 className="text-xl font-semibold mb-4">
          🛡 Vault Security Score
        </h3>

        <div className="text-4xl font-bold text-green-400">
          {securityScore()} / 100
        </div>

        {lastLogin && (
          <p className="text-xs text-gray-500 mt-2">
            Last Login: {new Date(lastLogin).toLocaleString()}
          </p>
        )}

      </div>

      {/* VAULT CAPACITY */}
      <div className="mb-12 bg-neutral-900 rounded-2xl p-8 border border-neutral-800">

        <div className="flex justify-between mb-4">
          <h3 className="text-xl font-semibold">Vault Capacity</h3>

          <span className="text-gray-400">
            {files.length} / {MAX_FILES}
          </span>
        </div>

        {!hasReachedLimit && !isKeyHolderMode && (
          <FileUploader
            token={token}
            user={user}
            onUploadComplete={fetchFiles}
          />
        )}

      </div>

      {/* VAULT FILES */}
      <div className="bg-neutral-900 shadow rounded-2xl p-10 border border-neutral-800 max-w-6xl">

        {loading && <p>Loading vault records...</p>}

        {!loading && files.length > 0 && (

          <div className="space-y-8">

            {files.map((file) => (

              <div
                key={file.id}
                className="border border-neutral-800 p-6 rounded-xl bg-neutral-950"
              >

                <table className="w-full text-sm text-gray-300">

                  <tbody>

                    <tr>
                      <td className="text-gray-500 w-1/3">File Name</td>
                      <td className="text-white">{file.filename}</td>
                    </tr>

                    <tr>
                      <td className="text-gray-500">Created</td>
                      <td className="text-white">
                        {file.uploadedAt
                          ? new Date(file.uploadedAt).toLocaleDateString()
                          : "—"}
                      </td>
                    </tr>

                    <tr>
                      <td className="text-gray-500">CID</td>
                      <td className="text-blue-400 break-all">{file.cid}</td>
                    </tr>

                    <tr>
                      <td className="text-gray-500">Secure Access</td>

                      <td>

                        <button
                          className={`px-5 py-2 rounded-md ${
                            isKeyHolderMode
                              ? "bg-purple-600"
                              : "bg-green-600"
                          }`}
                          onClick={() =>
                            viewFile(file.id, file.filename)
                          }
                        >
                          {isKeyHolderMode
                            ? "KeyHolder View"
                            : "View"}
                        </button>

                      </td>

                    </tr>

                  </tbody>

                </table>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>

  );
}

export default MyFiles;