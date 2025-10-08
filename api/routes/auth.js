import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { z } from "zod";
import User from "../models/User.js";

const router = Router();

const RegisterSchema = z.object({
  fullName:   z.string().min(2).max(80),
  idNumber:   z.string().regex(/^\d{6,13}$/),
  accountNo:  z.string().regex(/^\d{8,20}$/),
  email:      z.string().email(),
  password:   z.string().min(8).max(64)
              .regex(/[A-Z]/).regex(/[a-z]/).regex(/\d/).regex(/[^\w\s]/),
});

router.post("/register", async (req,res)=>{
  const parsed = RegisterSchema.safeParse(req.body);
  if(!parsed.success) return res.status(400).json({error:"Invalid input"});

  const { fullName,idNumber,accountNo,email,password } = parsed.data;
  const exists = await User.findOne({ $or:[{email},{idNumber},{accountNo}] });
  if (exists) return res.status(409).json({error:"User already exists"});

  const passHash = await bcrypt.hash(password, 12);
  const user = await User.create({ fullName,idNumber,accountNo,email,passHash, role:"customer" });
  res.status(201).json({ id: user._id });
});

const LoginSchema = z.object({
  email:    z.string().email(),
  password: z.string().min(8)
});

router.post("/login", async (req,res)=>{
  const parsed = LoginSchema.safeParse(req.body);
  if(!parsed.success) return res.status(400).json({error:"Invalid input"});

  const { email, password } = parsed.data;
  const user = await User.findOne({ email });
  if(!user) return res.status(401).json({error:"Bad credentials"});

  const ok = await bcrypt.compare(password, user.passHash);
  if(!ok) return res.status(401).json({error:"Bad credentials"});

  const token = jwt.sign({ sub: user._id.toString(), role: user.role }, process.env.JWT_SECRET, { expiresIn: "20m" });
  res.json({ token });
});

export default router; // <-- keep this line (exactly once)
