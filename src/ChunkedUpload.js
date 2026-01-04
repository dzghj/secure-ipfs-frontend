import { useState } from "react";
import { Upload } from "tus-js-client";

export default function ChunkedUpload({ onComplete }) {
  const [progress, setProgress] = useState(0);

  const handleUpload = (file) => {
    const upload = new Upload(file, {
      endpoint: "https://secure-ipfs-server.onrender.com/api/upload/tus",
      chunkSize: 5 * 1024 * 1024, // 5MB
      retryDelays: [0, 1000, 3000, 5000],
      onError: (err) => console.error("Upload failed:", err),
      onProgress: (bytesUploaded, bytesTotal) => {
        setProgress(Math.floor((bytesUploaded / bytesTotal) * 100));
      },
      onSuccess: () => {
        console.log("Upload finished:", upload.url);
        onComplete(upload.url);
      },
    });
    upload.start();
  };

  return (
    <div>
      <input type="file" onChange={(e) => handleUpload(e.target.files[0])} />
      <div>Progress: {progress}%</div>
    </div>
  );
}
