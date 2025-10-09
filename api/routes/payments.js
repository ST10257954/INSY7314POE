import { Router } from "express";
import { z } from "zod";
import Payment from "../models/Payment.js";
import { authCustomer } from "../middleware/auth.js";

const router = Router();
const SWIFT = /^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/;

const PaymentSchema = z.object({
  amount:         z.coerce.number().gt(0),
  currency:       z.enum(["ZAR","USD","EUR","GBP"]),
  provider:       z.literal("SWIFT"),
  beneficiary:    z.string().min(2).max(80),
  beneficiaryAcc: z.string().regex(/^\d{8,20}$/),
  swiftCode:      z.string().regex(SWIFT)
});

router.post("/", authCustomer, async (req,res)=>{
  const parsed = PaymentSchema.safeParse(req.body);
  if(!parsed.success) return res.status(400).json({error:"Invalid input"});

  const p = parsed.data;
  const created = await Payment.create({
    userId: req.user.sub,
    amountCents: Math.round(p.amount * 100),
    currency: p.currency,
    provider: p.provider,
    beneficiary: p.beneficiary,
    beneficiaryAcc: p.beneficiaryAcc,
    swiftCode: p.swiftCode
  });
  res.status(201).json({ id: created._id });
});

router.get("/", authCustomer, async (req,res)=>{
  const list = await Payment.find({ userId: req.user.sub }).sort({ createdAt: -1 }).lean();
  res.json(list.map(p => ({
    id: p._id, amount: p.amountCents/100, currency: p.currency, status: p.status,
    beneficiary: p.beneficiary, createdAt: p.createdAt
  })));
});
// GET all payments (for employees)
router.get("/all", async (req, res) => {
  try {
    const payments = await Payment.find().sort({ createdAt: -1 });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch payments", error: err.message });
  }
});

// PUT /verify/:id — mark payment verified
router.put("/:id/verify", async (req, res) => {
  try {
    const updated = await Payment.findByIdAndUpdate(
      req.params.id,
      { status: "VERIFIED", updatedAt: new Date() },
      { new: true }
    );
    if (!updated) return res.status(404).json({ msg: "Payment not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ msg: "Verification failed", error: err.message });
  }
});


export default router; // <-- keep this line (exactly once)
