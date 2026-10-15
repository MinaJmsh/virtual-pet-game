// Pure bubble-pop rules.
import { BUBBLE_MAX_COINS } from './config';

export interface Bubble {
  id: number;
  emoji: string;
  points: number;
  x: number; // 0..1 horizontal position
  durationMs: number; // time to float to the top
  expiresAt: number;
}

const TYPES = [
  { emoji: '🫧', points: 1, minMs: 3200, maxMs: 4400, weight: 6 },
  { emoji: '🎈', points: 2, minMs: 2400, maxMs: 3200, weight: 3 },
  { emoji: '⭐', points: 3, minMs: 1800, maxMs: 2400, weight: 1 },
];

export function spawnBubble(id: number, now: number = Date.now()): Bubble {
  const total = TYPES.reduce((s, t) => s + t.weight, 0);
  let roll = Math.random() * total;
  let t = TYPES[0];
  for (const type of TYPES) {
    roll -= type.weight;
    if (roll <= 0) { t = type; break; }
  }
  const durationMs = t.minMs + Math.random() * (t.maxMs - t.minMs);
  return { id, emoji: t.emoji, points: t.points, x: Math.random(), durationMs, expiresAt: now + durationMs + 150 };
}

export const coinsForBubbles = (score: number) => Math.min(BUBBLE_MAX_COINS, Math.max(0, Math.floor(score)));
