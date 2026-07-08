import React, { useEffect, useState } from "react";
import { fetchNomineeAccess, downloadNomineeAccessFile } from "../services/api";

export default function NomineeAccess() {
  const [token,    setToken]    = useState("");
  const [files,    setFiles]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");
  const [downloading, setDownloading] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get("token");
    if (!t) {
      setError("No access token found in this link. Please use the link sent to your email.");
      setLoading(false);
      return;
    }
    setToken(t);
    (async () => {
      try {
        const result = await fetchNomineeAccess(t);
        setFiles(result || []);
      } catch (err) {
        setError(err.message || "This link may have expired or is invalid.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleDownload = async (file) => {
    setDownloading(file.id);
    try {
      const blob = await downloadNomineeAccessFile(token, file.id);
      const url  = window.URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href     = url;
      a.download = file.filename || "download";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert(err.message || "Download failed. Please try again.");
    } finally {
      setDownloading(null);
    }
  };

  // ── Loading ───────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-pulse">⛓️</div>
          <p className="text-gray-400 text-sm">Verifying your access link…</p>
        </div>
      </div>
    );
  }

  // ── Error ─────────────────────────────────────────────────
  if (error) {
    return (
      <div className="min-h-screen bg-dark-bg text-white flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <div className="text-5xl mb-6">🔒</div>
          <h1 className="text-2xl font-bold mb-3 text-red-400">Access Unavailable</h1>
          <p className="text-gray-400 text-sm leading-relaxed mb-6">{error}</p>
          <div className="bg-dark-card border border-dark-border rounded-xl p-5 text-left text-sm text-gray-400 space-y-2">
            <p className="font-semibold text-white mb-2">What to do next:</p>
            <p>• Check that you used the full link from your email — it may have been cut off.</p>
            <p>• Links expire after 14 days for security. Ask the vault owner to resend access.</p>
            <p>• If you believe this is an error, contact the person who shared this vault with you.</p>
          </div>
        </div>
      </div>
    );
  }

  // ── Success ───────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-dark-bg text-white">

      {/* Minimal header — logo links to homepage */}
      <header className="flex items-center gap-3 px-8 py-5 border-b border-dark-border bg-dark-bg">
        <a
          href="https://shadowvault.ca"
          className="flex items-center gap-3 hover:opacity-80 transition"
        >
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-lg">
            ⛓️
          </div>
          <span className="text-lg font-bold text-primary">LegacyChain</span>
        </a>
        <span className="ml-2 text-xs text-gray-500 border border-dark-border rounded-full px-3 py-1">
          Nominee Access
        </span>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-12">

        {/* What is this page — first-time explanation */}
        <div className="bg-primary bg-opacity-10 border border-primary border-opacity-30 rounded-2xl p-6 mb-8">
          <h2 className="text-lg font-bold mb-2 flex items-center gap-2">
            <span>👋</span> You've been granted vault access
          </h2>
          <p className="text-sm text-gray-300 leading-relaxed mb-4">
            Someone has designated you as a trusted nominee on LegacyChain — a secure platform
            for storing wills and legal documents on the blockchain. You now have temporary
            access to the files they chose to share with you.
          </p>
          <div className="space-y-2 text-sm text-gray-400">
            <div className="flex gap-2"><span className="text-primary flex-shrink-0">✓</span> This link is personal and unique to you — do not share it.</div>
            <div className="flex gap-2"><span className="text-primary flex-shrink-0">✓</span> Files are encrypted and only accessible via this link.</div>
            <div className="flex gap-2"><span className="text-primary flex-shrink-0">✓</span> Your access is time-limited. Download the files you need.</div>
          </div>
        </div>

        {/* File list */}
        <div>
          <h3 className="text-xl font-bold mb-1">Shared Files</h3>
          <p className="text-sm text-gray-400 mb-5">
            {files.length} file{files.length !== 1 ? "s" : ""} have been shared with you.
            Click Download to save each one.
          </p>

          {files.length === 0 ? (
            <div className="bg-dark-card border border-dark-border rounded-xl p-8 text-center">
              <div className="text-4xl mb-3">📂</div>
              <p className="text-gray-400 text-sm">No files are available for this access link.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {files.map((f) => (
                <div
                  key={f.id}
                  className="flex items-center gap-4 bg-dark-card border border-dark-border rounded-xl px-5 py-4 hover:border-primary transition"
                >
                  <div className="text-2xl flex-shrink-0">📄</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{f.filename}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Uploaded {new Date(f.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDownload(f)}
                    disabled={downloading === f.id}
                    className="flex-shrink-0 px-4 py-2 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary-dark transition disabled:opacity-50"
                  >
                    {downloading === f.id ? "Downloading…" : "Download"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom actions */}
        {files.length > 0 && (
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <a
              href="https://shadowvault.ca"
              className="flex-1 py-3 border border-dark-border text-gray-400 font-semibold rounded-xl hover:border-primary hover:text-white transition flex items-center justify-center gap-2"
            >
              ⛓️ Learn About LegacyChain
            </a>
          </div>
        )}

        {/* Footer note */}
        <div className="mt-10 text-center text-xs text-gray-600">
          This is a secure, time-limited access page generated by LegacyChain. <br />
          Files are protected with AES-256 encryption and blockchain verification.
        </div>
      </main>

      {/* Footer — matches main site */}
      <footer className="py-8 border-t border-dark-border bg-dark-bg mt-10">
        <div className="max-w-6xl mx-auto px-8 grid grid-cols-2 md:grid-cols-5 gap-4 text-center md:text-left text-sm text-gray-400 mb-6">
          <div className="flex items-center justify-center md:justify-start gap-2"><span>🔐</span> AES-256 Encryption</div>
          <div className="flex items-center justify-center md:justify-start gap-2"><span>🔑</span> Zero Knowledge</div>
          <div className="flex items-center justify-center md:justify-start gap-2"><span>✓</span> PIPEDA Compliant</div>
          <div className="flex items-center justify-center md:justify-start gap-2"><span>🌐</span> Data Privacy</div>
          <div className="flex items-center justify-center md:justify-start gap-2"><span>📞</span> 24/7 Support</div>
        </div>
        <div className="text-center text-gray-500 text-xs border-t border-dark-border pt-6">
          © {new Date().getFullYear()} LegacyChain. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
