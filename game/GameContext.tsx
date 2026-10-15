import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { AppState } from 'react-native';
import * as actions from './careActions';
import { TICK_MS } from './config';
import { claimFishing } from './fishing';
import { applyElapsed } from './needs';
import { loadGame, saveGame } from './storage';
import { ActionResult, EquipSlot, GameState, RoomId } from './types';

interface GameApi {
  state: GameState;
  cook: (recipeId: string) => ActionResult;
  feedMeal: (recipeId: string) => ActionResult;
  bathe: () => ActionResult;
  pet: () => ActionResult;
  toggleSleep: () => ActionResult;
  buy: (itemId: string) => ActionResult;
  toggleEquip: (itemId: string) => ActionResult;
  unequip: (slot: EquipSlot) => ActionResult;
  togglePlace: (itemId: string, room: RoomId) => ActionResult;
  claimFishing: (score: number, caught: number) => ActionResult;
  claimReward: (coins: number, fish?: number) => ActionResult;
  selectRoom: (room: RoomId) => void;
}

const GameContext = createContext<GameApi | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<GameState | null>(null);
  const ref = useRef<GameState | null>(null);

  const commit = useCallback((next: GameState) => {
    ref.current = next;
    setState(next);
    saveGame(next);
  }, []);

  const tick = useCallback(() => {
    if (ref.current) commit(applyElapsed(ref.current, Date.now()));
  }, [commit]);

  // Load once, then catch up on offline time.
  useEffect(() => {
    loadGame().then((saved) => commit(applyElapsed(saved, Date.now())));
  }, [commit]);

  // Keep time moving while the app is open and when it returns to the foreground.
  useEffect(() => {
    const id = setInterval(tick, TICK_MS);
    const sub = AppState.addEventListener('change', (status) => {
      if (status === 'active') tick();
      else if (ref.current) saveGame(ref.current);
    });
    return () => {
      clearInterval(id);
      sub.remove();
    };
  }, [tick]);

  const run = useCallback(
    (fn: (s: GameState, now: number) => ActionResult): ActionResult => {
      const now = Date.now();
      const base = applyElapsed(ref.current as GameState, now);
      const result = fn(base, now);
      commit(result.state);
      return result;
    },
    [commit],
  );

  const api = useMemo<GameApi | null>(() => {
    if (!state) return null;
    return {
      state,
      cook: (id) => run((s) => actions.cook(s, id)),
      feedMeal: (id) => run((s) => actions.feedMeal(s, id)),
      bathe: () => run((s) => actions.bathe(s)),
      pet: () => run((s, now) => actions.pet(s, now)),
      toggleSleep: () => run((s, now) => actions.toggleSleep(s, now)),
      buy: (id) => run((s) => actions.buy(s, id)),
      toggleEquip: (id) => run((s) => actions.toggleEquip(s, id)),
      unequip: (slot) => run((s) => actions.unequipSlot(s, slot)),
      togglePlace: (id, room) => run((s) => actions.togglePlace(s, id, room)),
      claimFishing: (score, caught) => run((s) => claimFishing(s, score, caught)),
      claimReward: (coins, fish) => run((s) => actions.claimReward(s, coins, fish)),
      selectRoom: (room) => commit({ ...applyElapsed(ref.current as GameState, Date.now()), selectedRoom: room }),
    };
  }, [state, run, commit]);

  if (!api) return null; // still loading the save
  return <GameContext.Provider value={api}>{children}</GameContext.Provider>;
}

export function useGame(): GameApi {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used inside <GameProvider>');
  return ctx;
}
