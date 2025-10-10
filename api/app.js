import express from "express";
import cors from "cors";
const app = express();

// ✅ 1️⃣  CORS FIRST
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,PATCH,DELETE,OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With"
  );
  if (req.method === "OPTIONS") {
    console.log("🔎 Preflight handled at app.js for:", req.path);
    return res.sendStatus(204);
  }
  next();
});

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  })
);

// ✅ 2️⃣  THEN body parsing etc.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ 3️⃣  THEN your routes
import authRoutes from "./routes/auth.js";
import adminRoutes from "./routes/admin.js";
import employeeAuth from "./routes/employeeAuth.js";
import paymentsRoutes from "./routes/payments.js";

app.use("/v1/auth", authRoutes);
app.use("/v1/admin", adminRoutes);
app.use("/v1/employee", employeeAuth);
app.use("/v1/payments", paymentsRoutes);

export default app;
