import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import FileUploader from "./components/FileUploader";
import MyFiles from "./pages/MyFiles";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  const [token, setToken] = React.useState(localStorage.getItem("token") || "");
  const [user, setUser] = React.useState(null);

  if (!token || !user) {
    return (
      <Router>
        <Routes>
          <Route path="/register" element={<Register setToken={setToken} setUser={setUser} />} />
          <Route path="/*" element={<Login setToken={setToken} setUser={setUser} />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<FileUploader token={token} user={user} />} />
        <Route path="/myfiles" element={<MyFiles token={token} user={user} />} />
        <Route path="/admin" element={<AdminDashboard token={token} user={user} />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

      </Routes>
    </Router>

    
  );
}

export default App;
