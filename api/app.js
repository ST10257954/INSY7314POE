// App Entry: Configures Express middleware, CORS, and routes for the payments system (Wachira, 2023).
import express from "express";
import cors from "cors";
const app = express();

// CORS configuration (frontend: http://localhost:5173)
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

    // Handle preflight requests
  if (req.method === "OPTIONS") {
    console.log("🔎 Preflight handled at app.js for:", req.path);
    return res.sendStatus(204);
  }
  next();
});

// Enable standard CORS
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  })
);

// Parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Register API routes
import authRoutes from "./routes/auth.js";
import adminRoutes from "./routes/admin.js";
import employeeAuth from "./routes/employeeAuth.js";
import paymentsRoutes from "./routes/payments.js";

app.use("/v1/auth", authRoutes);
app.use("/v1/admin", adminRoutes);
app.use("/v1/employee", employeeAuth);
app.use("/v1/payments", paymentsRoutes);

export default app;

/*References
Wachira, M., 2023. Demystifying CORS: Understanding How Cross-Origin Resource Sharing Works. [Online] 
Available at: https://dev.to/martinwachira/demystifying-cors-understanding-how-cross-origin-resource-sharing-works-93k
[Accessed 02 October 2025].
 */