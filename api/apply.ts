import { ApplyProxyError, submitApplication } from "../applyProxy";

interface ApiRequest {
  method?: string;
  body?: unknown;
}

interface ApiResponse {
  status: (statusCode: number) => ApiResponse;
  json: (body: unknown) => void;
}

export default async function handler(request: ApiRequest, response: ApiResponse) {
  if (request.method !== "POST") {
    response.status(405).json({ error: "Method not allowed." });
    return;
  }

  try {
    const result = await submitApplication(request.body as { name: string; email: string });
    response.status(200).json(result);
  } catch (error) {
    const status = error instanceof ApplyProxyError ? error.status : 502;
    response.status(status).json({
      error: error instanceof Error ? error.message : "Unable to send your application.",
    });
  }
}
