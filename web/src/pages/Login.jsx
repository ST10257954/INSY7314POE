import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../lib/api.js";

export default function Login(){
  const nav = useNavigate();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ email:"", password:"" });

  async function onSubmit(e){
    e.preventDefault();
    setSaving(true);
    try{
      const { token } = await loginUser(form);
      localStorage.setItem("token", token);
      nav("/payments");
    }catch(err){
      alert("Login failed: " + (err?.message || "Unknown error"));
    }finally{
      setSaving(false);
    }
  }

  return (
    <section className="card">
      <h1>Welcome back</h1>
      <p className="sub">Sign in to view and create payments.</p>

      <form className="form-grid" onSubmit={onSubmit}>
        <div className="field">
          <label htmlFor="l-email">Email</label>
          <input id="l-email" type="email" required
            value={form.email}
            onChange={e => setForm({...form, email: e.target.value})}/>
        </div>

        <div className="field">
          <label htmlFor="l-pass">Password</label>
          <input id="l-pass" type="password" required
            value={form.password}
            onChange={e => setForm({...form, password: e.target.value})}/>
        </div>

        <div className="actions">
          <button className="btn btn-primary" disabled={saving}>
            {saving ? "Signing in…" : "Sign in"}
          </button>
          <Link className="btn btn-ghost" to="/register">Create an account</Link>
        </div>
      </form>
    </section>
  );
}
