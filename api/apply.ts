import { ApplyProxyError, submitApplication } from "../applyProxy";
import { MAX_APPLICATION_BYTES } from "../src/lib/applicationPayload";
import {
  applyRateLimiter,
  clientIp,
  headerValue,
  isAllowedOrigin,
  isJsonContentType,
} from "../src/lib/applyGuard";

interface ApiRequest {
  method?: string;
  body?: unknown;
  headers?: Record<string, string | string[] | undefined>;
  socket?: { remoteAddress?: string };
}

interface ApiResponse {
  status: (statusCode: number) => ApiResponse;
  json: (body: unknown) => void;
  setHeader?: (name: string, value: string | number) => void;
}

function reject(response: ApiResponse, status: number, error: string) {
  response.setHeader?.("Cache-Control", "no-store");
  response.status(status).json({ error });
}

export default async function handler(request: ApiRequest, response: ApiResponse) {
  if (request.method !== "POST") {
    response.setHeader?.("Allow", "POST");
    reject(response, 405, "Method not allowed.");
    return;
  }

  if (!isJsonContentType(headerValue(request.headers, "content-type"))) {
    reject(response, 415, "Unsupported content type.");
    return;
  }

  const declaredLength = Number(headerValue(request.headers, "content-length") ?? 0);
  if (Number.isFinite(declaredLength) && declaredLength > MAX_APPLICATION_BYTES) {
    reject(response, 413, "Application payload is too large.");
    return;
  }

  if (typeof request.body === "string" && Buffer.byteLength(request.body, "utf8") > MAX_APPLICATION_BYTES) {
    reject(response, 413, "Application payload is too large.");
    return;
  }

  if (!isAllowedOrigin(headerValue(request.headers, "origin"), headerValue(request.headers, "host"))) {
    reject(response, 403, "Origin not allowed.");
    return;
  }

  const rateLimit = applyRateLimiter(`apply:${clientIp(request.headers, request.socket?.remoteAddress)}`);
  if (!rateLimit.allowed) {
    response.setHeader?.("Retry-After", String(rateLimit.retryAfterSeconds));
    reject(response, 429, "Too many applications. Please try again later.");
    return;
  }

  try {
    const body = typeof request.body === "string" ? JSON.parse(request.body) : request.body;
    const result = await submitApplication(body);
    response.setHeader?.("Cache-Control", "no-store");
    response.status(200).json(result);
  } catch (error) {
    if (error instanceof SyntaxError) {
      reject(response, 400, "Invalid JSON payload.");
      return;
    }
    const status = error instanceof ApplyProxyError ? error.status : 502;
    const message =
      error instanceof ApplyProxyError
        ? error.message
        : "Unable to send your application.";
    reject(response, status, message);
  }
}
