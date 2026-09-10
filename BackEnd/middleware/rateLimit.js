import ipaddr from 'ipaddr.js';

// One IPv6 user usually controls a whole /64, so count it as one client.
export function clientId(req) {
  try {
    let address = ipaddr.parse(req.ip);
    if (address.kind() === 'ipv6' && address.isIPv4MappedAddress())
      address = address.toIPv4Address();
    if (address.kind() === 'ipv4') return address.toString();
    return (
      address.parts
        .slice(0, 4)
        .map((part) => part.toString(16))
        .join(':') + '::/64'
    );
  } catch {
    return String(req.ip);
  }
}
export function createRateLimiter({
  limit,
  windowMs = 60000,
  key = clientId,
  maxKeys = 10000,
}) {
  const buckets = new Map();
  const middleware = (req, res, next) => {
    const now = Date.now();
    const id = key(req);
    const times = (buckets.get(id) || []).filter(
      (time) => time > now - windowMs,
    );
    // Re-inserting keeps buckets roughly in last-use order, so expired and oldest
    // buckets sit at the front and memory stays bounded without refusing new clients.
    buckets.delete(id);
    for (const [bucket, history] of buckets) {
      if (buckets.size < maxKeys && history.at(-1) > now - windowMs) break;
      buckets.delete(bucket);
    }
    buckets.set(id, times);
    const reset = Math.max(
      1,
      Math.ceil(((times[0] || now) + windowMs - now) / 1000),
    );
    res.set({
      'X-RateLimit-Limit': String(limit),
      'X-RateLimit-Remaining': String(Math.max(0, limit - times.length - 1)),
      'X-RateLimit-Reset': String(reset),
    });
    if (times.length >= limit) {
      res.set('Retry-After', String(reset));
      return res.status(429).json({
        success: false,
        message: 'Request limit reached. Try again in ' + reset + ' seconds.',
      });
    }
    times.push(now);
    next();
  };
  middleware.clear = () => buckets.clear();
  return middleware;
}
export const authRateLimit = createRateLimiter({ limit: 15 });
export const demoRateLimit = createRateLimiter({ limit: 10 });
// Runs before any API key lookup, so guessed keys can't send unlimited queries to the database.
export const clientRateLimit = createRateLimiter({ limit: 300 });
export const proxyRateLimit = createRateLimiter({
  limit: 120,
  key: (req) => String(req.proxyUser._id),
});
