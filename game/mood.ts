import { CatState } from './types';

// Placeholder expressions (emoji). Replace with your Krita expression sprites later.
export type CatFace = '😴' | '😿' | '😾' | '😻' | '😺';

export function getCatFace(cat: CatState): CatFace {
  if (cat.sleepingUntil !== null) return '😴';
  const { hunger, energy, hygiene, happiness } = cat.needs;
  const lowest = Math.min(hunger, energy, hygiene, happiness);
  if (lowest <= 20) return '😿';
  if (lowest <= 40) return '😾';
  if (happiness >= 70) return '😻';
  return '😺';
}
