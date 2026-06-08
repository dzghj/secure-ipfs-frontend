import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const navigate = useNavigate();

  // Automatically redirect after 3 seconds when emailSent
  useEffect(() => {
    if (emailSent) {
      const timer = setTimeout(() => navigate("/login"), 3000);
      return () => clearTimeout(timer); // cleanup
    }
  }, [emailSent, navigate]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/register`, { email });

      setMessage(res.data.message || "Check your email to continue.");
      setEmail("");
      setEmailSent(true);

    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleRegister}
      className="w-full max-w-md bg-dark-card border border-dark-border rounded-xl p-8 shadow-lg space-y-5"
    >
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-white">Create Your Vault</h2>
        <p className="text-gray-400 mt-2">Secure your important documents today</p>
      </div>

      {!emailSent && (
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
      )}

      {error && <p className="text-red-400 text-sm text-center bg-red-500 bg-opacity-10 border border-red-500 rounded-lg p-3">{error}</p>}
      {message && <p className="text-primary text-sm text-center bg-primary bg-opacity-10 border border-primary rounded-lg p-3">{message}</p>}

      {!emailSent ? (
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-lg font-semibold transition text-lg ${
            loading ? "bg-gray-600 cursor-not-allowed" : "bg-primary hover:bg-primary-dark text-dark-bg"
          }`}
        >
          {loading ? "Sending..." : "Get Started"}
        </button>
      ) : (
        <button
          type="button"
          onClick={() => navigate("/login")}
          className="w-full py-3 bg-primary hover:bg-primary-dark text-dark-bg rounded-lg font-semibold transition text-lg"
        >
          Go to Login
        </button>
      )}

      <div className="border-t border-dark-border pt-4 text-center text-sm text-gray-400">
        Already have an account?{" "}
        <button
          type="button"
          onClick={() => navigate("/login")}
          className="text-primary hover:text-primary-dark transition font-medium"
        >
          Sign in here
        </button>
      </div>
    </form>
  );
}