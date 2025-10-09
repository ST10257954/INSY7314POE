// src/pages/Payments.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { makePayment as createPayment } from "../lib/api.js";

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    amount: "",
    currency: "ZAR",
    beneficiary: "",
    account: "",
    provider: "SWIFT",
  });

  // ✅ Load all payments for the logged-in customer
  const listPayments = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("⚠️ No token found — user might not be logged in.");
        alert("Session expired. Please log in again.");
        return;
      }

      const res = await axios.get("https://localhost:3443/v1/payments/mine", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPayments(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch payments:", err.response?.data || err.message);
      if (err.response?.status === 401) {
        alert("Your session has expired. Please log in again.");
        localStorage.clear();
        window.location.href = "/"; // redirect to login
      }
    }
  };

  useEffect(() => {
    listPayments();
  }, []);

  // ✅ Submit a new payment
  async function onSubmit(e) {
    e.preventDefault();
    setSaving(true);

    try {
      await createPayment({
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

      // Reload payments after creation
      await listPayments();
    } catch (err) {
      console.error("❌ Payment failed:", err.response?.data || err.message);
      alert("Payment failed: " + (err.response?.data?.message || "Unknown error"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="card" style={{ width: "min(800px, 92vw)" }}>
      <h1>Payments</h1>
      <p className="sub">Create a new payment and view your recent activity.</p>

      <form className="form-grid" onSubmit={onSubmit}>
        <div className="row" style={{ gap: 12 }}>
          <div className="field" style={{ flex: 1 }}>
            <label htmlFor="p-amount">Amount</label>
            <input
              id="p-amount"
              inputMode="decimal"
              required
              placeholder="e.g. 1200.50"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
            />
          </div>

          <div className="field" style={{ width: 140 }}>
            <label htmlFor="p-curr">Currency</label>
            <select
              id="p-curr"
              value={form.currency}
              onChange={(e) => setForm({ ...form, currency: e.target.value })}
            >
              <option>ZAR</option>
              <option>USD</option>
              <option>EUR</option>
            </select>
          </div>
        </div>

        <div className="field">
          <label htmlFor="p-ben">Beneficiary</label>
          <input
            id="p-ben"
            required
            placeholder="Person or company"
            value={form.beneficiary}
            onChange={(e) => setForm({ ...form, beneficiary: e.target.value })}
          />
        </div>

        <div className="row" style={{ gap: 12 }}>
          <div className="field" style={{ flex: 1 }}>
            <label htmlFor="p-acc">Beneficiary account (8–20 digits)</label>
            <input
              id="p-acc"
              required
              pattern="^[0-9]{8,20}$"
              value={form.account}
              onChange={(e) => setForm({ ...form, account: e.target.value })}
            />
          </div>

          <div className="field" style={{ width: 160 }}>
            <label htmlFor="p-prov">Provider</label>
            <select
              id="p-prov"
              value={form.provider}
              onChange={(e) => setForm({ ...form, provider: e.target.value })}
            >
              <option>SWIFT</option>
              <option>SEPA</option>
              <option>ACH</option>
            </select>
          </div>
        </div>

        <div className="actions">
          <button className="btn btn-primary" disabled={saving}>
            {saving ? "Saving…" : "Submit payment"}
          </button>
        </div>
      </form>

      <div className="list">
        {payments.length > 0 ? (
          payments.map((p) => (
            <div key={p._id} className="item">
              <div>
                <div>
                  <strong>
                    {p.currency} {Number(p.amountCents / 100).toFixed(2)}
                  </strong>
                </div>
                <small>
                  {new Date(p.createdAt).toLocaleDateString()} — {p.beneficiary}
                </small>
              </div>
              <span className="badge">{p.status || "PENDING"}</span>
            </div>
          ))
        ) : (
          <small className="muted">No payments yet.</small>
        )}
      </div>
    </section>
  );
}
