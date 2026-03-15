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

    <div className="min-h-screen bg-neutral-950 text-gray-100">

      <div className="max-w-7xl mx-auto px-8 py-12">

        {/* HEADER */}

        <div className="mb-12">

          <h1 className="text-4xl font-bold tracking-tight">
            ShadowVault
          </h1>

          <p className="text-neutral-400 mt-2">
            Secure encrypted digital asset vault
          </p>

        </div>

        {/* DASHBOARD GRID */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">

          {/* SECURITY SCORE */}

          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">

            <h3 className="text-sm text-neutral-400 mb-3">
              Vault Security Score
            </h3>

            <div className="text-4xl font-bold text-green-400">
              {securityScore()} / 100
            </div>

            {lastLogin && (
              <p className="text-xs text-neutral-500 mt-2">
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
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                keyHolderOn
                  ? "bg-green-600 hover:bg-green-500"
                  : "bg-neutral-700 hover:bg-neutral-600"
              }`}
            >
              {keyHolderOn ? "Enabled" : "Disabled"}
            </button>

          </div>

          {/* VAULT CAPACITY */}

          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">

            <div className="flex justify-between items-center mb-4">

              <h3 className="text-sm text-neutral-400">
                Vault Capacity
              </h3>

              <span className="text-sm text-neutral-500">
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

        </div>

        {/* THREAT MONITOR */}

        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-8 mb-12">

          <h3 className="text-lg font-semibold mb-6">
            Threat Monitoring
          </h3>

          {securityAlerts.length === 0 ? (

            <p className="text-green-400 text-sm">
              No threats detected
            </p>

          ) : (

            <div className="space-y-3">

              {securityAlerts.map((alert, i) => (

                <div
                  key={i}
                  className="flex justify-between items-center bg-neutral-950 border border-red-900 rounded-lg p-4"
                >

                  <span className="text-red-400 text-sm">
                    {alert.type}
                  </span>

                  <span className="text-xs text-neutral-500">
                    {new Date(alert.date).toLocaleString()}
                  </span>

                </div>

              ))}

            </div>

          )}

        </div>

        {/* FILES */}

        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-8">

          <h3 className="text-lg font-semibold mb-6">
            Vault Records
          </h3>

          {loading && (
            <p className="text-neutral-400">
              Loading vault records...
            </p>
          )}

          {!loading && files.length > 0 && (

            <div className="space-y-6">

              {files.map((file) => (

                <div
                  key={file.id}
                  className="bg-neutral-950 border border-neutral-800 rounded-lg p-6"
                >

                  <table className="w-full text-sm">

                    <tbody className="divide-y divide-neutral-800">

                      <tr>
                        <td className="py-3 text-neutral-500 w-1/3">
                          File Name
                        </td>
                        <td className="text-white">
                          {file.filename}
                        </td>
                      </tr>

                      <tr>
                        <td className="py-3 text-neutral-500">
                          Created
                        </td>
                        <td>
                          {file.uploadedAt
                            ? new Date(file.uploadedAt).toLocaleDateString()
                            : "—"}
                        </td>
                      </tr>

                      <tr>
                        <td className="py-3 text-neutral-500">
                          CID
                        </td>
                        <td className="text-blue-400 break-all">
                          {file.cid}
                        </td>
                      </tr>

                      <tr>
                        <td className="py-3 text-neutral-500">
                          Access
                        </td>
                        <td>

                          <button
                            className={`px-5 py-2 rounded-md text-sm font-medium transition ${
                              isKeyHolderMode
                                ? "bg-purple-600 hover:bg-purple-500"
                                : "bg-green-600 hover:bg-green-500"
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

    </div>

  );
}

export default MyFiles;