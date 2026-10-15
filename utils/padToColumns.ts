// Pads a list with nulls so the last grid row keeps equal-width cells.
export function padToColumns<T>(items: T[], columns: number): (T | null)[] {
  const remainder = items.length % columns;
  if (remainder === 0) return items;
  return [...items, ...Array<null>(columns - remainder).fill(null)];
}
