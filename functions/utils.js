const rateLimitStore = {};

function checkAuthenticatedUser(req) {
  if (process.env.LOCAL_MODE === "true") {
    return true;
  }

  const rawPrincipal = req.headers["x-ms-client-principal"];
  if (!rawPrincipal) {
    return false;
  }

  try {
    const decoded = Buffer.from(rawPrincipal, "base64").toString("utf8");
    const principal = JSON.parse(decoded);
    return Boolean(principal && principal.userId);
  } catch (err) {
    return false;
  }
}

function rateLimit(ip) {
  const now = Date.now();
  const window = 24 * 60 * 60 * 1000; // 1 day
  if (!rateLimitStore[ip]) {
    rateLimitStore[ip] = { count: 0, start: now };
  }
  const entry = rateLimitStore[ip];
  if (now - entry.start > window) {
    entry.start = now;
    entry.count = 0;
  }
  entry.count += 1;
  return entry.count;
}

module.exports = { checkAuthenticatedUser, rateLimit };
