import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login({ setToken, setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const loginCalledRef = useRef(false); // prevent double call in StrictMode

  // ── Step 2: OTP challenge ──────────────────────────────────────────────
  const [otp, setOtp] = useState(null); // { pendingToken, channel, maskedDestination, expiresInSeconds } | null
  const [code, setCode] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [resending, setResending] = useState(false);

  const navigate = useNavigate();
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  // Countdown shown next to the code input so users know when it expires.
  useEffect(() => {
    if (!otp || secondsLeft <= 0) return;
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [otp, secondsLeft]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading || loginCalledRef.current) return; // prevent multiple calls
    setError("");
    setLoading(true);
    loginCalledRef.current = true;

    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/login`, { email, password });

      if (res.data.otpRequired) {
        setOtp(res.data);
        setSecondsLeft(res.data.expiresInSeconds || 120);
      } else {
        // Shouldn't happen against this backend, but don't strand the user if it does.
        setError("Unexpected response from server.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
      loginCalledRef.current = false;
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (loading) return;
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/login/verify-otp`, {
        pendingToken: otp.pendingToken,
        code,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      setToken(res.data.token);
      setUser(res.data.user);

      navigate("/"); // redirect to main/dashboard
    } catch (err) {
      setError(err.response?.data?.message || "Incorrect code");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resending) return;
    setError("");
    setResending(true);

    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/login/resend-otp`, {
        pendingToken: otp.pendingToken,
      });
      setOtp(res.data);
      setSecondsLeft(res.data.expiresInSeconds || 120);
      setCode("");
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't resend code — please log in again");
      setOtp(null);
    } finally {
      setResending(false);
    }
  };

  const handleBack = () => {
    setOtp(null);
    setCode("");
    setError("");
  };

  if (otp) {
    return (
      <form
        onSubmit={handleVerifyOtp}
        className="w-full max-w-md bg-dark-card border border-dark-border rounded-xl p-8 shadow-lg space-y-5"
      >
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-white">Verify It's You</h2>
          <p className="text-gray-400 mt-2">
            We sent a code via {otp.channel === "sms" ? "SMS" : "email"} to{" "}
            <span className="text-gray-300">{otp.maskedDestination}</span>
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Verification Code</label>
          <input
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg focus:outline-none focus:border-primary text-white placeholder-gray-500 text-center text-2xl tracking-[0.5em]"
            placeholder="000000"
            required
          />
          <p className="text-xs text-gray-500 mt-2 text-center">
            {secondsLeft > 0
              ? `Expires in ${Math.floor(secondsLeft / 60)}:${String(secondsLeft % 60).padStart(2, "0")}`
              : "Code expired — request a new one"}
          </p>
        </div>

        {error && <p className="text-red-400 text-sm text-center bg-red-500 bg-opacity-10 border border-red-500 rounded-lg p-3">{error}</p>}

        <button
          type="submit"
          disabled={loading || code.length !== 6}
          className={`w-full py-3 rounded-lg font-semibold transition text-lg ${
            loading || code.length !== 6 ? "bg-gray-600 cursor-not-allowed" : "bg-primary hover:bg-primary-dark text-dark-bg"
          }`}
        >
          {loading ? "Verifying..." : "Verify & Sign In"}
        </button>

        <div className="flex items-center justify-between text-sm text-gray-400">
          <button type="button" onClick={handleBack} className="hover:text-primary transition font-medium">
            ← Back
          </button>
          <button
            type="button"
            onClick={handleResend}
            disabled={resending}
            className="hover:text-primary transition font-medium disabled:opacity-50"
          >
            {resending ? "Sending..." : "Resend code"}
          </button>
        </div>
      </form>
    );
  }

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
