import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../lib/api.js";


// keep backslashes literal for the pattern attribute
const PASS_PATTERN = String.raw`^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_\-=\[\]{};':",.<>\/?]{8,}$`;

export default function Register() {
  const nav = useNavigate();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    account: "",
    email: "",
    password: "",
  });

  async function onSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await registerUser(form);
      alert("Registered! Now log in.");
      nav("/login");
    } catch (err) {
      alert("Register failed: " + (err?.message || "Unknown error"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="card">
      <h1>Create account</h1>
      <p className="sub">Open your digital wallet and start making payments.</p>

      <form className="form-grid" onSubmit={onSubmit}>
        <div className="field">
          <label htmlFor="r-name">Full name</label>
          <input
            id="r-name"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>

        <div className="field">
          <label htmlFor="r-account">Account number (8–20 digits)</label>
          <input
            id="r-account"
            required
            pattern="^[0-9]{8,20}$"
            placeholder="12345678"
            value={form.account}
            onChange={(e) => setForm({ ...form, account: e.target.value })}
          />
        </div>

        <div className="field">
          <label htmlFor="r-email">Email</label>
          <input
            id="r-email"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>

        <div className="field">
          <label htmlFor="r-pass">Password</label>
          <input
            id="r-pass"
            type="password"
            required
            placeholder="At least 8 characters (letters + numbers)"
            pattern={PASS_PATTERN}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>

        <div className="actions">
          <button className="btn btn-primary" disabled={saving}>
            {saving ? "Saving…" : "Register"}
          </button>
          <Link className="btn btn-ghost" to="/login">
            I already have an account
          </Link>
        </div>
      </form>
    </section>
  );
}
