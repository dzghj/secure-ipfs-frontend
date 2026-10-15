import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  // Shown when /register 409s because this email already exists but hasn't
  // verified yet — the backend's own error message tells the user to
  // "resend verification", but there was previously no button that
  // actually did it.
  const [canResend, setCanResend] = useState(false);
  const [resending, setResending] = useState(false);
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
    setCanResend(false);
    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/register`, { email, phone });

      setMessage(res.data.message || "Check your email to continue.");
      setEmail("");
      setPhone("");
      setEmailSent(true);

    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
      // Matches auth.js's /register 409 — this email exists but never
      // verified, so a fresh link can actually be sent for it.
      if (err.response?.status === 409) setCanResend(true);
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!email) return;
    setResending(true);
    setError("");

    try {
      await axios.post(`${API_BASE_URL}/api/auth/resend-verification`, { email });
      setMessage("Verification email resent. Check your inbox!");
      setCanResend(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend verification email");
    } finally {
      setResending(false);
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
        <>
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
            <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg focus:outline-none focus:border-primary text-white placeholder-gray-500"
              placeholder="+14155551234"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Include your country code (e.g. +1 for US/Canada). Used to send a login verification code.
            </p>
          </div>
        </>
      )}

      {error && <p className="text-red-400 text-sm text-center bg-red-500 bg-opacity-10 border border-red-500 rounded-lg p-3">{error}</p>}
      {message && <p className="text-primary text-sm text-center bg-primary bg-opacity-10 border border-primary rounded-lg p-3">{message}</p>}

      {canResend && (
        <button
          type="button"
          onClick={handleResendVerification}
          disabled={resending}
          className="w-full py-3 rounded-lg font-semibold transition text-lg border-2 border-primary text-primary hover:bg-primary hover:text-dark-bg disabled:opacity-50"
        >
          {resending ? "Resending…" : "Resend Verification Email"}
        </button>
      )}

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