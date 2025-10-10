import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      // ✅ Call backend login API
      const res = await axios.post(
        "https://localhost:3443/v1/auth/login",
        {
          email: email.trim().toLowerCase(),
          password,
          role: role.toLowerCase(),
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: false,
        }
      );

      if (res.status === 200 && res.data.token) {
        // ✅ Extract and normalize role
        const userRole = res.data.user.role?.toLowerCase();

        // ✅ Store login session (shared across all pages)
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", userRole);
        localStorage.setItem("email", res.data.user.email);
        localStorage.setItem("name", res.data.user.name || "User");

        setMessage("✅ Login successful! Redirecting...");

        // ✅ Role-based navigation
        if (userRole === "employee") {
          navigate("/admin"); // Employee → Admin Dashboard
        } else if (userRole === "customer") {
          navigate("/payment"); // Customer → Payment Page
        } else {
          navigate("/login"); // Fallback if role missing
        }
      } else {
        setMessage("❌ Login failed. Please try again.");
      }
    } catch (err) {
      console.error("❌ Login error:", err.response?.data || err.message);
      setMessage(
        "❌ " +
          (err.response?.data?.message ||
            "Invalid email or password / Unauthorized.")
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center">
      <div className="bg-gray-900 p-8 rounded-2xl shadow-lg w-full max-w-md border border-gray-800">
        <h1 className="text-2xl font-semibold text-center text-indigo-400 mb-6">
          INSY7314 Bank Portal
        </h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label>Login as</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded-md bg-gray-800 border border-gray-700"
            >
              <option value="customer">Customer</option>
              <option value="employee">Employee</option>
            </select>
          </div>

          <div>
            <label>Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded-md bg-gray-800 border border-gray-700"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label>Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded-md bg-gray-800 border border-gray-700"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 py-2 rounded-md"
          >
            Login
          </button>
        </form>

        {message && (
          <p className="text-center mt-4 text-sm text-gray-300">{message}</p>
        )}

        <p className="text-center mt-6 text-gray-400 text-sm">
          Don’t have an account?{" "}
          <Link to="/register" className="text-indigo-400 hover:underline">
            Create a customer profile
          </Link>
        </p>
      </div>

      <p className="text-gray-500 text-xs mt-6">
        © {new Date().getFullYear()} INSY7314 Bank Portal
      </p>
    </div>
  );
}
