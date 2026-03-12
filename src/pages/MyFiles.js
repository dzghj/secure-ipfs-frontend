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

  /* NEW SECURITY STATES */
  const [securityAlerts, setSecurityAlerts] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  const [lastLogin, setLastLogin] = useState(null);

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

        if (!res.ok)
          throw new Error(data?.error || "Failed to load vault asset");

        if (Array.isArray(data.files)) setFiles(data.files);
        else setFiles([]);

        if (data.keyHolderOn !== undefined)
          setKeyHolderOn(data.keyHolderOn);

        if (Array.isArray(data.keyHolderEmails))
          setKeyHolderEmails(data.keyHolderEmails);

        /* SECURITY DATA */
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

  /* SECURITY SCORE CALCULATION */
  const securityScore = () => {

    let score = 50;

    if (keyHolderOn) score += 15;
    if (files.length > 0) score += 15;
    if (securityAlerts.length === 0) score += 20;

    return Math.min(score, 100);
  };

  return (

    <div className="min-h-screen bg-neutral-950 p-10 text-gray-100">

      {/* HEADER */}
      <div className="max-w-6xl mb-12">
        <h2 className="text-4xl font-bold mb-4 tracking-tight">
          🏛 ShadowVault — Enterprise Digital Asset Vault
        </h2>

        <p className="text-gray-400 max-w-3xl">
          Secure encrypted document vault with blockchain anchored integrity.
        </p>
      </div>
      <div className="mb-12 bg-neutral-900 rounded-2xl p-8 border border-neutral-800 max-w-6xl">

<h3 className="text-xl font-semibold mb-4">
🔒 Zero-Knowledge File Verification
</h3>

<div className="flex justify-between items-center">

<div className="text-gray-300 text-sm">
All stored records verified via cryptographic proof without exposing file contents.
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

<div className="mb-12 bg-neutral-900 rounded-2xl p-8 border border-neutral-800 max-w-6xl">

<h3 className="text-xl font-semibold mb-4">
👥 Multi-Keyholder Recovery
</h3>

<p className="text-sm text-gray-400 mb-4">
Recovery requires {requiredApprovals} approvals from designated keyholders.
</p>

<div className="space-y-3">

{recoveryApprovals.map((k, i) => (

<div
key={i}
className="flex justify-between border border-neutral-800 bg-neutral-950 p-4 rounded-lg"
>

<div className="text-sm text-gray-300">
{k.email}
</div>

<div className={`text-sm ${
k.approved ? "text-green-400" : "text-yellow-400"
}`}>
{k.approved ? "Approved" : "Pending"}
</div>

</div>

))}

</div>

</div>

<div className="mb-12 bg-neutral-900 rounded-2xl p-8 border border-neutral-800 max-w-6xl">

<h3 className="text-xl font-semibold mb-4">
⏳ Inheritance Vault Timer
</h3>

{inheritanceTimer ? (

<div className="flex justify-between items-center">

<div className="text-gray-300">
Automatic executor access unlock
</div>

<div className="text-purple-400 text-lg font-semibold">
{inheritanceTimer} days remaining
</div>

</div>

) : (

<p className="text-gray-500 text-sm">
Timer inactive
</p>

)}

</div>


<div className="mb-12 bg-neutral-900 rounded-2xl p-8 border border-neutral-800 max-w-6xl">

<h3 className="text-xl font-semibold mb-4">
🤖 AI Security Monitoring
</h3>

{anomalyWarnings.length === 0 ? (

<p className="text-green-400 text-sm">
✔ No suspicious activity detected
</p>

) : (

<div className="space-y-3">

{anomalyWarnings.map((warn, i) => (

<div
key={i}
className="flex justify-between border border-yellow-700 bg-neutral-950 p-4 rounded-lg"
>

<div className="text-yellow-400 text-sm">
{warn.type}
</div>

<div className="text-xs text-gray-500">
{new Date(warn.date).toLocaleString()}
</div>

</div>

))}

</div>

)}

</div>

<div className="mb-12 bg-neutral-900 rounded-2xl p-8 border border-neutral-800 max-w-6xl">

<h3 className="text-xl font-semibold mb-4">
📜 Vault Activity Log
</h3>

{auditLogs.length === 0 ? (

<p className="text-gray-500 text-sm">
No activity recorded
</p>

) : (

<div className="space-y-3">

{auditLogs.map((log, i) => (

<div
key={i}
className="flex justify-between border border-neutral-800 p-4 rounded-lg bg-neutral-950"
>

<div className="text-sm text-gray-300">
{log.action}
</div>

<div className="text-xs text-gray-400">
{log.file}
</div>

<div className="text-xs text-gray-500">
{new Date(log.date).toLocaleString()}
</div>

</div>

))}

</div>

)}

</div>
<div className="mb-12 bg-neutral-900 rounded-2xl p-8 border border-neutral-800 max-w-6xl">

<h3 className="text-xl font-semibold mb-4">
🖥 Trusted Devices
</h3>

{loginDevices.length === 0 ? (

<p className="text-gray-500 text-sm">
No registered devices
</p>

) : (

<div className="space-y-3">

{loginDevices.map((device, i) => (

<div
key={i}
className="flex justify-between border border-neutral-800 p-4 rounded-lg bg-neutral-950"
>

<div className="text-sm text-gray-300">
{device.device}
</div>

<div className="text-xs text-gray-500">
{device.ip}
</div>

<div className="text-xs text-gray-500">
{new Date(device.lastSeen).toLocaleDateString()}
</div>

</div>

))}

</div>

)}

</div>







      {/* SECURITY SCORE PANEL */}

      <div className="mb-12 bg-neutral-900 rounded-2xl p-8 border border-neutral-800 max-w-6xl">

        <h3 className="text-xl font-semibold mb-4">
          🛡 Vault Security Score
        </h3>

        <div className="text-4xl font-bold text-green-400">
          {securityScore()} / 100
        </div>

        <p className="text-gray-400 text-sm mt-2">
          Security posture based on monitoring, redundancy, and vault activity.
        </p>

        {lastLogin && (
          <p className="text-xs text-gray-500 mt-2">
            Last Login: {new Date(lastLogin).toLocaleString()}
          </p>
        )}

      </div>

      {/* THREAT MONITORING */}

      <div className="mb-12 bg-neutral-900 rounded-2xl p-8 border border-neutral-800 max-w-6xl">

        <h3 className="text-xl font-semibold mb-4">
          🚨 Threat Monitoring
        </h3>

        {securityAlerts.length === 0 ? (
          <p className="text-green-400 text-sm">
            ✔ No security threats detected
          </p>
        ) : (

          <div className="space-y-3">

            {securityAlerts.map((alert, i) => (

              <div
                key={i}
                className="border border-red-800 bg-neutral-950 p-4 rounded-lg flex justify-between"
              >

                <span className="text-red-400 text-sm">
                  {alert.type}
                </span>

                <span className="text-gray-500 text-xs">
                  {new Date(alert.date).toLocaleString()}
                </span>

              </div>

            ))}

          </div>

        )}

      </div>

      {/* DEAD MAN SWITCH PANEL */}

      <div className="mb-12 bg-neutral-900 rounded-2xl p-8 border border-neutral-800">

        <h3 className="text-xl font-semibold mb-4">
          🔐 Dead-Man Switch Protection
        </h3>

        <div className="space-y-2 mb-4">

          {keyHolderEmails.length === 0 && (
            <p className="text-gray-500 text-sm">
              No keyholders configured
            </p>
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

      {/* VAULT CAPACITY */}

      <div className="mb-12 bg-neutral-900 rounded-2xl p-8 border border-neutral-800">

        <div className="flex justify-between mb-4">
          <h3 className="text-xl font-semibold">
            Vault Capacity
          </h3>

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

                  <tbody className="divide-y divide-neutral-800">

                    <tr>
                      <td className="px-4 py-3 text-gray-500 w-1/3">
                        File Name
                      </td>
                      <td className="px-4 py-3 text-white">
                        {file.filename}
                      </td>
                    </tr>

                    <tr>
                      <td className="px-4 py-3 text-gray-500">
                        Created
                      </td>
                      <td className="px-4 py-3 text-white">
                        {file.uploadedAt
                          ? new Date(file.uploadedAt).toLocaleDateString()
                          : "—"}
                      </td>
                    </tr>

                    <tr>
                      <td className="px-4 py-3 text-gray-500">
                        CID Reference
                      </td>
                      <td className="px-4 py-3 text-blue-400 break-all">
                        {file.cid}
                      </td>
                    </tr>

                    <tr>
                      <td className="px-4 py-3 text-gray-500">
                        Last Login
                      </td>
                      <td className="px-4 py-3 text-blue-400">
                        {lastLogin
                          ? new Date(lastLogin).toLocaleString()
                          : "—"}
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