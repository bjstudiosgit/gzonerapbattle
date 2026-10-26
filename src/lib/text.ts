export const DEFAULT_RESULT_CHARACTER_LIMIT = 310;

export function limitResultCopy(
  paragraphs: readonly string[],
  characterLimit = DEFAULT_RESULT_CHARACTER_LIMIT
): string {
  const copy = paragraphs.join(" ");
  if (copy.length <= characterLimit) return copy;

  const shortened = copy.slice(0, characterLimit + 1);
  const lastSpace = shortened.lastIndexOf(" ");
  return `${shortened
    .slice(0, lastSpace > 0 ? lastSpace : characterLimit)
    .trimEnd()}...`;
}
