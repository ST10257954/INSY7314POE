// Component: Displays and manages all customer payments for employees/admins (Bratslavsky, 2024).
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminDashboard() {
  const [payments, setPayments] = useState([]);
  const [message, setMessage] = useState("");

    // Fetch all payments from backend
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
      setMessage("Unable to load payments.");
    }
  };

    // Update payment status (verify or submit)
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

      if (action === "verify") setMessage("Payment verified successfully!");
      if (action === "submit") setMessage("Payment submitted to SWIFT!");
      fetchPayments(); // Refresh list after update
    } catch (err) {
      console.error("Payment status update failed:", err);
      setMessage("Action failed. Please try again.");
    }
  };

// Load payments when component mounts
  useEffect(() => {
    fetchPayments();
  }, []);

  return (
    <div className="dashboard-container">
      <h1>Employee Dashboard</h1>

      {message && (
        <p
          style={{
            textAlign: "center",
            color: message.includes("✅") ? "#34d399" : "#f87171",
          }}
        >
          {message}
        </p>
      )}

      <table>
        <thead>
          <tr>
            <th>User</th>
            <th>Account</th>
            <th>SWIFT Code</th>
            <th>Amount</th>
            <th>Currency</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((p) => (
            <tr key={p._id}>
              <td>{p.beneficiary}</td>
              <td>{p.beneficiaryAcc}</td>
              <td>{p.swiftCode || "SWIFT-001"}</td>
              <td>{(p.amountCents / 100).toFixed(2)}</td>
              <td>{p.currency}</td>
              <td>{p.status}</td>
              <td>
                {p.status === "PENDING" && (
                  <button onClick={() => updatePaymentStatus(p._id, "verify")}>
                    Verify
                  </button>
                )}
                {p.status === "VERIFIED" && (
                  <button onClick={() => updatePaymentStatus(p._id, "submit")}>
                    Submit
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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

/*References
Bratslavsky, P., 2024. How Frontend and Backend Components Interact in a Full-Stack App. [Online] 
Available at: https://strapi.io/blog/how-frontend-and-backend-components-interact-in-a-full-stack-app
[Accessed 06 October 2025].
 */
