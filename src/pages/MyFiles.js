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

        // ✅ ensure array
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
    return <p className="p-6 text-gray-500">Loading files...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h2 className="text-2xl font-bold mb-4">📄 My Uploaded Files</h2>

      <div className="bg-white shadow rounded-lg p-4">
        {error && (
          <p className="text-red-500 mb-3">
            ⚠️ {error}
          </p>
        )}

        {files.length === 0 ? (
          <p className="text-gray-500">No files uploaded yet.</p>
        ) : (
          <table className="min-w-full border">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2 border">Filename</th>
                <th className="p-2 border">CID</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {files.map((f, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="p-2 border">
                    {f.fileName || f.filename || "—"}
                  </td>
                  <td className="p-2 border text-xs text-blue-600">
                    {f.cid}
                  </td>
                  <td className="p-2 border">
                    <a
                      href={`https://ipfs.io/ipfs/${f.cid}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-green-600 hover:underline"
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
