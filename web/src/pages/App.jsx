import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Login from "./Login.jsx";
import Register from "./Register.jsx";
import Payment from "./Payment.jsx";
import AdminDashboard from "./AdminDashboard.jsx";

export default function App() {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);

  // ✅ Check login state on app load
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (token && role) {
      setIsAuthenticated(true);
      setUserRole(role.toLowerCase());
    } else {
      setIsAuthenticated(false);
      setUserRole(null);
    }
  }, [location.pathname]); // re-check when route changes

  // ✅ Protect routes with allowed roles
  const ProtectedPage = ({ element, allowedRoles }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
    if (allowedRoles && !allowedRoles.includes(userRole)) {
      return <Navigate to="/" replace />;
    }
    return element;
  };

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Customer-only route */}
      <Route
        path="/payment"
        element={<ProtectedPage element={<Payment />} allowedRoles={["customer"]} />}
      />

      {/* Employee-only route */}
      <Route
        path="/admin"
        element={<ProtectedPage element={<AdminDashboard />} allowedRoles={["employee"]} />}
      />

      {/* Fallback redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
