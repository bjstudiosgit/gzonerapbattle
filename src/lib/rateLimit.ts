export interface RateLimitOptions {
  limit: number;
  windowMs: number;
  maxKeys?: number;
  now?: () => number;
}

export interface RateLimitResult {
  allowed: boolean;
  retryAfterSeconds: number;
}

export type RateLimiter = (key: string) => RateLimitResult;

export function createRateLimiter({
  limit,
  windowMs,
  maxKeys = 5000,
  now = Date.now,
}: RateLimitOptions): RateLimiter {
  if (limit < 1) throw new Error("Rate limit must be at least one request.");
  if (windowMs < 1) throw new Error("Rate limit window must be positive.");

  const buckets = new Map<string, number[]>();

  return (key: string) => {
    const currentTime = now();
    const recent = (buckets.get(key) ?? []).filter(
      (timestamp) => currentTime - timestamp < windowMs
    );

    if (recent.length >= limit) {
      const oldest = recent[0];
      buckets.set(key, recent);
      return {
        allowed: false,
        retryAfterSeconds: Math.max(1, Math.ceil((windowMs - (currentTime - oldest)) / 1000)),
      };
    }

    recent.push(currentTime);
    buckets.set(key, recent);

    if (buckets.size > maxKeys) {
      for (const [bucketKey, timestamps] of buckets) {
        if (!timestamps.some((timestamp) => currentTime - timestamp < windowMs)) {
          buckets.delete(bucketKey);
        }
        if (buckets.size <= maxKeys) break;
      }
    }

    return { allowed: true, retryAfterSeconds: 0 };
  };
}
