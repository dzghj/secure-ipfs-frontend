import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

export default function SetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [email, setEmail] = useState("");

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  // Optional: verify token on load
  useEffect(() => {
    if (!token) return;
    const verifyToken = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/auth/verify-token/${token}`);
        setEmail(res.data.email);
      } catch (err) {
        setError(err.response?.data?.message || "Invalid or expired token");
      }
    };
    verifyToken();
  }, [token, API_BASE_URL]);

  // Password strength checker
  const isStrongPassword = (pwd) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#_])[A-Za-z\d@$!%*?&^#_]{8,}$/;
    return regex.test(pwd);
  };

  const handleSetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Check password strength
    if (!isStrongPassword(password)) {
      setError(
        "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character."
      );
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/set-password/${token}`, {
        password,
      });

      setSuccess("Password set successfully! Redirecting to My Files...");
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      setTimeout(() => navigate("/myfiles"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to set password");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) return;
    setResendLoading(true);
    setError("");
    try {
      await axios.post(`${API_BASE_URL}/api/auth/resend-verification`, { email });
      setSuccess("Verification email resent. Check your inbox!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend email");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <form
        onSubmit={handleSetPassword}
        className="w-full max-w-md bg-gray-800 border border-gray-700 rounded-xl p-8 shadow-lg space-y-5"
      >
        <h2 className="text-2xl font-bold text-center text-white">
          Set Your Password
        </h2>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        {success && <p className="text-green-400 text-sm text-center">{success}</p>}

        <div>
          <label className="block text-sm text-gray-400 mb-1">New Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:border-indigo-500"
            required
          />
          <p className="text-xs text-gray-400 mt-1">
            Minimum 8 chars, include uppercase, lowercase, number & special char
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-lg font-semibold transition ${
            loading ? "bg-gray-600 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {loading ? "Setting Password..." : "Set Password"}
        </button>

        <div className="text-center mt-2">
          <button
            type="button"
            disabled={resendLoading}
            onClick={handleResend}
            className={`text-sm text-indigo-400 hover:text-indigo-500 transition ${
              resendLoading ? "cursor-not-allowed opacity-60" : ""
            }`}
          >
            {resendLoading ? "Resending..." : "Resend Verification Email"}
          </button>
        </div>
      </form>
    </div>
  );
}