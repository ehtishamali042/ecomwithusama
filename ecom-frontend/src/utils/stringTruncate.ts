/**
 * Truncates a string to a maximum length, appending '…' if it exceeds that length.
 * Handles null/undefined gracefully.
 * @param str The string to truncate
 * @param maxLength The maximum allowed length (default: 20)
 * @returns The truncated string with ellipsis if needed
 */
export function truncateString(
  str: string | null | undefined,
  maxLength = 20,
): string {
  if (!str) return "";
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + "…";
}
