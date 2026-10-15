import { DECAY_PER_HOUR, MAX_OFFLINE_HOURS, SLEEP_RECOVERY_PER_HOUR } from './config';
import { GameState } from './types';

const HOUR_MS = 3_600_000;

export const clamp = (v: number) => Math.max(0, Math.min(100, v));

/** Applies real elapsed time to the cat's needs. Pure: returns a new state. */
export function applyElapsed(state: GameState, now: number): GameState {
  const elapsedMs = now - state.lastUpdated;
  if (elapsedMs <= 0) {
    // Clock went backwards or no time passed: never apply the same time twice.
    return state.lastUpdated > now ? { ...state, lastUpdated: now } : state;
  }

  const hours = Math.min(elapsedMs / HOUR_MS, MAX_OFFLINE_HOURS);
  const { sleepingUntil, needs } = state.cat;

  let sleepHours = 0;
  if (sleepingUntil !== null) {
    const sleepEnd = Math.min(now, sleepingUntil);
    sleepHours = Math.max(0, Math.min(hours, (sleepEnd - state.lastUpdated) / HOUR_MS));
  }
  const awakeHours = hours - sleepHours;

  const nextNeeds = {
    hunger: clamp(needs.hunger - DECAY_PER_HOUR.hunger * hours),
    hygiene: clamp(needs.hygiene - DECAY_PER_HOUR.hygiene * hours),
    happiness: clamp(needs.happiness - DECAY_PER_HOUR.happiness * hours),
    // Energy uses a separate rule: decay only while awake, recover while asleep.
    energy: clamp(needs.energy + SLEEP_RECOVERY_PER_HOUR * sleepHours - DECAY_PER_HOUR.energy * awakeHours),
  };

  const woke = sleepingUntil !== null && now >= sleepingUntil;

  return {
    ...state,
    lastUpdated: now,
    cat: { ...state.cat, needs: nextNeeds, sleepingUntil: woke ? null : sleepingUntil },
  };
}
