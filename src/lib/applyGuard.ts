import { createRateLimiter } from "./rateLimit";

export const applyRateLimiter = createRateLimiter({
  limit: 5,
  windowMs: 10 * 60 * 1000,
});

const DEFAULT_ALLOWED_ORIGINS = new Set([
  "https://www.gzonerapbattle.com",
  "https://gzonerapbattle.com",
  "https://www.gzonerapbattle.co.uk",
  "https://gzonerapbattle.co.uk",
]);

type HeaderSource =
  | Record<string, string | string[] | undefined>
  | { get?: (name: string) => string | null | undefined };

export function headerValue(headers: HeaderSource | undefined, name: string): string | undefined {
  if (!headers) return undefined;

  if ("get" in headers && typeof headers.get === "function") {
    const value = headers.get(name);
    return typeof value === "string" ? value : undefined;
  }

  const record = headers as Record<string, string | string[] | undefined>;
  const direct = record[name] ?? record[name.toLowerCase()];
  if (Array.isArray(direct)) return direct[0];
  return direct;
}

export function clientIp(headers: HeaderSource | undefined, remoteAddress?: string): string {
  const forwarded = headerValue(headers, "x-forwarded-for");
  const firstForwarded = forwarded?.split(",")[0]?.trim();
  return firstForwarded || remoteAddress || "unknown";
}

export function isAllowedOrigin(
  origin: string | undefined,
  host: string | undefined,
  env: NodeJS.ProcessEnv = process.env
): boolean {
  if (!origin) return true;

  let parsed: URL;
  try {
    parsed = new URL(origin);
  } catch {
    return false;
  }

  if (host && parsed.host === host) return true;
  if (DEFAULT_ALLOWED_ORIGINS.has(parsed.origin)) return true;

  if (env.VERCEL_URL) {
    const vercelHost = env.VERCEL_URL.replace(/^https?:\/\//, "").replace(/\/.*$/, "");
    if (parsed.host === vercelHost) return true;
  }

  const configured = (env.APPLY_ALLOWED_ORIGINS ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  if (configured.includes(parsed.origin)) return true;

  const isLocalHost = parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1";
  return env.NODE_ENV !== "production" && isLocalHost;
}

export function isJsonContentType(value: string | undefined): boolean {
  return typeof value === "string" && /^application\/json(?:\s*;.*)?$/i.test(value.trim());
}
