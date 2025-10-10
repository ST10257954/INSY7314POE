import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema({
  userId:          { type: mongoose.Types.ObjectId, ref: "User", required: true, index: true },
  amountCents:     { type: Number, required: true, min: 1 },
  currency:        { type: String, enum: ["ZAR","USD","EUR","GBP"], required: true },

  // ✅ Allow more than just SWIFT
  provider:        { type: String, enum: ["SWIFT", "SEPA", "ACH"], required: true },

  beneficiary:     { type: String, required: true, minlength: 2, maxlength: 80 },
  beneficiaryAcc:  { type: String, required: true },

  // ✅ Make swiftCode optional, with fallback
  swiftCode:       { type: String, required: false, default: "N/A" },

  status:          { type: String, enum: ["PENDING","VERIFIED","SUBMITTED_TO_SWIFT"], default: "PENDING" },
  createdAt:       { type: Date, default: Date.now },
  updatedAt:       { type: Date, default: Date.now }
}, { versionKey: false });

PaymentSchema.pre("save", function(next){
  this.updatedAt = new Date();
  next();
});

const Payment = mongoose.model("Payment", PaymentSchema);
export default Payment;
