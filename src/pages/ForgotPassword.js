import React, { useState } from "react";
import axios from "axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/forgot-password`, { email });
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || "Error sending email");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg">
      <h2 className="text-2xl mb-4">Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          className="border p-2 w-full mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded w-full">Send Reset Link</button>
      </form>
      {message && <p className="mt-3 text-sm text-gray-700">{message}</p>}
    </div>
  );
}
