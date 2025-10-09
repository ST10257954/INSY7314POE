// routes/payments.js
import express from "express";
import auth from "../middleware/auth.js";
import Payment from "../models/Payment.js";

const router = express.Router();

// All payment routes require valid customer token
router.use(auth);

// -------------------- CREATE PAYMENT --------------------
router.post("/", auth, async (req, res) => {
  try {
    const { amount, currency, beneficiary, account, provider } = req.body;

    if (!amount || !currency || !beneficiary || !account || !provider) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // ✅ include swiftCode: provider, since schema requires it
    const payment = await Payment.create({
      userId: req.user.sub,
      amountCents: Math.round(amount * 100),
      currency,
      beneficiary,
      beneficiaryAcc: account,
      provider,
      swiftCode: provider,      // 👈 add this line to satisfy schema
      reference: "online-payment",
      status: "PENDING",
    });

    console.log("✅ Payment created:", payment);
    res.status(201).json(payment);
  } catch (err) {
    console.error("❌ Payment creation failed:", err);
    res.status(500).json({ message: "Payment failed", error: err.message });
  }
});

// -------------------- Fetch ALL user payments --------------------
router.get("/", async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.user.sub }).sort({ createdAt: -1 });
    res.json(payments);
  } catch (err) {
    console.error("❌ Fetch payments failed:", err.message);
    res.status(500).json({ message: "Failed to load payments" });
  }
});

// -------------------- Fetch ALL PAYMENTS (ADMIN DASHBOARD) --------------------
router.get("/all", async (req, res) => {
  try {
    // 🧠 Only allow admins or employees
    if (req.user.role !== "admin" && req.user.role !== "employee") {
      return res.status(403).json({ message: "Forbidden: admin access only" });
    }

    const payments = await Payment.find().sort({ createdAt: -1 });
    res.json(payments);
  } catch (err) {
    console.error("❌ Fetch all payments failed:", err.message);
    res.status(500).json({ message: "Failed to load payments" });
  }
});


// -------------------- Fetch /mine (used by frontend) --------------------
router.get("/mine", async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.user.sub }).sort({ createdAt: -1 });
    res.json(payments);
  } catch (err) {
    console.error("❌ Fetch /mine failed:", err.message);
    res.status(500).json({ message: "Failed to load payments" });
  }
});

export default router;
