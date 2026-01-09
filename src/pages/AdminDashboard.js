import React, { useEffect, useState } from "react";

function AdminDashboard() {
  const [data, setData] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("https://secure-ipfs-server.onrender.com/api/admin/files", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result); // Debug log to check the fetched data structure
        if (Array.isArray(result)) {
          setData(result);
        } else {
          console.error("Expected an array but got:", result);
        }
      })
      .catch((err) => console.error("Error fetching data:", err));
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
            <table className="min-w-full border text-sm bg-black text-white">
              <thead>
                <tr className="bg-gray-800">
                  <th className="p-2 border">Filename</th>
                  <th className="p-2 border">CID</th>
                  <th className="p-2 border">Date</th>
                </tr>
              </thead>
              <tbody>
                {/* Ensure you correctly access fileName and cid */}
                {user.files && user.files.length > 0 ? (
                  user.files.map((f, i) => (
                    <tr key={i} className="bg-gray-700">
                      <td className="p-2 border">{f.fileName}</td>
                      <td className="p-2 border text-xs text-blue-600">{f.cid}</td>
                      <td className="p-2 border">{"N/A"}</td> {/* You can replace "N/A" with actual date if available */}
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
