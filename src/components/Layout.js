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

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* ---------- Header ---------- */}
      <header className="flex items-center justify-between px-8 py-4 border-b border-gray-800">
        <div
          onClick={() => navigate("/")}
          className="text-2xl font-bold text-indigo-500 cursor-pointer"
        >
          CryptoApp
        </div>

        {/* ✅ Auth-aware button */}
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="px-5 py-2 text-sm font-medium border border-red-500 text-red-400 hover:bg-red-500 hover:text-white rounded-md transition"
          >
            Logout
          </button>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="px-5 py-2 text-sm font-medium border border-gray-600 hover:border-indigo-500 rounded-md transition"
          >
            Login
          </button>
        )}
      </header>

      {/* ---------- Main ---------- */}
      <main
        className={`flex flex-1 px-6 ${
          centerContent ? "items-center justify-center" : ""
        }`}
      >
        <Outlet />
      </main>

      {/* ---------- Footer ---------- */}
      <footer className="py-6 text-center text-gray-500 text-sm border-t border-gray-800">
        © {new Date().getFullYear()} CryptoApp. All rights reserved.
      </footer>
    </div>
  );
}
