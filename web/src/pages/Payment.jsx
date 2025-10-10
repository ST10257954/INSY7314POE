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

      setPayments(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("❌ Failed to fetch payments:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    listPayments();
  }, []);

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
    <div className="dashboard-container">
      <h1>Payments Dashboard</h1>

      <form onSubmit={onSubmit}>
        <label>Amount</label>
        <input
          required
          type="number"
          min="1"
          step="0.01"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
        />

        <label>Currency</label>
        <select
          value={form.currency}
          onChange={(e) => setForm({ ...form, currency: e.target.value })}
        >
          <option value="ZAR">ZAR (South African Rand)</option>
          <option value="USD">USD (US Dollar)</option>
          <option value="EUR">EUR (Euro)</option>
        </select>

        <label>Beneficiary</label>
        <input
          required
          value={form.beneficiary}
          onChange={(e) => setForm({ ...form, beneficiary: e.target.value })}
        />

        <label>Account Number</label>
        <input
          required
          pattern="^[0-9]{8,16}$"
          value={form.account}
          onChange={(e) => setForm({ ...form, account: e.target.value })}
        />

        <label>Provider</label>
        <select
          value={form.provider}
          onChange={(e) => setForm({ ...form, provider: e.target.value })}
        >
          <option>SWIFT</option>
          <option>SEPA</option>
          <option>ACH</option>
        </select>

        <button type="submit" disabled={saving}>
          {saving ? "Processing..." : "Submit Payment"}
        </button>
      </form>

      <div style={{ marginTop: "30px" }}>
        {payments.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Beneficiary</th>
                <th>Amount</th>
                <th>Currency</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p._id}>
                  <td>{p.beneficiary}</td>
                  <td>
                    {p.currency || "ZAR"}{" "}
                    {Number(p.amountCents ? p.amountCents / 100 : p.amount).toFixed(2)}
                  </td>
                  <td>{p.currency}</td>
                  <td>{p.status || "Pending"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center">No payments yet.</p>
        )}
      </div>

      <button
        className="logout-btn"
        onClick={() => {
          localStorage.clear();
          window.location.href = "/login";
        }}
      >
        Logout
      </button>
    </div>
  );
}
