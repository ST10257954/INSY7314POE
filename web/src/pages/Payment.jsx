import { useEffect, useState } from "react";
import axios from "axios";
import { makePayment } from "../lib/api.js";

export default function Payment() {
  const [payments, setPayments] = useState([]);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    amount: "",
    currency: "ZAR",
    beneficiary: "",
    account: "",
    provider: "SWIFT",
  });

  // ✅ Fetch payments for logged-in user
  const listPayments = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Session expired. Please log in again.");
        localStorage.clear();
        window.location.href = "/login";
        return;
      }

      const res = await axios.get("https://localhost:3443/v1/payments/mine", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Ensure we have a consistent array
      setPayments(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("❌ Failed to fetch payments:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    listPayments();
  }, []);

  // ✅ Submit a new payment
  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await makePayment({
        amount: Number(form.amount),
        currency: form.currency,
        beneficiary: form.beneficiary,
        account: form.account,
        provider: form.provider,
      });

      // Clear form
      setForm({
        amount: "",
        currency: "ZAR",
        beneficiary: "",
        account: "",
        provider: "SWIFT",
      });

      await listPayments();
    } catch (err) {
      console.error("❌ Payment failed:", err.response?.data || err.message);
      alert("Payment failed: " + (err.response?.data?.message || "Unknown error"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white px-6 py-10">
      <h1 className="text-center text-2xl font-bold mb-8 text-indigo-400">
        💳 Payments Dashboard
      </h1>

      {/* Payment form */}
      <form
        onSubmit={onSubmit}
        className="max-w-xl mx-auto bg-gray-900 p-6 rounded-xl border border-gray-800 shadow-lg space-y-4"
      >
        <div>
          <label>Amount</label>
          <input
            required
            type="number"
            min="1"
            step="0.01"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            className="w-full mt-1 px-3 py-2 rounded-md bg-gray-800 border border-gray-700"
          />
        </div>

        <div>
          <label>Currency</label>
          <select
            value={form.currency}
            onChange={(e) => setForm({ ...form, currency: e.target.value })}
            className="w-full mt-1 px-3 py-2 rounded-md bg-gray-800 border border-gray-700"
          >
            <option value="ZAR">ZAR (South African Rand)</option>
            <option value="USD">USD (US Dollar)</option>
            <option value="EUR">EUR (Euro)</option>
          </select>
        </div>

        <div>
          <label>Beneficiary</label>
          <input
            required
            value={form.beneficiary}
            onChange={(e) => setForm({ ...form, beneficiary: e.target.value })}
            className="w-full mt-1 px-3 py-2 rounded-md bg-gray-800 border border-gray-700"
          />
        </div>

        <div>
          <label>Account Number</label>
          <input
            required
            pattern="^[0-9]{8,16}$"
            value={form.account}
            onChange={(e) => setForm({ ...form, account: e.target.value })}
            className="w-full mt-1 px-3 py-2 rounded-md bg-gray-800 border border-gray-700"
          />
        </div>

        <div>
          <label>Provider</label>
          <select
            value={form.provider}
            onChange={(e) => setForm({ ...form, provider: e.target.value })}
            className="w-full mt-1 px-3 py-2 rounded-md bg-gray-800 border border-gray-700"
          >
            <option>SWIFT</option>
            <option>SEPA</option>
            <option>ACH</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-indigo-600 hover:bg-indigo-700 py-2 rounded-md"
        >
          {saving ? "Processing..." : "Submit Payment"}
        </button>
      </form>

      {/* Payment history */}
      <div className="max-w-2xl mx-auto mt-10 space-y-3">
        {payments.length > 0 ? (
          payments.map((p) => (
            <div
              key={p._id}
              className="bg-gray-900 border border-gray-800 rounded-lg p-4 flex justify-between items-center"
            >
              <div>
                <p className="font-semibold text-indigo-300">
                  {p.currency || "ZAR"}{" "}
                  {Number(p.amountCents ? p.amountCents / 100 : p.amount).toFixed(2)}
                </p>
                <p className="text-sm text-gray-400">
                  {p.beneficiary} —{" "}
                  {new Date(p.createdAt || Date.now()).toLocaleDateString()}
                </p>
              </div>
              <span
                className={`text-sm font-semibold ${
                  p.status === "VERIFIED"
                    ? "text-green-400"
                    : p.status === "PENDING"
                    ? "text-yellow-400"
                    : "text-gray-300"
                }`}
              >
                {p.status || "Pending"}
              </span>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-400">No payments yet.</p>
        )}
      </div>

      {/* Logout button */}
      <div className="text-center mt-10">
        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = "/login";
          }}
          className="text-sm text-gray-400 underline hover:text-indigo-400"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
