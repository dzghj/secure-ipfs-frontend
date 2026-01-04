import React, { useEffect, useState } from "react";

function MyFiles() {
  const [files, setFiles] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("http://secure-ipfs-server.onrender.com/api/myfiles", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(setFiles)
      .catch(err => console.error("Error:", err));
  }, [token]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h2 className="text-2xl font-bold mb-4">📄 My Uploaded Files</h2>
      <div className="bg-white shadow rounded-lg p-4">
        {files.length === 0 ? (
          <p className="text-gray-500">No files uploaded yet.</p>
        ) : (
          <table className="min-w-full border">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2 border">Filename</th>
                <th className="p-2 border">CID</th>
                <th className="p-2 border">Date</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {files.map((f, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="p-2 border">{f.filename}</td>
                  <td className="p-2 border text-xs text-blue-600">{f.cid}</td>
                  <td className="p-2 border">
                    {new Date(f.timestamp * 1000).toLocaleString()}
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
