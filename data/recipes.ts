export interface Ingredient {
  id: string;
  name: string;
  icon: string;
  infinite?: boolean; // always available, so the cat can always be fed
}

export interface Recipe {
  id: string;
  name: string;
  icon: string;
  ingredients: { id: string; amount: number }[];
  hungerGain: number;
  happinessGain?: number;
}

export const INGREDIENTS: Record<string, Ingredient> = {
  dry_food: { id: 'dry_food', name: 'Dry food', icon: '🍘', infinite: true },
  water: { id: 'water', name: 'Water', icon: '💧', infinite: true },
  fish: { id: 'fish', name: 'Fish', icon: '🐟' },
};

export const STARTING_INGREDIENTS: Record<string, number> = { fish: 3 };

export const RECIPES: Recipe[] = [
  { id: 'basic', name: 'Basic Meal', icon: '🥣', hungerGain: 35,
    ingredients: [{ id: 'dry_food', amount: 1 }, { id: 'water', amount: 1 }] },
  { id: 'fish_treat', name: 'Fish Treat', icon: '🍣', hungerGain: 25, happinessGain: 6,
    ingredients: [{ id: 'fish', amount: 1 }, { id: 'dry_food', amount: 1 }] },
  { id: 'special', name: 'Special Bowl', icon: '🍲', hungerGain: 45, happinessGain: 4,
    ingredients: [{ id: 'dry_food', amount: 2 }, { id: 'fish', amount: 2 }] },
];
