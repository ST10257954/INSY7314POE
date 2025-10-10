// Component: Handles user login for both customers and employees (Gillis, et al., 2024).

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./../index.css";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    role: "Customer",
    email: "",
    password: "",
  });
  const [remember, setRemember] = useState(false);

    // Track form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

    // Submit login request
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { email, password, role } = formData;

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
        //Save auth data
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", role.toLowerCase());

        // Navigate based on role
        if (role === "Customer") navigate("/payment");
        else navigate("/admin");
      } else {
        alert(data.message || "Invalid credentials");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Login failed. Check console for details.");
    }
  };

  return (
    <div className="login-container">
      <h1 className="login-title">Login</h1>

      <div className="login-card">
        <form onSubmit={handleSubmit}>
          <label htmlFor="role">Login as</label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="input-field"
          >
            <option value="Customer">Customer</option>
            <option value="Employee">Employee</option>
          </select>

          <label htmlFor="email">E-mail</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
            className="input-field"
          />

          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
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
  );
}

export default Login;

/*References
Gillis, A. S., Lutkevich, B. & Nolle, T., 2024. What is an API (application programming interface)?. [Online] 
Available at: https://www.techtarget.com/searchapparchitecture/definition/application-program-interface-API
[Accessed 24 August 2025].
 */
