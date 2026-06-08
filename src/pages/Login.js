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
      className="w-full max-w-md bg-dark-card border border-dark-border rounded-xl p-8 shadow-lg space-y-5"
    >
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-white">Welcome Back</h2>
        <p className="text-gray-400 mt-2">Sign in to your SecureVault</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg focus:outline-none focus:border-primary text-white placeholder-gray-500"
          placeholder="your@email.com"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg focus:outline-none focus:border-primary text-white placeholder-gray-500"
          placeholder="••••••••"
          required
        />
      </div>

      {error && <p className="text-red-400 text-sm text-center bg-red-500 bg-opacity-10 border border-red-500 rounded-lg p-3">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-3 rounded-lg font-semibold transition text-lg ${
          loading ? "bg-gray-600 cursor-not-allowed" : "bg-primary hover:bg-primary-dark text-dark-bg"
        }`}
      >
        {loading ? "Signing in..." : "Sign In"}
      </button>

      <div className="text-center text-sm text-gray-400">
        <button
          type="button"
          onClick={() => navigate("/forgot-password")}
          className="hover:text-primary transition font-medium"
        >
          Forgot password?
        </button>
      </div>

      <div className="border-t border-dark-border pt-4 text-center text-sm text-gray-400">
        Don't have an account?{" "}
        <button
          type="button"
          onClick={() => navigate("/register")}
          className="text-primary hover:text-primary-dark transition font-medium"
        >
          Create one now
        </button>
      </div>
    </form>
  );
}