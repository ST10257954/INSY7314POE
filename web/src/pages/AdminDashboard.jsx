import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminDashboard() {
  const [payments, setPayments] = useState([]);
  const [message, setMessage] = useState("");

  // 🟢 Load all payments visible to employees/admins
  const fetchPayments = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("https://localhost:3443/v1/payments/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPayments(res.data);
      setMessage("");
    } catch (err) {
      console.error(err);
      setMessage("❌ Unable to load payments.");
    }
  };

  // 🟢 Update payment status (verify / submit)
  const updatePaymentStatus = async (id, action) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `https://localhost:3443/v1/payments/${id}/status`,
        { action },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (action === "verify") setMessage("✅ Payment verified successfully!");
      if (action === "submit") setMessage("✅ Payment submitted to SWIFT!");

      fetchPayments();
    } catch (err) {
      console.error("❌ Payment status update failed:", err);
      setMessage("❌ Action failed. Please try again.");
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-8">
      <h1 className="text-3xl font-bold mb-8 text-indigo-400 text-center">
        Employee Dashboard
      </h1>

      {message && (
        <div
          className={`mb-6 text-center text-sm font-medium ${
            message.includes("✅") ? "text-green-400" : "text-red-400"
          }`}
        >
          {message}
        </div>
      )}

      <div className="overflow-x-auto bg-gray-900 rounded-lg border border-gray-700 shadow-lg">
        <table className="w-full text-sm text-gray-300 border-collapse">
          <thead className="bg-gray-800 text-indigo-400 uppercase tracking-wider">
            <tr>
              <th className="px-4 py-3 text-left">User</th>
              <th className="px-4 py-3 text-left">Account</th>
              <th className="px-4 py-3 text-left">SWIFT Code</th>
              <th className="px-4 py-3 text-right">Amount</th>
              <th className="px-4 py-3 text-left">Currency</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr
                key={p._id}
                className="border-t border-gray-700 hover:bg-gray-800 transition"
              >
                <td className="px-4 py-2">{p.beneficiary}</td>
                <td className="px-4 py-2">{p.beneficiaryAcc}</td>
                <td className="px-4 py-2">{p.swiftCode || "SWIFT-001"}</td>
                <td className="px-4 py-2 text-right">
                  {(p.amountCents / 100).toFixed(2)}
                </td>
                <td className="px-4 py-2">{p.currency}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      p.status === "PENDING"
                        ? "bg-yellow-700 text-yellow-100"
                        : p.status === "VERIFIED"
                        ? "bg-blue-700 text-blue-100"
                        : "bg-green-700 text-green-100"
                    }`}
                  >
                    {p.status}
                  </span>
                </td>
                <td className="px-4 py-2 text-center space-x-2">
                  {p.status === "PENDING" && (
                    <button
                      onClick={() => updatePaymentStatus(p._id, "verify")}
                      className="bg-indigo-600 hover:bg-indigo-700 px-3 py-1 rounded-md text-sm font-medium"
                    >
                      Verify
                    </button>
                  )}
                  {p.status === "VERIFIED" && (
                    <button
                      onClick={() => updatePaymentStatus(p._id, "submit")}
                      className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded-md text-sm font-medium"
                    >
                      Submit
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
