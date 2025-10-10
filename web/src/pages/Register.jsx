import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    idNumber: "",
    accountNumber: "",
    email: "",
    password: "",
    role: "customer", // fixed role
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await axios.post("https://localhost:3443/v1/auth/register", {
        name: form.name.trim(),
        idNumber: form.idNumber.trim(),
        accountNumber: form.accountNumber.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        role: "customer", // always customer
      });

      if (res.status === 201 || res.status === 200) {
        setMessage("✅ Registration successful! Redirecting...");
        setTimeout(() => navigate("/login"), 1200);
      }
    } catch (err) {
      console.error("Register error:", err.response?.data || err.message);
      setMessage(
        "❌ " + (err.response?.data?.message || "Registration failed.")
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center">
      <div className="bg-gray-900 p-8 rounded-2xl shadow-lg w-full max-w-md border border-gray-800">
        <h1 className="text-2xl font-semibold text-center text-indigo-400 mb-6">
          Customer Registration
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full mt-1 px-3 py-2 rounded-md bg-gray-800 border border-gray-700"
            />
          </div>

          <div>
            <label>ID Number</label>
            <input
              type="text"
              name="idNumber"
              required
              value={form.idNumber}
              onChange={handleChange}
              placeholder="Enter your ID number"
              className="w-full mt-1 px-3 py-2 rounded-md bg-gray-800 border border-gray-700"
            />
          </div>

          <div>
            <label>Account Number</label>
            <input
              type="text"
              name="accountNumber"
              required
              value={form.accountNumber}
              onChange={handleChange}
              placeholder="Enter your bank account number"
              className="w-full mt-1 px-3 py-2 rounded-md bg-gray-800 border border-gray-700"
            />
          </div>

          <div>
            <label>Email</label>
            <input
              type="email"
              name="email"
              required
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full mt-1 px-3 py-2 rounded-md bg-gray-800 border border-gray-700"
            />
          </div>

          <div>
            <label>Password</label>
            <input
              type="password"
              name="password"
              required
              value={form.password}
              onChange={handleChange}
              placeholder="Enter a strong password"
              className="w-full mt-1 px-3 py-2 rounded-md bg-gray-800 border border-gray-700"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 py-2 rounded-md"
          >
            Register
          </button>
        </form>

        {message && (
          <p className="text-center mt-4 text-sm text-gray-300">{message}</p>
        )}

        <p className="text-center mt-6 text-gray-400 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-400 hover:underline">
            Login
          </Link>
        </p>
      </div>

      <p className="text-gray-500 text-xs mt-6">
        © {new Date().getFullYear()} INSY7314 Bank Portal
      </p>
    </div>
  );
}
