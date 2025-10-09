// api/middleware/sanitize.js
export function sanitizeRequest(req, res, next) {
  const clean = (obj) => {
    for (const key in obj) {
      if (key.startsWith("$") || key.includes(".")) {
        delete obj[key];
      } else if (typeof obj[key] === "object" && obj[key] !== null) {
        clean(obj[key]);
      }
    }
  };
  if (req.body) clean(req.body);
  if (req.query) clean(req.query);
  if (req.params) clean(req.params);
  next();
}
