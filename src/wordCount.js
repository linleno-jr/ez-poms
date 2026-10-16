export const MIN_WORDS = 26; // must be greater than 25
export const MAX_WORDS = 40; // no more than 40

export function countWords(text) {
  const trimmed = text.trim();
  return trimmed ? trimmed.split(/\s+/).length : 0;
}

export function getStatus(count) {
  if (count < MIN_WORDS) return "short";
  if (count > MAX_WORDS) return "long";
  return "valid";
}
