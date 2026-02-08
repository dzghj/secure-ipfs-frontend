import React, { useState } from "react";
import axios from "axios";

export default function Register({ setToken, setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/auth/register`,
        { email, password }
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      setToken(res.data.token);
      setUser(res.data.user);
    } catch (err) {
      setError(err.response?.data?.message || "Register failed");
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

      <div>
        <label className="block text-sm text-gray-400 mb-1">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
        Register
      </button>
    </form>
  );
}
