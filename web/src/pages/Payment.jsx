import { useEffect, useState } from "react";
import { makePayment as createPayment } from "../lib/api.js";

export default function Payments(){
  const [payments, setPayments] = useState([]);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    amount: "", currency: "ZAR", beneficiary: "", account: "", provider: "SWIFT",
  });

  async function load(){
    const data = await listPayments();
    setPayments(data || []);
  }
  useEffect(() => { load(); }, []);

  async function onSubmit(e){
    e.preventDefault();
    setSaving(true);
    try{
      await createPayment({ ...form, amount: Number(form.amount) });
      setForm({ amount:"", currency:"ZAR", beneficiary:"", account:"", provider:"SWIFT" });
      await load();
    }catch(err){
      alert("Payment failed: " + (err?.message || "Unknown error"));
    }finally{ setSaving(false); }
  }

  return (
    <section className="card" style={{width: "min(800px, 92vw)"}}>
      <h1>Payments</h1>
      <p className="sub">Create a new payment and view your recent activity.</p>

      <form className="form-grid" onSubmit={onSubmit}>
        <div className="row" style={{gap:12}}>
          <div className="field" style={{flex:1}}>
            <label htmlFor="p-amount">Amount</label>
            <input id="p-amount" inputMode="decimal" required placeholder="e.g. 1200.50"
              value={form.amount} onChange={e => setForm({...form, amount: e.target.value})}/>
          </div>
          <div className="field" style={{width:140}}>
            <label htmlFor="p-curr">Currency</label>
            <select id="p-curr" value={form.currency} onChange={e => setForm({...form, currency: e.target.value})}>
              <option>ZAR</option><option>USD</option><option>EUR</option>
            </select>
          </div>
        </div>

        <div className="field">
          <label htmlFor="p-ben">Beneficiary</label>
          <input id="p-ben" required placeholder="Person or company"
            value={form.beneficiary} onChange={e => setForm({...form, beneficiary: e.target.value})}/>
        </div>

        <div className="row" style={{gap:12}}>
          <div className="field" style={{flex:1}}>
            <label htmlFor="p-acc">Beneficiary account (8–20 digits)</label>
            <input id="p-acc" required pattern="^[0-9]{8,20}$"
              value={form.account} onChange={e => setForm({...form, account: e.target.value})}/>
          </div>
          <div className="field" style={{width:160}}>
            <label htmlFor="p-prov">Provider</label>
            <select id="p-prov" value={form.provider} onChange={e => setForm({...form, provider: e.target.value})}>
              <option>SWIFT</option><option>SEPA</option><option>ACH</option>
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
        {payments.map(p => (
          <div key={p._id} className="item">
            <div>
              <div><strong>{p.currency} {Number(p.amountCents/100).toFixed(2)}</strong></div>
              <small>{new Date(p.createdAt).toLocaleDateString()} — {p.beneficiary}</small>
            </div>
            <span className="badge">{p.status || "PENDING"}</span>
          </div>
        ))}
        {payments.length === 0 && <small className="muted">No payments yet.</small>}
      </div>
    </section>
  );
}
