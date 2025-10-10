import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Login from "./Login.jsx";
import Register from "./Register.jsx";
import Payment from "./Payment.jsx";
import AdminDashboard from "./AdminDashboard.jsx";
import "./../index.css";

export default function App() {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [role, setRole] = useState("Customer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  // ✅ Keep your existing logic
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

  const ProtectedPage = ({ element, allowedRoles }) => {
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    if (allowedRoles && !allowedRoles.includes(userRole))
      return <Navigate to="/" replace />;
    return element;
  };

  // ✅ Your original login logic — unchanged
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
      <Route
        path="/"
        element={
          <div className="login-container">
            <h1 className="login-title">Login</h1>
            <div className="login-card">
              <div className="social-login">
                <button className="icon-btn">
                  <i className="fab fa-google"></i>
                </button>
                <button className="icon-btn">
                  <i className="fab fa-facebook-f"></i>
                </button>
                <button className="icon-btn">
                  <i className="fab fa-linkedin-in"></i>
                </button>
                <button className="icon-btn">
                  <i className="fab fa-apple"></i>
                </button>
              </div>

              <div className="divider">
                <span>Or</span>
              </div>

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
                    Forgot your password?{" "}
                    <a href="#" className="link-reset">
                      Reset Password
                    </a>
                  </p>
                  <p>
                    Don’t have an account?{" "}
                    <a href="/register" className="link-create">
                      Create Account
                    </a>
                  </p>
                </div>
              </form>
            </div>
          </div>
        }
      />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/payment"
        element={<ProtectedPage element={<Payment />} allowedRoles={["customer"]} />}
      />
      <Route
        path="/admin"
        element={<ProtectedPage element={<AdminDashboard />} allowedRoles={["employee"]} />}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
