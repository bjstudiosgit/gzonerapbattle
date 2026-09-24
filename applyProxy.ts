const defaultRecipient = "bradleyjsmithuk@gmail.com";

export interface ApplyPayload {
  fullName: string;
  mcName: string;
  email: string;
  phone: string;
  city: string;
  battleExperience: string;
  about: string;
  links?: string;
}

export class ApplyProxyError extends Error {
  status: number;

  constructor(message: string, status = 502) {
    super(message);
    this.name = "ApplyProxyError";
    this.status = status;
  }
}

export async function submitApplication(payload: ApplyPayload) {
  const fullName = payload.fullName?.trim();
  const email = payload.email?.trim();

  if (!fullName || !email) {
    throw new ApplyProxyError("Name and email are required.", 400);
  }

  const recipient = process.env.APPLY_EMAIL || defaultRecipient;
  const response = await fetch(`https://formsubmit.co/ajax/${recipient}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      _subject: `New G-Zone MC application: ${payload.mcName || fullName}`,
      "Full Name": fullName,
      "MC Name": payload.mcName,
      Email: email,
      Phone: payload.phone,
      "City / Area": payload.city,
      Experience: payload.battleExperience,
      "Why they want to battle": payload.about,
      "Optional links": payload.links || "None provided",
    }),
  });

  const result = await response.json().catch(() => null);

  if (!response.ok || result?.success === false || result?.success === "false") {
    throw new ApplyProxyError(
      result?.message || "The application service is temporarily unavailable.",
      response.status || 502
    );
  }

  return { success: true };
}
