import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminDashboard() {
  const [payments, setPayments] = useState([]);
  const [message, setMessage] = useState("");

  const fetchPayments = async () => {
    try {
      const token = localStorage.getItem("employeeToken");
      const res = await axios.get("https://localhost:3443/v1/payments/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPayments(res.data);
    } catch (err) {
      console.error(err);
      setMessage("❌ Unable to load payments.");
    }
  };

  const verifyPayment = async (id) => {
    try {
      const token = localStorage.getItem("employeeToken");
      await axios.put(
        `https://localhost:3443/v1/payments/${id}/verify`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("✅ Payment verified!");
      fetchPayments();
    } catch (err) {
      console.error(err);
      setMessage("❌ Verification failed.");
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  // 🟢 Defensive guards before rendering the main UI
  if (message.includes("Unable to load")) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p className="text-red-400 text-lg">
          Server unavailable. Please ensure API is running.
        </p>
      </div>
    );
  }

  if (payments.length === 0 && !message.includes("Unable to load")) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p className="text-gray-400 text-lg">
          No payments yet or still loading...
        </p>
      </div>
    );
  }

  // 🟢 Main UI once data is available
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-8">
      <h1 className="text-2xl font-bold mb-6 text-indigo-400">
        Employee Dashboard
      </h1>

      {message && <p className="mb-4 text-sm text-gray-300">{message}</p>}

      <div className="overflow-x-auto bg-gray-900 rounded-lg border border-gray-700 shadow-lg">
        <table className="w-full text-sm text-left text-gray-300">
          <thead className="bg-gray-800 text-indigo-400">
            <tr>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Currency</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p._id} className="border-t border-gray-700">
                <td className="px-4 py-2">{p.beneficiary}</td>
                <td className="px-4 py-2">{(p.amountCents / 100).toFixed(2)}</td>
                <td className="px-4 py-2">{p.currency}</td>
                <td className="px-4 py-2">{p.status}</td>
                <td className="px-4 py-2 text-right">
                  {p.status === "PENDING" && (
                    <button
                      onClick={() => verifyPayment(p._id)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-md text-sm"
                    >
                      Verify
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
