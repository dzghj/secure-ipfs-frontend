import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/auth/forgot-password`,
        { email }
      );
      setMessage(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Error sending reset email");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md bg-gray-800 border border-gray-700 rounded-xl p-8 space-y-5"
    >
      <h2 className="text-2xl font-bold text-center">Forgot your password?</h2>

      <p className="text-sm text-gray-400 text-center">
        Enter your email and we’ll send you a reset link.
      </p>

      <input
        type="email"
        placeholder="Email address"
        className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:border-indigo-500"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      {message && <p className="text-green-400 text-sm text-center">{message}</p>}
      {error && <p className="text-red-400 text-sm text-center">{error}</p>}

      <button
        type="submit"
        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-semibold transition"
      >
        Send Reset Link
      </button>

      <div className="text-center text-sm text-gray-400">
        <button
          type="button"
          onClick={() => navigate("/login")}
          className="text-indigo-400 hover:text-indigo-300 transition"
        >
          Back to Login
        </button>
      </div>
    </form>
  );
}