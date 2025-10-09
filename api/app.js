import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cors from "cors";
import morgan from "morgan";
import hpp from "hpp";
import { sanitizeRequest } from "./middleware/sanitize.js";
import employeeAuthRoutes from "./routes/employeeAuth.js";
import authRoutes from "./routes/auth.js";
import paymentRoutes from "./routes/payments.js";

const app = express();

// Security middleware
app.use(express.json({ limit: "100kb" }));
app.use(
  helmet({
    frameguard: { action: "deny" },
    crossOriginEmbedderPolicy: true,
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
app.use(rateLimit({ windowMs: 60_000, max: 100 }));
app.use(cors({ origin: true, credentials: false }));
app.use(morgan("tiny"));
app.use(hpp());
app.use(sanitizeRequest);

// Health check route
app.get("/health", (_req, res) => res.json({ ok: true }));

// Main routes
app.use("/v1/employee", employeeAuthRoutes);
app.use("/v1/auth", authRoutes);
app.use("/v1/payments", paymentRoutes);

app.use(cors({
  origin: ["https://localhost:5173"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// Root route
app.get("/", (_req, res) => res.json({ ok: true, service: "api" }));

export default app; 