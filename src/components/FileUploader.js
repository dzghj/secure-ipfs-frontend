
   import React, { useState } from "react";

   function FileUploader({ token, user, onUploadComplete }) {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
   
    const handleChange = (e) => {
     setFile(e.target.files[0]);
    };
   
    const handleUpload = async () => {
     if (!file) return alert("Please select a file");
   
     setUploading(true);
   
     try {
      const formData = new FormData();
      formData.append("file", file); // Multer handles file in backend
   
      const res = await fetch("https://ipfs-data-server.onrender.com/api/upload", {
       method: "POST",
       headers: {
        Authorization: `Bearer ${token}`,
       },
       body: formData,
      });
   
      if (!res.ok) {
       const data = await res.json();
       throw new Error(data?.message || "Upload failed");
      }
   
      const data = await res.json();
      console.log("✅ Uploaded file:", data);
   
      alert(`File uploaded successfully: ${file.name}`);
   
      // Clear selected file
      setFile(null);
   
      // Refresh file list
     // if (onUploadComplete) onUploadComplete(data.file);
     if (onUploadComplete) {
      setTimeout(() => {
        onUploadComplete();
      }, 0);
    }
     } catch (err) {
      console.error(err);
      alert("Upload error: " + err.message);
     } finally {
      setUploading(false);
     }
    };
   
    return (
     <div className="flex items-center gap-2">
      <input type="file" onChange={handleChange} />
      <button
       className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
       onClick={handleUpload}
       disabled={uploading || !file}
      >
       {uploading ? "Uploading..." : "Upload"}
      </button>
      {file && <span className="text-gray-300">{file.name}</span>}
     </div>
    );
   }
   
   export default FileUploader;