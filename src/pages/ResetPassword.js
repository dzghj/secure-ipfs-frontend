import React, { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/reset-password`, {
        token,
        newPassword: password,
      });
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || "Reset failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg">
      <h2 className="text-2xl mb-4">Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Enter new password"
          className="border p-2 w-full mb-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="bg-green-600 text-white px-4 py-2 rounded w-full">Reset Password</button>
      </form>
      {message && <p className="mt-3 text-sm text-gray-700">{message}</p>}
    </div>
  );
}
