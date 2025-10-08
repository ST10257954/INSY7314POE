// api/middleware/auth.js
import jwt from "jsonwebtoken";

export function authCustomer(req, res, next) {
  const h = req.headers.authorization || "";
  const token = h.startsWith("Bearer ") ? h.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Missing token" });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (payload.role !== "customer") return res.status(403).json({ error: "Forbidden" });
    req.user = payload; // { sub, role }
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}
