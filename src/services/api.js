
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

/* ===== Nominees API ===== */

export const fetchNomineesAPI = async (token) => {
  const res = await fetch(`${API_BASE_URL}/api/nominees`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch nominees");
  return data.nominees;
};

export const createNomineeAPI = async (token, nominee) => {
  const res = await fetch(`${API_BASE_URL}/api/nominees`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(nominee),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to create nominee");
  return data.nominee;
};

export const updateNomineeAPI = async (token, id, updates) => {
  const res = await fetch(`${API_BASE_URL}/api/nominees/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updates),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to update nominee");
  return data.nominee;
};

export const deleteNomineeAPI = async (token, id) => {
  const res = await fetch(`${API_BASE_URL}/api/nominees/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to delete nominee");
  return data;
};


/* ===== Check-in Interval API ===== */

export const fetchCheckinIntervalAPI = async (token) => {
  const res = await fetch(`${API_BASE_URL}/api/checkin/interval`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch check-in interval");
  return data;
};

export const saveCheckinIntervalAPI = async (token, interval) => {
  const res = await fetch(`${API_BASE_URL}/api/checkin/interval`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ interval }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to save check-in interval");
  return data;
};
