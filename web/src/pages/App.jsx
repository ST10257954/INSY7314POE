// Component: Main application router that manages authentication, roles, and route protection (J.P.Morgan, 2025).

import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Login from "./Login.jsx";
import Register from "./Register.jsx";
import Payment from "./Payment.jsx";
import AdminDashboard from "./AdminDashboard.jsx";
import "./../index.css"; // global styles

export default function App() {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [role, setRole] = useState("Customer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  // Check authentication and role when navigating
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
  }, [location.pathname]);

  // Protect routes
  const ProtectedPage = ({ element, allowedRoles }) => {
    if (!isAuthenticated)
      return <Navigate to="/login" state={{ from: location }} replace />;
    if (allowedRoles && !allowedRoles.includes(userRole))
      return <Navigate to="/" replace />;
    return element;
  };

  // Handle login submission for customers and employees
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        role === "Employee"
          ? "https://localhost:3443/v1/employee/login"
          : "https://localhost:3443/v1/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", role.toLowerCase());
        setIsAuthenticated(true);
        setUserRole(role.toLowerCase());

  // Redirect based on role
        if (role === "Customer") window.location.href = "/payment";
        else window.location.href = "/admin";
      } else {
        alert(data.message || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Check console for details.");
    }
  };

  return (
    <Routes>
      {/* --- Login Page --- */}
      <Route
        path="/"
        element={
          <div className="login-container">
            <h1 className="login-title">Login</h1>
            <div className="login-card">
              <form onSubmit={handleLogin}>
                <label>Login as</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="input-field"
                >
                  <option value="Customer">Customer</option>
                  <option value="Employee">Employee</option>
                </select>

                <label>E-mail</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="input-field"
                />

                <label>Password</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="input-field"
                />

                <div className="remember-row">
                  <input
                    type="checkbox"
                    id="remember"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                  />
                  <label htmlFor="remember">Remember Me</label>
                </div>

                <button type="submit" className="btn-login">
                  Log In
                </button>

                <div className="extra-links">
                  <p>
                    Don’t have an account?{" "}
                    <a href="/register" className="link-create">
                      Create Account
                    </a>
                  </p>
                  <p className="footer-text">© 2025 INSY7314 Bank Portal</p>
                </div>
              </form>
            </div>
          </div>
        }
      />

      {/* --- Other Routes --- */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/payment"
        element={
          <ProtectedPage element={<Payment />} allowedRoles={["customer"]} />
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedPage
            element={<AdminDashboard />}
            allowedRoles={["employee"]}
          />
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

/*References
J.P.Morgan, 2025. What is a payment gateway. [Online] 
Available at: https://www.jpmorgan.com/insights/treasury/treasury-management/payment-gateways-what-they-are-and-how-to-choose-one
[Accessed 07 October 2025].
 */