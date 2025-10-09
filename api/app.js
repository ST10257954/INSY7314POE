import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cors from "cors";
import morgan from "morgan";
import hpp from "hpp";
import mongoSanitize from "express-mongo-sanitize";

import authRoutes from "./routes/auth.js";
import paymentRoutes from "./routes/payments.js";

const app = express();

app.use(express.json({ limit: "100kb" }));
app.use(helmet({ frameguard: { action: "deny" } }));
app.use(rateLimit({ windowMs: 60_000, max: 100 }));
app.use(cors({ origin: true, credentials: false }));
app.use(morgan("tiny"));

app.use(hpp());
app.use(mongoSanitize());

// Health check route
app.get("/health", (_req, res) => res.json({ ok: true }));

// Main routes
app.use("/v1/auth", authRoutes);
app.use("/v1/payments", paymentRoutes);

// Root route
app.get("/", (_req, res) => res.json({ ok: true, service: "api" }));

export default app;
