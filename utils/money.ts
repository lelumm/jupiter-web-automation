/** Parses "$10.99" or "Total: 10.99" into integer cents, avoiding float rounding errors. */
export function toCents(text: string): number {
  const match = text.match(/\d+(?:\.\d+)?/);
  if (!match) throw new Error(`No amount found in "${text}"`);
  return Math.round(parseFloat(match[0]) * 100);
}
