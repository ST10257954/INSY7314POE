// routes/payments.js
import express from "express";
import auth from "../middleware/auth.js";
import Payment from "../models/Payment.js";

const router = express.Router();

// ✅ All payment routes require a valid JWT token
router.use(auth);

/* -------------------------- CREATE PAYMENT -------------------------- */
router.post("/", async (req, res) => {
  try {
    const { amount, currency, beneficiary, account, provider } = req.body;

    // Validate required fields
    if (!amount || !currency || !beneficiary || !account || !provider) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const userId = req.user?.id;
    if (!userId) {
      return res
        .status(401)
        .json({ message: "User authentication failed — no user ID found" });
    }

    // ✅ Provider-based swiftCode fallback (handles SEPA/ACH safely)
    let swiftCodeValue = "N/A";
    if (provider === "SWIFT") swiftCodeValue = "ABCZAZJJ";
    else if (provider === "SEPA") swiftCodeValue = "SEPA0000";
    else if (provider === "ACH") swiftCodeValue = "ACH0000";

    // ✅ Create payment safely
    const payment = await Payment.create({
      userId,
      amountCents: Math.round(amount * 100),
      currency,
      beneficiary,
      beneficiaryAcc: account,
      provider,
      swiftCode: swiftCodeValue, // always defined & schema-safe
      reference: "online-payment",
      status: "PENDING",
    });

    console.log("✅ Payment created:", payment._id);
    res.status(201).json(payment);
  } catch (err) {
    console.error("❌ Payment creation failed:", err);
    res
      .status(500)
      .json({ message: "Payment failed", error: err.message || err });
  }
});

/* ---------------------- FETCH USER’S OWN PAYMENTS ------------------- */
router.get("/mine", async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId)
      return res
        .status(401)
        .json({ message: "Authentication required to view payments" });

    const payments = await Payment.find({ userId }).sort({ createdAt: -1 });
    res.json(payments);
  } catch (err) {
    console.error("❌ Fetch /mine failed:", err.message);
    res.status(500).json({ message: "Failed to load payments" });
  }
});

/* ---------------- FETCH ALL PAYMENTS (Employee/Admin) ---------------- */
router.get("/all", async (req, res) => {
  try {
    if (req.user.role !== "employee" && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Forbidden: employee/admin only" });
    }

    const payments = await Payment.find().sort({ createdAt: -1 });
    res.json(payments);
  } catch (err) {
    console.error("❌ Fetch all payments failed:", err.message);
    res.status(500).json({ message: "Failed to load payments" });
  }
});

/* ---------------- EMPLOYEE: UPDATE PAYMENT STATUS ------------------- */
router.patch("/:id/status", async (req, res) => {
  try {
    if (req.user.role !== "employee" && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Forbidden: employee/admin only" });
    }

    const { id } = req.params;
    const { action } = req.body;

    let newStatus;
    if (action === "verify") newStatus = "VERIFIED";
    else if (action === "submit") newStatus = "SUBMITTED_TO_SWIFT";
    else return res.status(400).json({ message: "Invalid action" });

    const payment = await Payment.findByIdAndUpdate(
      id,
      { status: newStatus, updatedAt: new Date() },
      { new: true }
    );

    if (!payment) return res.status(404).json({ message: "Payment not found" });

    console.log(`✅ Payment ${id} marked as ${newStatus}`);
    res.json(payment);
  } catch (err) {
    console.error("❌ Failed to update payment status:", err.message);
    res.status(500).json({ message: "Server error updating payment status" });
  }
});

export default router;
