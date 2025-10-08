import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cors from "cors";
import morgan from "morgan";

import authRoutes from "./routes/auth.js";
import paymentRoutes from "./routes/payments.js";


const app = express();

app.use(express.json({ limit: "100kb" }));
app.use(helmet({ frameguard: { action: "deny" } }));
app.use(rateLimit({ windowMs: 60_000, max: 100 }));
app.use(cors({ origin: true, credentials: false }));
app.use(morgan("tiny"));

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/v1/auth", authRoutes);
app.use("/v1/payments", paymentRoutes);

app.get("/", (_req, res) => res.json({ ok: true, service: "api" }));

export default app;
