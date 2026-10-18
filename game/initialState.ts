import { STARTING_INGREDIENTS } from "@/data/recipes";
import { SAVE_VERSION, START_COINS, START_NEED } from "./config";
import { GameState } from "./types";

export function createInitialState(now: number = Date.now()): GameState {
  return {
    saveVersion: SAVE_VERSION,
    lastUpdated: now,
    coins: START_COINS,
    cat: {
      name: "Mochi",
      lifeStage: "kitten",
      needs: {
        hunger: START_NEED,
        energy: START_NEED,
        hygiene: START_NEED,
        happiness: START_NEED,
      },
      sleepingUntil: null,
      growthProgress: 0,
    },
    ingredients: { ...STARTING_INGREDIENTS },
    meals: {},
    ownedItems: ["futon_pink", "wooden_nightstand"],
    layout: {},
    equipped: {},
    placed: {},
    selectedRoom: "kitchen",
    lastPetAt: 0,
  };
}
