// Middleware: Restricts access to verified employee accounts only (Ibrahim, 2024).
import jwt from "jsonwebtoken";

export default function authEmployee(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(403).json({ message: "Access denied. No token." });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Ensure user role is 'employee'
    if (decoded.role !== "employee") {
      return res.status(403).json({ message: "Unauthorized. Not an employee." });
    }

    // Attach decoded employee info to request
    req.user = decoded;
    next();
  } catch (err) {
    console.error("JWT verification failed:", err);
    // Handle verification failure
    res.status(401).json({ message: "Invalid or expired token" });
  }
}

/* References
Ibrahim, M., 2024. What is a JWT? Understanding JSON Web Tokens. [Online] 
Available at: https://supertokens.com/blog/what-is-jwt
[Accessed 20 August 2025]. */