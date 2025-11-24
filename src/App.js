import React, { useState } from "react";
import { uploadEncryptedPDF } from "./utils/upload";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import MyFiles from "./pages/MyFiles";
import AdminDashboard from "./pages/AdminDashboard";
import { uploadFileInChunks } from "./utils/resumableUpload";


function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    const res = await fetch("http://localhost:4000/api/login", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    localStorage.setItem("token", data.token);
    setToken(data.token);
  };

  const handleUpload = async () => {
    if (!file) return alert("Select a file first!");
    setStatus("Uploading in chunks...");
    const user = JSON.parse(atob(token.split(".")[1]));
    const result = await uploadFileInChunks(file, token, user.id);
    setStatus("Encrypting and registering...");
    
    // Upload encrypted file to IPFS
    const encryptedBlob = await encryptFile(file);
    const cid = await client.put([new File([encryptedBlob], file.name)], { wrapWithDirectory: false });
  
    await fetch("http://localhost:4000/api/registerCID", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ cid, filename: file.name }),
    });
  
    setStatus(`✅ File uploaded & registered (CID: ${cid})`);
  };
  

  if (!token)
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <form onSubmit={handleLogin} className="p-6 bg-white rounded-lg shadow-lg space-y-3">
          <h2 className="text-xl font-semibold">Login</h2>
          <input name="email" placeholder="Email" className="border p-2 w-full" required />
          <input name="password" type="password" placeholder="Password" className="border p-2 w-full" required />
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">Login</button>
        </form>
      </div>
    );

    return (
      <Router>
        <nav className="p-3 bg-gray-800 text-white flex gap-4">
          <Link to="/">Upload</Link>
          <Link to="/myfiles">My Files</Link>
          <Link to="/admin">Admin</Link>
        </nav>
        <Routes>
          <Route path="/" element={<UploadPage />} />
          <Route path="/myfiles" element={<MyFiles />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </Router>
    );
  
};

export default App;
