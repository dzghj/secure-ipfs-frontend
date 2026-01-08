import React from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();

  // Define which routes should have centered content
  const centeredRoutes = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/",
  ];

  // If path matches any centered route, vertically center the content
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

        <button
          onClick={() => navigate("/login")}
          className="px-5 py-2 text-sm font-medium border border-gray-600 hover:border-indigo-500 rounded-md transition"
        >
          Login
        </button>
      </header>

      {/* ---------- Main Content ---------- */}
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