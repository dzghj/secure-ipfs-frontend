import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CHANNEL_LABEL = {
  sms: { icon: "📱", text: "Text me a code" },
  email: { icon: "📧", text: "Email me a code" },
};

export default function Login({ setToken, setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const loginCalledRef = useRef(false); // prevent double call in StrictMode

  // "credentials" -> "channel" (only if >1 option) -> "otp"
  const [stage, setStage] = useState("credentials");
  const [pendingToken, setPendingToken] = useState(null);
  const [availableChannels, setAvailableChannels] = useState([]);
  const [otp, setOtp] = useState(null); // { channel, maskedDestination, expiresInSeconds } | null
  const [code, setCode] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(0);

  const navigate = useNavigate();
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  // Countdown shown next to the code input so users know when it expires.
  useEffect(() => {
    if (stage !== "otp" || secondsLeft <= 0) return;
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [stage, secondsLeft]);

  const sendOtp = async (channel, token) => {
    const res = await axios.post(`${API_BASE_URL}/api/auth/login/send-otp`, {
      pendingToken: token || pendingToken,
      channel,
    });
    setOtp(res.data);
    setSecondsLeft(res.data.expiresInSeconds || 120);
    setCode("");
    setStage("otp");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading || loginCalledRef.current) return; // prevent multiple calls
    setError("");
    setLoading(true);
    loginCalledRef.current = true;

    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/login`, { email, password });

      if (!res.data.passwordValid) {
        setError("Unexpected response from server.");
        return;
      }

      const channels = res.data.availableChannels || [];
      setPendingToken(res.data.pendingToken);
      setAvailableChannels(channels);

      if (channels.length <= 1) {
        // Only one way to receive a code — skip the redundant choice screen.
        await sendOtp(channels[0] || "email", res.data.pendingToken);
      } else {
        setStage("channel");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
      loginCalledRef.current = false;
    }
  };

  const handleChooseChannel = async (channel) => {
    setError("");
    setLoading(true);
    try {
      await sendOtp(channel);
    } catch (err) {
      setError(err.response?.data?.message || `Couldn't send a code via ${channel}`);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (loading) return;
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/login/verify-otp`, {
        pendingToken,
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

  const handleResend = () => handleChooseChannel(otp.channel);

  const handleBackToCredentials = () => {
    setStage("credentials");
    setOtp(null);
    setCode("");
    setError("");
  };

  const handleBackToChannel = () => {
    setStage("channel");
    setOtp(null);
    setCode("");
    setError("");
  };

  if (stage === "channel") {
    return (
      <div className="w-full max-w-md bg-dark-card border border-dark-border rounded-xl p-8 shadow-lg space-y-5">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-white">Verify It's You</h2>
          <p className="text-gray-400 mt-2">How would you like to receive your code?</p>
        </div>

        <div className="space-y-3">
          {availableChannels.map((ch) => (
            <button
              key={ch}
              type="button"
              onClick={() => handleChooseChannel(ch)}
              disabled={loading}
              className="w-full py-3 rounded-lg font-semibold transition text-lg bg-dark-bg border border-dark-border hover:border-primary text-white disabled:opacity-50"
            >
              {CHANNEL_LABEL[ch]?.icon || "🔑"} {CHANNEL_LABEL[ch]?.text || ch}
            </button>
          ))}
        </div>

        {error && <p className="text-red-400 text-sm text-center bg-red-500 bg-opacity-10 border border-red-500 rounded-lg p-3">{error}</p>}

        <button type="button" onClick={handleBackToCredentials} className="text-sm text-gray-400 hover:text-primary transition font-medium">
          ← Back
        </button>
      </div>
    );
  }

  if (stage === "otp") {
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
          <button
            type="button"
            onClick={availableChannels.length > 1 ? handleBackToChannel : handleBackToCredentials}
            className="hover:text-primary transition font-medium"
          >
            ← Back
          </button>
          <button type="button" onClick={handleResend} disabled={loading} className="hover:text-primary transition font-medium disabled:opacity-50">
            Resend code
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
