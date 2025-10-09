// lib/api.js
import axios from "axios";

const API_BASE = "https://localhost:3443/v1";

// ✅ Automatically include token in all requests
const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

// Attach token before every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ------------------- PAYMENTS -------------------

// Create a payment
export async function makePayment(data) {
  try {
    const res = await api.post("/payments", data);
    return res.data;
  } catch (err) {
    console.error("❌ makePayment failed:", err.response?.data || err.message);
    throw err;
  }
}

// Get all payments for current user
export async function getPayments() {
  try {
    const res = await api.get("/payments/mine");
    return res.data;
  } catch (err) {
    console.error("❌ getPayments failed:", err.response?.data || err.message);
    throw err;
  }
}
