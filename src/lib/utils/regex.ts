/**
 * Escape special regex characters so user input can be safely used inside a
 * MongoDB $regex query without behaving as a pattern (prevents ReDoS/regex
 * injection from search inputs).
 */
export function escapeRegex(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
