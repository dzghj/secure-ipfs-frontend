import React, { useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login({ setToken, setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const loginCalledRef = useRef(false); // prevent double call in StrictMode

  const navigate = useNavigate();
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading || loginCalledRef.current) return; // prevent multiple calls
    setError("");
    setLoading(true);
    loginCalledRef.current = true;

    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/login`, { email, password });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      setToken(res.data.token);
      setUser(res.data.user);

      navigate("/"); // redirect to main/dashboard
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
      loginCalledRef.current = false;
    }
  };

  return (
    <form
      onSubmit={handleLogin}
      className="w-full max-w-md bg-gray-800 border border-gray-700 rounded-xl p-8 shadow-lg space-y-5"
    >
      <h2 className="text-2xl font-bold text-center text-white">
        Sign in to your vault
      </h2>

      <div>
        <label className="block text-sm text-gray-400 mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:border-indigo-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-1">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:border-indigo-500"
          required
        />
      </div>

      {error && <p className="text-red-500 text-sm text-center">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-3 rounded-lg font-semibold transition ${
          loading ? "bg-gray-600 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
        }`}
      >
        {loading ? "Logging in..." : "Login"}
      </button>

      <div className="text-center text-sm text-gray-400">
        <button
          type="button"
          onClick={() => navigate("/forgot-password")}
          className="hover:text-indigo-500 transition"
        >
          Forgot password?
        </button>
      </div>

      <div className="text-center text-sm text-gray-400">
        Don't have an account?{" "}
        <button
          type="button"
          onClick={() => navigate("/register")}
          className="text-indigo-400 hover:text-indigo-300 transition"
        >
          Register
        </button>
      </div>
    </form>
  );
}