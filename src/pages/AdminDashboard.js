import React, { useEffect, useState } from "react";

function AdminDashboard() {
  const [data, setData] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("http://localhost:4000/api/admin/files", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(setData)
      .catch(err => console.error(err));
  }, [token]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h2 className="text-2xl font-bold mb-4">🛠 Admin Dashboard</h2>
      {data.length === 0 ? (
        <p>No uploaded files found.</p>
      ) : (
        data.map((user, idx) => (
          <div key={idx} className="mb-6 bg-white p-4 rounded shadow">
            <h3 className="font-semibold text-lg mb-2">User ID: {user.userId}</h3>
            <table className="min-w-full border text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border">Filename</th>
                  <th className="p-2 border">CID</th>
                  <th className="p-2 border">Date</th>
                </tr>
              </thead>
              <tbody>
                {user.files.map((f, i) => (
                  <tr key={i}>
                    <td className="p-2 border">{f.filename}</td>
                    <td className="p-2 border text-xs text-blue-600">{f.cid}</td>
                    <td className="p-2 border">
                      {new Date(f.timestamp * 1000).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      )}
    </div>
  );
}

export default AdminDashboard;
