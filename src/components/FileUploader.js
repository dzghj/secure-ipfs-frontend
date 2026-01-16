import React, { useState } from "react";
import { motion } from "framer-motion";
import { uploadFileInChunks } from "../utils/resumableUpload";

export default function FileUploader({ token, user, onUploadComplete }) {
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
    setProgress(0);

    const onProgress = (percent) => setProgress(percent);

    try {
      const result = await uploadFileInChunks(
        file,
        token,
        user.id,
        onProgress
      );

      setStatus("Encrypting and registering...");

      // Simulate encryption + IPFS
      await new Promise((r) => setTimeout(r, 1000));

      const cid = "bafy" + Math.random().toString(36).substring(2, 10);

      setStatus("✅ Upload complete");
      setProgress(100);

      setUploadedFiles((prev) => [...prev, { filename: file.name, cid }]);

      // 🔔 Notify parent (MyFiles) to refresh list
      if (onUploadComplete) {
        onUploadComplete(result);
      }
    } catch (err) {
      console.error("Upload failed:", err);
      setStatus("❌ Upload failed");
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
        disabled={!file || progress > 0 && progress < 100}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-2 px-4 rounded-lg transition"
      >
        Upload
      </button>

      {/* Progress Bar */}
      {progress > 0 && (
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: "easeOut", duration: 0.5 }}
              className="bg-blue-500 h-3"
            />
          </div>
          <p className="text-sm mt-1 text-gray-600 text-center">
            {status}
          </p>
        </div>
      )}

      {/* Local Uploaded Files (optional UI) */}
      {uploadedFiles.length > 0 && (
        <div className="mt-6">
          <h3 className="text-md font-semibold mb-2 text-gray-700">
            Uploaded (this session)
          </h3>
          <ul className="space-y-2">
            {uploadedFiles.map((f, i) => (
              <li
                key={i}
                className="p-2 bg-gray-100 rounded-lg text-sm flex justify-between items-center"
              >
                <span>{f.filename}</span>
                <span className="text-gray-500 text-xs">
                  {f.cid.slice(0, 8)}...
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}