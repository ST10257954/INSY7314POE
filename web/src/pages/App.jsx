import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useNavigate,
} from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import Payments from "./Payment";
import AdminDashboard from "./AdminDashboard";

export default function App() {
  const navigate = useNavigate();
  const authed = !!localStorage.getItem("token");
  const empAuthed = !!localStorage.getItem("employeeToken");

  function logout(e) {
    e.preventDefault();
    localStorage.removeItem("token");
    localStorage.removeItem("employeeToken");
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <header className="flex items-center justify-between px-8 py-4 border-b border-gray-700">
        <div className="text-lg font-bold text-indigo-400">
          INSY7314 Bank Client
        </div>
        <nav className="space-x-4">
          {!authed && !empAuthed && (
            <>
              <Link
                to="/register"
                className="text-gray-300 hover:text-indigo-400"
              >
                Register
              </Link>
              <Link to="/login" className="text-gray-300 hover:text-indigo-400">
                Login
              </Link>
            </>
          )}
          {(authed || empAuthed) && (
            <a
              href="#logout"
              onClick={logout}
              className="text-gray-300 hover:text-red-400"
            >
              Logout
            </a>
          )}
        </nav>
      </header>

      <main className="p-6">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Customer area */}
          <Route
            path="/payments"
            element={authed ? <Payments /> : <Navigate to="/login" />}
          />

          {/* ✅ Employee dashboard */}
          <Route
            path="/admin/dashboard"
            element={empAuthed ? <AdminDashboard /> : <Navigate to="/login" />}
          />

          {/* ✅ Fallback route for any /admin/* */}
          <Route path="/admin/*" element={<Navigate to="/admin/dashboard" />} />
        </Routes>
      </main>

      <footer className="text-center text-sm text-gray-500 py-4">
        © {new Date().getFullYear()} INSY7314
      </footer>
    </div>
  );
}
