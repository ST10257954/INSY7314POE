import jwt from "jsonwebtoken";

export default function authEmployee(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(403).json({ message: "Access denied. No token." });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Fix: match correct employee role set during login
    if (decoded.role !== "employee") {
      return res.status(403).json({ message: "Unauthorized. Not an employee." });
    }

    req.user = decoded;
    next();
  } catch (err) {
    console.error("❌ JWT verification failed:", err);
    res.status(401).json({ message: "Invalid or expired token" });
  }
}
