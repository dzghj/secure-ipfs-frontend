//import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import React from "react";

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

  return (
    <Router>
      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<Main />} />
        <Route path="/login" element={<Login setToken={setToken} setUser={setUser} />} />
        <Route path="/register" element={<Register setToken={setToken} setUser={setUser} />} />

        {/* PROTECTED */}
        {token && user ? (
          <>
            <Route path="/upload" element={<FileUploader token={token} user={user} />} />
            <Route path="/myfiles" element={<MyFiles token={token} user={user} />} />
          </>
        ) : (
          <Route path="/upload" element={<Navigate to="/login" />} />
        )}

        <Route path="*" element={<Main />} />
      </Routes>
    </Router>
  );
}

export default App;