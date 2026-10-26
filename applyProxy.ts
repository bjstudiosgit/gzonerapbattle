import {
  ApplyPayload,
  validateApplication,
} from "./src/lib/applicationPayload";

const defaultRecipient = "bradleyjsmithuk@gmail.com";
const FORM_SUBMIT_TIMEOUT_MS = 10000;

export type { ApplyPayload };

export class ApplyProxyError extends Error {
  status: number;

  constructor(message: string, status = 502) {
    super(message);
    this.name = "ApplyProxyError";
    this.status = status;
  }
}

export async function submitApplication(input: unknown) {
  const validation = validateApplication(input);
  if (validation.ok === false) {
    throw new ApplyProxyError(validation.error, 400);
  }

  const payload = validation.value;
  const recipient = (process.env.APPLY_EMAIL || defaultRecipient).trim();
  if (!/^[^\s@/]+@[^\s@/]+\.[^\s@/]+$/.test(recipient)) {
    throw new ApplyProxyError("The application service is not configured correctly.", 502);
  }
  const subject = `New G-Zone MC application: ${payload.mcName || payload.fullName}`;

  let response: Response;
  try {
    response = await fetch(`https://formsubmit.co/ajax/${recipient}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      signal: AbortSignal.timeout(FORM_SUBMIT_TIMEOUT_MS),
      body: JSON.stringify({
        _subject: subject.replace(/[\r\n]+/g, " "),
        "Full Name": payload.fullName,
        "MC Name": payload.mcName,
        Email: payload.email,
        Phone: payload.phone,
        "City / Area": payload.city,
        Experience: payload.battleExperience,
        "Why they want to battle": payload.about,
        "Optional links": payload.links || "None provided",
      }),
    });
  } catch {
    throw new ApplyProxyError("The application service is temporarily unavailable.", 502);
  }

  const result = await response.json().catch(() => null);

  if (!response.ok || result?.success === false || result?.success === "false") {
    throw new ApplyProxyError("The application service is temporarily unavailable.", 502);
  }

  return { success: true };
}
