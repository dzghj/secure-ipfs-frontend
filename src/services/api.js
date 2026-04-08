
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const fetchFilesAPI = async (token) => {
  const res = await fetch(`${API_BASE_URL}/api/myfiles`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to fetch");

  return data;
};

export const askAIAPI = async (token, message) => {
  const res = await fetch(`${API_BASE_URL}/api/ai/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ message }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "AI failed");

  return data.response;
};

export const updateKeyholdersAPI = async (token, fileId, list) => {
  await fetch(`${API_BASE_URL}/api/file/${fileId}/keyholders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ keyHolderList: list }),
  });
};

