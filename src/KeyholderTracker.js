import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("https://ipfs-data-server.onrender.com:5000");

export default function KeyholderTracker() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    socket.on("fileViewed", (data) => {
      setLogs((prev) => [data, ...prev]);
    });
  }, []);

  return (
    <div>
      <h3>Real-Time Keyholder Access</h3>
      <ul>
        {logs.map((log, idx) => (
          <li key={idx}>
            {log.keyholderEmail} viewed file {log.fileId} at {new Date(log.viewedAt).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}
