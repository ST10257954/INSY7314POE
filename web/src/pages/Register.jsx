import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    idNumber: "",
    accountNumber: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
await axios.post("https://localhost:3443/v1/auth/register", {
  fullName: form.fullName,
  idNumber: form.idNumber,
  accountNo: form.accountNumber, // ✅ fix key name
  email: form.email,
  password: form.password,
});
      setMessage("✅ Account created! Redirecting...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      console.error(err);
      setMessage("❌ Registration failed.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800 text-white px-4">
      <div className="bg-gray-900 p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-700">
        <h1 className="text-2xl font-bold mb-6 text-center text-indigo-400">
          Create Customer Account
        </h1>

        <form onSubmit={handleSubmit} className="space-y-3">
          {["fullName", "email", "idNumber", "accountNumber", "password"].map(
            (field) => (
              <div key={field}>
                <label className="text-sm text-gray-300 capitalize">
                  {field.replace(/([A-Z])/g, " $1")}
                </label>
                <input
                  type={field === "password" ? "password" : "text"}
                  name={field}
                  required
                  value={form[field]}
                  onChange={handleChange}
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            )
          )}
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg"
          >
            Register
          </button>
        </form>

        {message && <p className="text-center mt-4">{message}</p>}

        <div className="text-center mt-4">
          <p className="text-gray-400 text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-400 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
