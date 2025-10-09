import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer"); // default
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const endpoint =
        role === "employee"
          ? "https://localhost:3443/v1/employee/login"
          : "https://localhost:3443/v1/auth/login";

      const res = await axios.post(endpoint, { email, password });

      if (role === "employee") {
        localStorage.setItem("employeeToken", res.data.token);
        setMessage("✅ Logged in as employee. Redirecting...");
        setTimeout(() => (window.location.href = "/admin/dashboard"), 1200);
      } else {
        localStorage.setItem("token", res.data.token);
        setMessage("✅ Logged in as customer. Redirecting...");
        setTimeout(() => (window.location.href = "/payments"), 1200);
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Invalid login credentials or server error.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800 text-white px-4">
      <div className="bg-gray-900 p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-700">
        <h1 className="text-2xl font-bold mb-6 text-center text-indigo-400">
          INSY7314 Bank Portal
        </h1>

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Role Selector */}
          <div>
            <label className="text-sm text-gray-300">Login as</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="customer">Customer</option>
              <option value="employee">Employee</option>
            </select>
          </div>

          {/* Email */}
          <div>
            <label className="text-sm text-gray-300">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-sm text-gray-300">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg"
          >
            Login
          </button>
        </form>

        {message && (
          <p className="text-center mt-4 text-sm text-gray-300">{message}</p>
        )}

        <div className="text-center mt-6">
          <p className="text-gray-400 text-sm">
            Don’t have an account?{" "}
            <Link to="/register" className="text-indigo-400 hover:underline">
              Create a customer profile
            </Link>
          </p>
        </div>
      </div>

      <p className="text-gray-500 text-xs mt-6">
        © {new Date().getFullYear()} INSY7314 Bank Portal
      </p>
    </div>
  );
}
