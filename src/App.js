import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Layout from "./components/Layout";

import Login from "./pages/Login";
import Register from "./pages/Register";
import FileUploader from "./components/FileUploader";
import MyFiles from "./pages/MyFiles";
import AdminDashboard from "./pages/AdminDashboard";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Main from "./pages/Main";

  function App() {
    const [token, setToken] = React.useState(localStorage.getItem("token"));
    const [user, setUser] = React.useState(() => {
      const savedUser = localStorage.getItem("user");
      return savedUser ? JSON.parse(savedUser) : null;
    });
  
    const isAuthenticated = Boolean(token && user);
  
    const handleLogout = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setToken(null);
      setUser(null);
    };
  return (
    <Router>
      <Routes>
        <Route element={<Layout onLogout={handleLogout} />}>
          {/* ---------- PUBLIC ---------- */}
          <Route
            path="/"
            element={
              isAuthenticated ? <Navigate to="/myfiles" replace /> : <Main />
            }
          />

          <Route
            path="/login"
            element={
              isAuthenticated ? (
                <Navigate to="/myfiles" replace />
              ) : (
                <Login setToken={setToken} setUser={setUser} />
              )
            }
          />

          <Route
            path="/register"
            element={
              isAuthenticated ? (
                <Navigate to="/myfiles" replace />
              ) : (
                <Register setToken={setToken} setUser={setUser} />
              )
            }
          />

          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* ---------- PROTECTED ---------- */}
          <Route
            path="/myfiles"
            element={
              isAuthenticated ? (
                <MyFiles token={token} user={user} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route
            path="/upload"
            element={
              isAuthenticated ? (
                <FileUploader token={token} user={user} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route
            path="/admin"
            element={
              isAuthenticated ? (
                <AdminDashboard token={token} user={user} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* ---------- FALLBACK ---------- */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
