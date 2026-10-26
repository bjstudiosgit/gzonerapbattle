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

export const MAX_APPLICATION_BYTES = 16 * 1024;

export const APPLICATION_LIMITS = {
  fullName: 100,
  mcName: 100,
  email: 254,
  phone: 50,
  city: 100,
  battleExperience: 80,
  about: 2000,
  links: 500,
} as const;

export type ApplicationValidation =
  | { ok: true; value: ApplyPayload }
  | { ok: false; error: string };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const UNSAFE_CONTROL_CHARACTERS = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g;

export function sanitizeSingleLine(value: unknown, maxLength: number): string {
  if (typeof value !== "string") return "";
  return value
    .replace(UNSAFE_CONTROL_CHARACTERS, "")
    .replace(/[\r\n\t]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength)
    .trim();
}

export function sanitizeMultiline(value: unknown, maxLength: number): string {
  if (typeof value !== "string") return "";
  return value
    .replace(UNSAFE_CONTROL_CHARACTERS, "")
    .replace(/\r\n?/g, "\n")
    .replace(/[ \t]+/g, " ")
    .trim()
    .slice(0, maxLength)
    .trim();
}

export function validateApplication(input: unknown): ApplicationValidation {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return { ok: false, error: "Invalid application payload." };
  }

  const source = input as Record<string, unknown>;
  const value: ApplyPayload = {
    fullName: sanitizeSingleLine(source.fullName, APPLICATION_LIMITS.fullName),
    mcName: sanitizeSingleLine(source.mcName, APPLICATION_LIMITS.mcName),
    email: sanitizeSingleLine(source.email, APPLICATION_LIMITS.email),
    phone: sanitizeSingleLine(source.phone, APPLICATION_LIMITS.phone),
    city: sanitizeSingleLine(source.city, APPLICATION_LIMITS.city),
    battleExperience: sanitizeSingleLine(source.battleExperience, APPLICATION_LIMITS.battleExperience),
    about: sanitizeMultiline(source.about, APPLICATION_LIMITS.about),
    links: sanitizeSingleLine(source.links, APPLICATION_LIMITS.links),
  };

  if (!value.fullName) {
    return { ok: false, error: "Name and email are required." };
  }

  if (!value.email) {
    return { ok: false, error: "Name and email are required." };
  }

  if (!EMAIL_PATTERN.test(value.email)) {
    return { ok: false, error: "Enter a valid email address." };
  }

  return { ok: true, value };
}
