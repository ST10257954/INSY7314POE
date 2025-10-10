// Middleware: Verifies JWT tokens and authorizes valid user roles (Ibrahim, 2024).
import jwt from "jsonwebtoken";

export default function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(403).json({ message: "Missing Authorization header" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(403).json({ message: "Missing token" });

  try {
    console.log("Verifying token:", token);
    console.log("Using secret:", process.env.JWT_SECRET);

    // Verify token using secret key

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token verified:", decoded);

    // Allow only specific roles
    const allowedRoles = ["customer", "user", "admin", "employee"];
if (!allowedRoles.includes(decoded.role)) {
  return res.status(403).json({ message: "Unauthorized role" });
}

    // Attach decoded user info to request
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Invalid or expired token:", err.message);

    // Handle invalid or expired tokens
    res.status(401).json({ message: "Invalid or expired token" });
  }
}

/* References
Ibrahim, M., 2024. What is a JWT? Understanding JSON Web Tokens. [Online] 
Available at: https://supertokens.com/blog/what-is-jwt
[Accessed 20 August 2025]. */

