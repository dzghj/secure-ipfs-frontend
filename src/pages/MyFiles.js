import React, { useEffect, useState, useCallback } from "react";
import FileUploader from "../components/FileUploader";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const MAX_FILES = 3;

function MyFiles() {

  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [keyHolderOn, setKeyHolderOn] = useState(false);
  const [isKeyHolderMode, setIsKeyHolderMode] = useState(false);

  const [securityAlerts, setSecurityAlerts] = useState([]);
  const [lastLogin, setLastLogin] = useState(null);

  const [aiMessage,setAiMessage] = useState("");

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

    fetch(`${API_BASE_URL}/api/myfiles`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {

        const data = await res.json();

        if (!res.ok)
          throw new Error(data?.error || "Failed to load vault files");

        setFiles(Array.isArray(data.files) ? data.files : []);

        if (data.keyHolderOn !== undefined)
          setKeyHolderOn(data.keyHolderOn);

        if (Array.isArray(data.securityAlerts))
          setSecurityAlerts(data.securityAlerts);

        if (data.lastLogin)
          setLastLogin(data.lastLogin);

      })
      .catch((err) => {
        console.error(err);
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
        throw new Error("Secure retrieval failed");
      }

      const data = await res.json();

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
      alert("Secure document access failed");
    }
  };

  const securityScore = () => {

    let score = 50;

    if (keyHolderOn) score += 20;
    if (files.length > 0) score += 15;
    if (securityAlerts.length === 0) score += 15;

    return Math.min(score, 100);
  };

  return (

    <div className="min-h-screen text-gray-100 bg-neutral-950">

      <div className="w-[90%] mx-auto py-16">

        {/* HEADER */}

        <div className="mb-10">
          <h1 className="text-4xl font-bold">ShadowVault</h1>
          <p className="text-neutral-400 mt-2">
            Secure encrypted digital asset vault
          </p>
        </div>

        {/* MAIN GRID */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* LEFT SIDE — FILES */}

          <div className="space-y-6">

            <h2 className="text-xl font-semibold">Vault Files</h2>

            {!hasReachedLimit && !isKeyHolderMode && (
              <FileUploader
                token={token}
                user={user}
                onUploadComplete={fetchFiles}
              />
            )}

            {loading && (
              <p className="text-neutral-400">Loading vault records...</p>
            )}

            {!loading && files.map((file) => (

              <div
                key={file.id}
                className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 flex justify-between"
              >

                {/* LEFT FILE INFO */}

                <div>

                  <div className="text-lg font-medium">
                    {file.filename}
                  </div>

                  <div className="text-sm text-neutral-400 mt-2">
                    {file.uploadedAt
                      ? new Date(file.uploadedAt).toLocaleDateString()
                      : "—"}
                  </div>

                  <div className="text-blue-400 text-xs mt-2 break-all">
                    {file.cid}
                  </div>

                </div>

                {/* RIGHT META DATA */}

                <div className="flex flex-col items-end justify-between">

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
                    {isKeyHolderMode ? "KeyHolder View" : "View"}
                  </button>

                </div>

              </div>

            ))}

          </div>

          {/* RIGHT SIDE DASHBOARD */}

          <div className="space-y-6">

            {/* AI ASSISTANT */}

            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">

              <h3 className="text-lg font-semibold mb-4">
                AI Assistant
              </h3>

              <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-4 mb-4 h-40 overflow-y-auto text-sm text-neutral-400">
                Ask about your vault security, files, or risks.
              </div>

              <input
                type="text"
                value={aiMessage}
                onChange={(e)=>setAiMessage(e.target.value)}
                placeholder="Ask the AI assistant..."
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 outline-none focus:border-neutral-600"
              />

            </div>

            {/* SECURITY SCORE */}

            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">

              <h3 className="text-sm text-neutral-400 mb-3">
                Vault Security Score
              </h3>

              <div className="text-4xl font-bold text-green-400">
                {securityScore()} / 100
              </div>

              <div className="mt-4 w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500"
                  style={{ width: `${securityScore()}%` }}
                />
              </div>

              {lastLogin && (
                <p className="text-xs text-neutral-500 mt-3">
                  Last login: {new Date(lastLogin).toLocaleString()}
                </p>
              )}

            </div>

            {/* KEYHOLDER */}

            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">

              <h3 className="text-sm text-neutral-400 mb-4">
                Keyholder Protection
              </h3>

              <button
                onClick={() => setKeyHolderOn(!keyHolderOn)}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  keyHolderOn
                    ? "bg-green-600"
                    : "bg-neutral-700"
                }`}
              >
                {keyHolderOn ? "Enabled" : "Disabled"}
              </button>

            </div>

            {/* THREAT MONITOR */}

            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">

              <h3 className="text-lg font-semibold mb-4">
                Threat Monitoring
              </h3>

              {securityAlerts.length === 0 ? (

                <p className="text-green-400 text-sm">
                  ✔ No threats detected
                </p>

              ) : (

                securityAlerts.map((alert, i) => (

                  <div
                    key={i}
                    className="flex justify-between bg-neutral-950 border border-red-900 rounded-lg p-3 mb-3"
                  >

                    <span className="text-red-400 text-sm">
                      {alert.type}
                    </span>

                    <span className="text-xs text-neutral-500">
                      {new Date(alert.date).toLocaleString()}
                    </span>

                  </div>

                ))

              )}

            </div>

          </div>

        </div>

      </div>

    </div>

  );
}

export default MyFiles;