import React from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";

export default function Layout({ onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;

  const handleLogout = () => {
    onLogout(); // ✅ now defined
    navigate("/login", { replace: true });
  };


  // Routes that should be centered
  const centeredRoutes = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/",
  ];

  const centerContent = centeredRoutes.some((path) =>
    location.pathname.startsWith(path)
  );

  const isMyFiles = location.pathname.startsWith("/myfiles");

  return (
    <div className={`bg-dark-bg text-white flex flex-col ${isMyFiles ? "h-screen overflow-hidden" : "min-h-screen"}`}>
      {/* ---------- Header ---------- */}
      <header className="flex items-center justify-between px-8 py-4 border-b border-dark-border bg-dark-bg">
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-2xl font-bold text-primary cursor-pointer hover:opacity-80 transition"
        >
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-dark-bg font-bold">⛓️</span>
          </div>
          <span>LegacyChain</span>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          {!isMyFiles && (
            <>
              <a href="#features" className="text-sm text-gray-300 hover:text-primary transition">Features</a>
              <a href="#security" className="text-sm text-gray-300 hover:text-primary transition">Security</a>
              <a href="#vault" className="text-sm text-gray-300 hover:text-primary transition">Vault</a>
            </>
          )}
        </nav>

        {/* ✅ Auth-aware button */}
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="px-5 py-2 text-sm font-medium bg-primary text-dark-bg hover:bg-primary-dark rounded-lg transition font-semibold"
          >
            Logout
          </button>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="px-5 py-2 text-sm font-medium bg-primary text-dark-bg hover:bg-primary-dark rounded-lg transition font-semibold"
          >
            Get Started
          </button>
        )}
      </header>

      {/* ---------- Main ---------- */}
      <main
        className={`flex flex-1 ${
          isMyFiles
            ? "overflow-hidden"
            : centerContent
            ? "px-6 items-center justify-center overflow-y-auto"
            : "overflow-y-auto"
        }`}
      >
        <Outlet />
      </main>

      {/* ---------- Footer ---------- */}
      <footer className="py-8 border-t border-dark-border bg-dark-bg">
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
