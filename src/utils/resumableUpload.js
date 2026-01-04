const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB

export async function uploadFileInChunks(file, token, userId, onProgress) {
  const uploadId = Date.now().toString();
  const totalChunks = Math.ceil(file.size / CHUNK_SIZE);

  for (let i = 0; i < totalChunks; i++) {
    const start = i * CHUNK_SIZE;
    const end = Math.min(file.size, start + CHUNK_SIZE);
    const chunk = file.slice(start, end);

    const formData = new FormData();
    formData.append("chunk", chunk);
    formData.append("uploadId", uploadId);
    formData.append("chunkIndex", i);

    await fetch("https://secure-ipfs-server.onrender.com/api/upload/chunk", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    const percent = Math.round(((i + 1) / totalChunks) * 100);
    if (onProgress) onProgress(percent);
  }

  const res = await fetch("https://secure-ipfs-server.onrender.com/api/upload/merge", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      uploadId,
      totalChunks,
      filename: file.name,
      userId,
    }),
  });

  return res.json();
}
