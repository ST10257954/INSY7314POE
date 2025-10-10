// routes/payments.js
import express from "express";
import auth from "../middleware/auth.js";
import Payment from "../models/Payment.js";

const router = express.Router();

// ✅ All payment routes require valid JWT token
router.use(auth);

// -------------------- CREATE PAYMENT (Customer) --------------------
router.post("/", auth, async (req, res) => {
  try {
    const { amount, currency, beneficiary, account, provider } = req.body;

    // Validate all required fields
    if (!amount || !currency || !beneficiary || !account || !provider) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // ✅ Create and store new payment
    const payment = await Payment.create({
      userId: req.user.sub,
      amountCents: Math.round(amount * 100),
      currency,
      beneficiary,
      beneficiaryAcc: account,
      provider,
      swiftCode: provider, // required by schema
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

// -------------------- FETCH USER'S OWN PAYMENTS --------------------
router.get("/", async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.user.sub }).sort({ createdAt: -1 });
    res.json(payments);
  } catch (err) {
    console.error("❌ Fetch payments failed:", err.message);
    res.status(500).json({ message: "Failed to load payments" });
  }
});

// -------------------- FETCH ALL PAYMENTS (Admin/Employee Dashboard) --------------------
router.get("/all", async (req, res) => {
  try {
    if (req.user.role !== "admin" && req.user.role !== "employee") {
      return res.status(403).json({ message: "Forbidden: admin or employee access only" });
    }

    const payments = await Payment.find().sort({ createdAt: -1 });
    res.json(payments);
  } catch (err) {
    console.error("❌ Fetch all payments failed:", err.message);
    res.status(500).json({ message: "Failed to load payments" });
  }
});

// -------------------- FETCH MINE (for convenience / React hook) --------------------
router.get("/mine", async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.user.sub }).sort({ createdAt: -1 });
    res.json(payments);
  } catch (err) {
    console.error("❌ Fetch /mine failed:", err.message);
    res.status(500).json({ message: "Failed to load payments" });
  }
});

// -------------------- EMPLOYEE: VERIFY / SUBMIT TO SWIFT --------------------
router.patch("/:id/status", async (req, res) => {
  try {
    // Only allow employees or admins
    if (req.user.role !== "employee" && req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden: employee access only" });
    }

    const { id } = req.params;
    const { action } = req.body;

    // Determine next status
    let newStatus;
    if (action === "verify") newStatus = "VERIFIED";
    else if (action === "submit") newStatus = "SUBMITTED_TO_SWIFT";
    else return res.status(400).json({ message: "Invalid action" });

    // Update the payment
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
