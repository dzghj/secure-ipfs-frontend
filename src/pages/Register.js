import React, { useState } from "react";
import axios from "axios";

export default function Register() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/auth/register`,
        { email }
      );

      setMessage(res.data.message || "Check your email to continue.");
      setEmail("");

    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <form
      onSubmit={handleRegister}
      className="
        w-full max-w-md
        bg-gray-800
        border border-gray-700
        rounded-xl
        p-8
        shadow-lg
        space-y-5
      "
    >
      <h2 className="text-2xl font-bold text-center">
        Create your account
      </h2>

      <p className="text-sm text-gray-400 text-center">
        Enter your email to get started.
      </p>

      <div>
        <label className="block text-sm text-gray-400 mb-1">
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="
            w-full px-3 py-2
            bg-gray-900
            border border-gray-700
            rounded-md
            focus:outline-none
            focus:border-indigo-500
          "
          required
        />
      </div>

      {error && (
        <p className="text-red-500 text-sm text-center">
          {error}
        </p>
      )}

      {message && (
        <p className="text-green-500 text-sm text-center">
          {message}
        </p>
      )}

      <button
        type="submit"
        className="
          w-full py-3
          bg-indigo-600
          hover:bg-indigo-700
          rounded-lg
          font-semibold
          transition
        "
      >
        Continue
      </button>
    </form>
  );
}