// Middleware: Sanitizes incoming requests to prevent NoSQL injection (Das, 2025).
export function sanitizeRequest(req, res, next) {
  const clean = (obj) => {
    for (const key in obj) {

// Remove keys starting with '$' or containing '.'
      if (key.startsWith("$") || key.includes(".")) {
        delete obj[key];

// Recursively clean nested objects
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

/*References
Das, A., 2025. 7 Best Practices for Sanitizing Input in Node.js. [Online] 
Available at: https://medium.com/devmap/7-best-practices-for-sanitizing-input-in-node-js-e61638440096
[Accessed 01 October 2025].
 */