import React, { useEffect, useState } from "react";

function MyFiles() {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
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

  if (loading) {
    return <p className="p-6 text-gray-400">Loading files...</p>;
  }

  return (
    <div className="min-h-screen bg-neutral-900 p-6 text-gray-100">
      <h2 className="text-2xl font-bold mb-4">📄 My Uploaded Files</h2>

      <div className="bg-neutral-800 shadow-lg rounded-lg p-4">
        {error && (
          <p className="text-red-400 mb-3">
            ⚠️ {error}
          </p>
        )}

        {files.length === 0 ? (
          <p className="text-gray-400">No files uploaded yet.</p>
        ) : (
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
                <tr
                  key={idx}
                  className="hover:bg-neutral-700 transition"
                >
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
