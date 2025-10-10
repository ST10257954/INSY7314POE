// api/app.js
import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cors from "cors";
import morgan from "morgan";
import hpp from "hpp";
import { sanitizeRequest } from "./middleware/sanitize.js";

// Route imports
import employeeAuthRoutes from "./routes/employeeAuth.js";
import authRoutes from "./routes/auth.js";
import paymentRoutes from "./routes/payments.js";

const app = express();

// ----------------------------------------------------
// 1. GLOBAL SECURITY MIDDLEWARES
// ----------------------------------------------------

// Limit JSON body size
app.use(express.json({ limit: "100kb" }));

// Add secure HTTP headers (Helmet)
app.use(
  helmet({
    frameguard: { action: "deny" },
    contentSecurityPolicy: false, // disable CSP for dev simplicity
    crossOriginEmbedderPolicy: true,
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// Prevent brute-force attacks (Rate limiter)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: "Too many requests — please try again later.",
});
app.use(limiter);

// Allow frontend connection securely (React: https://localhost:5173)
app.use(
  cors({
    origin: ["https://localhost:5173"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

// Protect against HTTP Parameter Pollution
app.use(hpp());

// Log incoming requests
app.use(morgan("tiny"));

// Sanitize incoming payloads (middleware you created)
app.use(sanitizeRequest);

// ----------------------------------------------------
// HEALTH CHECK
// ----------------------------------------------------
app.get("/health", (_req, res) => res.json({ ok: true, service: "INSY7314 API" }));

// ----------------------------------------------------
// MAIN ROUTES
// ----------------------------------------------------
app.use("/v1/employee", employeeAuthRoutes);
app.use("/v1/auth", authRoutes);
app.use("/v1/payments", paymentRoutes);

// ----------------------------------------------------
// ROOT ROUTE
// ----------------------------------------------------
app.get("/", (_req, res) => {
  res.json({
    ok: true,
    service: "INSY7314 Secure Banking API",
    message: "API operational and protected by Helmet + RateLimiter + CORS",
  });
});

export default app;
