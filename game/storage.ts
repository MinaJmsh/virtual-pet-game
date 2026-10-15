import AsyncStorage from '@react-native-async-storage/async-storage';
import { ROOM_ORDER } from '@/data/rooms';
import { SAVE_KEY, SAVE_VERSION } from './config';
import { createInitialState } from './initialState';
import { clamp } from './needs';
import { GameState, NeedKey } from './types';

/** Merges whatever was saved over safe defaults so a broken (or older) save never crashes the game. */
function sanitize(raw: unknown): GameState {
  const base = createInitialState();
  if (!raw || typeof raw !== 'object') return base;
  const saved = raw as Partial<GameState>;

  const needs = { ...base.cat.needs };
  (Object.keys(needs) as NeedKey[]).forEach((k) => {
    const v = saved.cat?.needs?.[k];
    if (typeof v === 'number' && Number.isFinite(v)) needs[k] = clamp(v);
  });

  return {
    ...base,
    ...saved,
    saveVersion: SAVE_VERSION,
    lastUpdated: typeof saved.lastUpdated === 'number' ? saved.lastUpdated : base.lastUpdated,
    coins: typeof saved.coins === 'number' && saved.coins >= 0 ? saved.coins : base.coins,
    cat: { ...base.cat, ...saved.cat, needs },
    ingredients: { ...base.ingredients, ...saved.ingredients },
    meals: { ...saved.meals },
    ownedItems: Array.isArray(saved.ownedItems) ? saved.ownedItems : [],
    equipped: { ...saved.equipped },
    placed: { ...saved.placed },
    selectedRoom: saved.selectedRoom && ROOM_ORDER.includes(saved.selectedRoom) ? saved.selectedRoom : base.selectedRoom,
  };
}

export async function loadGame(): Promise<GameState> {
  try {
    const json = await AsyncStorage.getItem(SAVE_KEY);
    return json ? sanitize(JSON.parse(json)) : createInitialState();
  } catch {
    return createInitialState();
  }
}

export async function saveGame(state: GameState): Promise<void> {
  try {
    await AsyncStorage.setItem(SAVE_KEY, JSON.stringify(state));
  } catch {
    // Saving is best-effort; the next event will try again.
  }
}
