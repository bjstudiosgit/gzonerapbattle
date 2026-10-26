export const normalizeUsername = (value: string) => value.trim().toLowerCase();

export function validateUsername(value: string): string {
  if (!/^[a-z0-9][a-z0-9_]{2,23}$/.test(normalizeUsername(value))) {
    return "Use 3-24 letters, numbers or underscores. Start with a letter or number.";
  }
  return "";
}
