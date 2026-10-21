import React, { useEffect, useState } from "react";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function AdminDashboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/admin/files`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (res.status === 403) throw new Error("You don't have admin access.");
        if (!res.ok) throw new Error("Failed to load admin data.");
        return res.json();
      })
      .then((result) => {
        if (Array.isArray(result)) {
          setData(result);
        } else {
          setError("Unexpected response from server.");
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h2 className="text-2xl font-bold mb-4 bg-gray-700">🛠 Admin Dashboard</h2>
      {loading ? (
        <p>Loading…</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : data.length === 0 ? (
        <p>No uploaded files found.</p>
      ) : (
        data.map((user, idx) => (
          <div key={idx} className="mb-6 bg-white p-4 rounded shadow">
            <h3 className="font-semibold text-lg mb-2">User ID: {user.userId}</h3>
            <table className="min-w-full border text-sm bg-black text-white">
              <thead>
                <tr className="bg-gray-800">
                  <th className="p-2 border">Filename</th>
                  <th className="p-2 border">CID</th>
                  <th className="p-2 border">Date</th>
                </tr>
              </thead>
              <tbody>
                {user.files && user.files.length > 0 ? (
                  user.files.map((f, i) => (
                    <tr key={i} className="bg-gray-700">
                      <td className="p-2 border">{f.fileName}</td>
                      <td className="p-2 border text-xs text-blue-600">{f.cid}</td>
                      <td className="p-2 border">{f.uploadedAt ? new Date(f.uploadedAt).toLocaleDateString() : "N/A"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center p-2 border">
                      No files found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ))
      )}
    </div>
  );
}

export default AdminDashboard;
