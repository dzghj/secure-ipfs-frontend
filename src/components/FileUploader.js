import React, { useState } from "react";
import { motion } from "framer-motion";

export default function FileUploader({ token, user }) {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleUpload = async () => {
    if (!file) {
      alert("Select a file first!");
      return;
    }

    setStatus("Uploading...");
    setProgress(10);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("https://ipfs-data-server.onrender.com/api/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Upload failed");
      }

      setProgress(70);
      setStatus("Encrypting & saving to IPFS...");

      const data = await res.json();

      setProgress(100);
      setStatus("✅ Upload complete");

      setUploadedFiles((prev) => [
        ...prev,
        {
          filename: data.file.filename,
          cid: data.file.cid,
        },
      ]);

      setFile(null);
    } catch (err) {
      console.error(err);
      setStatus("❌ Upload failed");
      setProgress(0);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-2xl shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 text-center">
        Secure PDF Upload
      </h2>

      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files[0])}
        className="block w-full mb-3 text-sm text-gray-700"
      />

      <button
        onClick={handleUpload}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition"
      >
        Upload
      </button>

      {progress > 0 && (
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: "easeOut", duration: 0.4 }}
              className="bg-blue-500 h-3"
            />
          </div>
          <p className="text-sm mt-1 text-gray-600 text-center">
            {status}
          </p>
        </div>
      )}

      {uploadedFiles.length > 0 && (
        <div className="mt-6">
          <h3 className="text-md font-semibold mb-2 text-gray-700">
            Uploaded Files
          </h3>
          <ul className="space-y-2">
            {uploadedFiles.map((f, i) => (
              <li
                key={i}
                className="p-2 bg-gray-100 rounded-lg text-sm flex justify-between items-center"
              >
                <span>{f.filename}</span>
                <a
                  href={`https://ipfs.io/ipfs/${f.cid}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {f.cid.slice(0, 10)}…
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
