import jwt from "jsonwebtoken";

export default function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(403).json({ message: "Missing Authorization header" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(403).json({ message: "Missing token" });

  try {
    console.log("🔑 Verifying token:", token);
    console.log("🧬 Using secret:", process.env.JWT_SECRET);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Token verified:", decoded);

    const allowedRoles = ["customer", "user", "admin", "employee"];
if (!allowedRoles.includes(decoded.role)) {
  return res.status(403).json({ message: "Unauthorized role" });
}

    req.user = decoded;
    next();
  } catch (err) {
    console.error("❌ Invalid or expired token:", err.message);
    res.status(401).json({ message: "Invalid or expired token" });
  }
}
