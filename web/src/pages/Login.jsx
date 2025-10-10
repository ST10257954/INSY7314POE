import React, { useState } from "react";
import "./../index.css";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    // ✅ Keep your existing login logic here
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h1 className="login-title">Login</h1>

        <div className="social-login">
          <a href="#"><img src="https://cdn-icons-png.flaticon.com/512/281/281764.png" alt="Google" /></a>
          <a href="#"><img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" alt="Facebook" /></a>
          <a href="#"><img src="https://cdn-icons-png.flaticon.com/512/174/174857.png" alt="LinkedIn" /></a>
          <a href="#"><img src="https://cdn-icons-png.flaticon.com/512/733/733579.png" alt="Twitter" /></a>
        </div>

        <div className="divider">or</div>

        <form onSubmit={handleSubmit} className="login-form">
          <label htmlFor="email">E-mail</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
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
          />

          <div className="remember-me">
            <input type="checkbox" id="remember" />
            <label htmlFor="remember">Remember Me</label>
          </div>

          <button type="submit" className="btn-login">
            Log In
          </button>
        </form>

        <div className="links">
          <p>
            Forgot your password? <a href="#">Reset Password</a>
          </p>
          <p>
            Don’t have an account? <a href="/register">Create Account</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
