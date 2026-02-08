import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;


  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/auth/reset-password`,
        {
          token,
          newPassword: password,
        }
      );

      setMessage(res.data.message || "Password reset successful");

      // redirect to login after short delay
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Reset failed");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md bg-gray-800 border border-gray-700 rounded-xl p-8 shadow-lg space-y-5"
    >
      <h2 className="text-2xl font-bold text-center">
        Reset your password
      </h2>

      <div>
        <label className="block text-sm text-gray-400 mb-1">
          New Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter new password"
          className="w-full px-3 py-2 bg-gray-900 text-gray-100 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />
      </div>

      {error && (
        <p className="text-red-500 text-sm text-center">{error}</p>
      )}

      {message && (
        <p className="text-green-400 text-sm text-center">{message}</p>
      )}

      <button
        type="submit"
        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-semibold transition"
      >
        Reset Password
      </button>

      <div className="text-center text-sm text-gray-400">
        <button
          type="button"
          onClick={() => navigate("/login")}
          className="hover:text-indigo-500 transition"
        >
          Back to login
        </button>
      </div>
    </form>
  );
}
