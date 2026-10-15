// Pure fishing rules: spawning fish and turning a round into rewards.
import { FISHING_MAX_COINS } from './config';
import { ActionResult, GameState } from './types';

export interface Fish {
  id: number;
  emoji: string;
  points: number;
  y: number; // 0..1 vertical position in the pond
  durationMs: number; // time to cross the pond
  fromLeft: boolean;
  expiresAt: number;
}

const FISH_TYPES = [
  { emoji: '🐟', points: 1, minMs: 2600, maxMs: 3600, weight: 6 },
  { emoji: '🐠', points: 2, minMs: 1900, maxMs: 2600, weight: 3 },
  { emoji: '🐡', points: 3, minMs: 1400, maxMs: 2000, weight: 1 },
];

function pickType() {
  const total = FISH_TYPES.reduce((sum, t) => sum + t.weight, 0);
  let roll = Math.random() * total;
  for (const t of FISH_TYPES) {
    roll -= t.weight;
    if (roll <= 0) return t;
  }
  return FISH_TYPES[0];
}

export function spawnFish(id: number, now: number = Date.now()): Fish {
  const t = pickType();
  const durationMs = t.minMs + Math.random() * (t.maxMs - t.minMs);
  return {
    id,
    emoji: t.emoji,
    points: t.points,
    y: 0.05 + Math.random() * 0.85,
    durationMs,
    fromLeft: Math.random() < 0.5,
    expiresAt: now + durationMs + 150,
  };
}

export const coinsForScore = (score: number) => Math.min(FISHING_MAX_COINS, Math.max(0, Math.floor(score)));

/** Pays out a finished round: coins from the score (capped) and every fish you caught goes to your fish stock. */
export function claimFishing(state: GameState, score: number, caught: number): ActionResult {
  const coins = coinsForScore(score);
  const fish = Math.max(0, Math.floor(caught));
  const ingredients = { ...state.ingredients, fish: (state.ingredients.fish ?? 0) + fish };
  const parts = [`+${coins} coins`];
  if (fish) parts.push(`+${fish} fish`);
  return {
    state: { ...state, coins: state.coins + coins, ingredients },
    ok: true,
    coins,
    message: parts.join(' · '),
  };
}
