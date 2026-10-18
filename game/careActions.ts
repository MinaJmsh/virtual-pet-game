// Pure care/economy actions: (state, args) -> ActionResult. No React, no storage.
import { SHOP_ITEMS } from "@/data/items";
import { INGREDIENTS, RECIPES } from "@/data/recipes";
import { MAX_FURNITURE, MAX_PLACED } from "@/data/rooms";
import {
  BATH_GAIN,
  CARE_COIN_REWARD,
  NOT_HUNGRY_ABOVE,
  PET_COOLDOWN_MS,
  PET_GAIN,
  REWARD_NEED_THRESHOLD,
  SLEEP_RECOVERY_PER_HOUR,
} from "./config";
import { clamp } from "./needs";
import {
  ActionResult,
  CatState,
  EquipSlot,
  GameState,
  NeedKey,
  Needs,
  RoomId,
} from "./types";

const HOUR_MS = 3_600_000;

const fail = (state: GameState, message: string): ActionResult => ({
  state,
  ok: false,
  coins: 0,
  message,
});

function changeNeeds(cat: CatState, delta: Partial<Needs>): CatState {
  const needs = { ...cat.needs };
  (Object.keys(delta) as NeedKey[]).forEach((k) => {
    needs[k] = clamp(needs[k] + (delta[k] ?? 0));
  });
  return { ...cat, needs };
}

const isAsleep = (s: GameState) => s.cat.sleepingUntil !== null;
const earnIfNeeded = (value: number) =>
  value <= REWARD_NEED_THRESHOLD ? CARE_COIN_REWARD : 0;

/** Cooking uses ingredients and puts the dish on the kitchen shelf. It does NOT feed the cat. */
export function cook(state: GameState, recipeId: string): ActionResult {
  const recipe = RECIPES.find((r) => r.id === recipeId);
  if (!recipe) return fail(state, "Unknown recipe");

  const ingredients = { ...state.ingredients };
  for (const { id, amount } of recipe.ingredients) {
    if (INGREDIENTS[id]?.infinite) continue;
    if ((ingredients[id] ?? 0) < amount)
      return fail(state, `Not enough ${INGREDIENTS[id]?.name ?? id}`);
    ingredients[id] -= amount;
  }

  const meals = {
    ...state.meals,
    [recipeId]: (state.meals[recipeId] ?? 0) + 1,
  };
  return {
    state: { ...state, ingredients, meals },
    ok: true,
    coins: 0,
    message: `${recipe.name} is on the kitchen shelf!`,
  };
}

/** Feeds one cooked dish from the shelf to the cat (drag & drop in the kitchen). */
export function feedMeal(state: GameState, recipeId: string): ActionResult {
  const recipe = RECIPES.find((r) => r.id === recipeId);
  if (!recipe) return fail(state, "Unknown recipe");
  if (isAsleep(state)) return fail(state, "Shh… your cat is sleeping 💤");
  if ((state.meals[recipeId] ?? 0) < 1)
    return fail(state, "No more of that dish");
  if (state.cat.needs.hunger >= NOT_HUNGRY_ABOVE)
    return fail(state, "Not hungry right now");

  const meals = { ...state.meals, [recipeId]: state.meals[recipeId] - 1 };
  const earned = earnIfNeeded(state.cat.needs.hunger);
  const cat = changeNeeds(state.cat, {
    hunger: recipe.hungerGain,
    happiness: recipe.happinessGain ?? 0,
  });
  return {
    state: { ...state, meals, coins: state.coins + earned, cat },
    ok: true,
    coins: earned,
    message: earned ? `Yum! +${earned} coins` : "Yum!",
  };
}

export function bathe(state: GameState): ActionResult {
  if (isAsleep(state)) return fail(state, "Shh… your cat is sleeping 💤");
  const earned = earnIfNeeded(state.cat.needs.hygiene);
  return {
    state: {
      ...state,
      coins: state.coins + earned,
      cat: changeNeeds(state.cat, { hygiene: BATH_GAIN }),
    },
    ok: true,
    coins: earned,
    message: earned ? `Squeaky clean! +${earned} coins` : "Squeaky clean!",
  };
}

export function pet(state: GameState, now: number): ActionResult {
  if (isAsleep(state)) return fail(state, "Shh… your cat is sleeping 💤");
  if (now - state.lastPetAt < PET_COOLDOWN_MS) return fail(state, "");
  return {
    state: {
      ...state,
      lastPetAt: now,
      cat: changeNeeds(state.cat, { happiness: PET_GAIN }),
    },
    ok: true,
    coins: 0,
    message: "Purr… 💕",
  };
}

/** The bedroom lamp: lights off = sleep, lights on = wake up. */
export function toggleSleep(state: GameState, now: number): ActionResult {
  if (isAsleep(state)) {
    return {
      state: { ...state, cat: { ...state.cat, sleepingUntil: null } },
      ok: true,
      coins: 0,
      message: "Good morning!",
    };
  }
  const energy = state.cat.needs.energy;
  if (energy >= 95) return fail(state, "Not sleepy yet");
  const sleepMs = ((100 - energy) / SLEEP_RECOVERY_PER_HOUR) * HOUR_MS;
  return {
    state: { ...state, cat: { ...state.cat, sleepingUntil: now + sleepMs } },
    ok: true,
    coins: 0,
    message: "Sweet dreams 💤",
  };
}

/** Generic mini-game payout. */
export function claimReward(
  state: GameState,
  coins: number,
  fish = 0,
): ActionResult {
  const earned = Math.max(0, Math.floor(coins));
  const gotFish = Math.max(0, Math.floor(fish));
  const parts = [`+${earned} coins`];
  if (gotFish) parts.push(`+${gotFish} fish`);
  return {
    state: {
      ...state,
      coins: state.coins + earned,
      ingredients: {
        ...state.ingredients,
        fish: (state.ingredients.fish ?? 0) + gotFish,
      },
    },
    ok: true,
    coins: earned,
    message: parts.join(" · "),
  };
}

export function buy(state: GameState, itemId: string): ActionResult {
  const item = SHOP_ITEMS.find((i) => i.id === itemId);
  if (!item) return fail(state, "Unknown item");
  if (state.ownedItems.includes(itemId)) return fail(state, "Already owned");
  if (state.coins < item.price) return fail(state, "Not enough coins");
  return {
    state: {
      ...state,
      coins: state.coins - item.price,
      ownedItems: [...state.ownedItems, itemId],
    },
    ok: true,
    coins: -item.price,
    message: `Bought ${item.name}!`,
  };
}

export function toggleEquip(state: GameState, itemId: string): ActionResult {
  const item = SHOP_ITEMS.find((i) => i.id === itemId);
  if (!item?.slot) return fail(state, "Can't wear that");
  if (!state.ownedItems.includes(itemId)) return fail(state, "Buy it first");
  const wearing = state.equipped[item.slot] === itemId;
  return {
    state: {
      ...state,
      equipped: { ...state.equipped, [item.slot]: wearing ? null : itemId },
    },
    ok: true,
    coins: 0,
    message: wearing ? `Took off ${item.name}` : `Wearing ${item.name}!`,
  };
}

export function unequipSlot(state: GameState, slot: EquipSlot): ActionResult {
  return {
    state: { ...state, equipped: { ...state.equipped, [slot]: null } },
    ok: true,
    coins: 0,
    message: "Took it off",
  };
}

/** Puts a furniture/decor item in a room, or takes it out if it is already there. An item lives in one room at a time. */
export function togglePlace(
  state: GameState,
  itemId: string,
  room: RoomId,
): ActionResult {
  const item = SHOP_ITEMS.find((i) => i.id === itemId);
  if (!item || item.category === "outfits")
    return fail(state, "Can't place that");
  if (!state.ownedItems.includes(itemId)) return fail(state, "Buy it first");

  const here = state.placed[room] ?? [];
  if (here.includes(itemId)) {
    return {
      state: {
        ...state,
        placed: { ...state.placed, [room]: here.filter((id) => id !== itemId) },
      },
      ok: true,
      coins: 0,
      message: `Removed ${item.name}`,
    };
  }
  if (here.length >= MAX_PLACED) return fail(state, "This room is full");

  const placed: GameState["placed"] = {};
  (Object.keys(state.placed) as RoomId[]).forEach((r) => {
    placed[r] = (state.placed[r] ?? []).filter((id) => id !== itemId);
  });
  placed[room] = [...(placed[room] ?? []), itemId];
  return {
    state: { ...state, placed },
    ok: true,
    coins: 0,
    message: `Placed ${item.name}`,
  };
}

/** Buys one unit of a shop ingredient (fish, chicken, milk...). */
export function buyIngredient(state: GameState, id: string): ActionResult {
  const ing = INGREDIENTS[id];
  if (!ing || ing.price === undefined) return fail(state, "Can't buy that");
  if (state.coins < ing.price) return fail(state, "Not enough coins");
  return {
    state: {
      ...state,
      coins: state.coins - ing.price,
      ingredients: {
        ...state.ingredients,
        [id]: (state.ingredients[id] ?? 0) + 1,
      },
    },
    ok: true,
    coins: -ing.price,
    message: `Bought ${ing.name}!`,
  };
}
export function placeFurniture(
  state: GameState,
  itemId: string,
  room: RoomId,
  col: number,
  row: number,
): ActionResult {
  const item = SHOP_ITEMS.find((i) => i.id === itemId);
  if (!item || item.room !== room || item.category === "outfits")
    return fail(state, "Can't place that");
  if (!state.ownedItems.includes(itemId)) return fail(state, "Buy it first");
  const here = state.layout[room] ?? [];
  const existing = here.some((p) => p.id === itemId);
  if (!existing && here.length >= MAX_FURNITURE)
    return fail(state, "This room is full");
  const next = existing
    ? here.map((p) => (p.id === itemId ? { ...p, col, row } : p))
    : [...here, { id: itemId, col, row }];
  return {
    state: { ...state, layout: { ...state.layout, [room]: next } },
    ok: true,
    coins: 0,
    message: existing ? "Moved" : `Placed ${item.name}`,
  };
}

export function removeFurniture(
  state: GameState,
  itemId: string,
  room: RoomId,
): ActionResult {
  const item = SHOP_ITEMS.find((i) => i.id === itemId);
  const here = state.layout[room] ?? [];
  return {
    state: {
      ...state,
      layout: { ...state.layout, [room]: here.filter((p) => p.id !== itemId) },
    },
    ok: true,
    coins: 0,
    message: `Removed ${item?.name ?? "item"}`,
  };
}
