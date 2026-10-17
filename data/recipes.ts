export interface Ingredient {
  id: string;
  name: string;
  description: string;
  icon: string;
  infinite?: boolean; // always available, so the cat can always be fed
  price?: number; // sold in the shop when set
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
  dry_food: {
    id: "dry_food",
    name: "Dry food",
    description: "Crunchy kibble. Always in the pantry.",
    icon: "🍘",
    infinite: true,
  },
  water: {
    id: "water",
    name: "Water",
    description: "Fresh and clean. Always available.",
    icon: "💧",
    infinite: true,
  },
  fish: {
    id: "fish",
    name: "Fish",
    description: "Fresh from the pond. Cats go wild for it.",
    icon: "🐟",
    price: 8,
  },
  chicken: {
    id: "chicken",
    name: "Chicken",
    description: "Tender chicken for a hearty meal.",
    icon: "🍗",
    price: 12,
  },
  milk: {
    id: "milk",
    name: "Milk",
    description: "Creamy milk. A little goes a long way.",
    icon: "🥛",
    price: 6,
  },
};

export const STARTING_INGREDIENTS: Record<string, number> = { fish: 3 };

export const RECIPES: Recipe[] = [
  {
    id: "basic",
    name: "Basic Meal",
    icon: "🥣",
    hungerGain: 35,
    ingredients: [
      { id: "dry_food", amount: 1 },
      { id: "water", amount: 1 },
    ],
  },
  {
    id: "basic2",
    name: "burger",
    icon: "🍔",
    hungerGain: 35,
    ingredients: [
      { id: "dry_food", amount: 1 },
      { id: "water", amount: 1 },
    ],
  },
  {
    id: "fish_treat",
    name: "Fish Treat",
    icon: "🍣",
    hungerGain: 25,
    happinessGain: 6,
    ingredients: [
      { id: "fish", amount: 1 },
      { id: "dry_food", amount: 1 },
    ],
  },
  {
    id: "warm_milk",
    name: "Warm Milk",
    icon: "🍼",
    hungerGain: 15,
    happinessGain: 8,
    ingredients: [
      { id: "milk", amount: 1 },
      { id: "water", amount: 1 },
    ],
  },
  {
    id: "chicken_bowl",
    name: "Chicken Bowl",
    icon: "🍗",
    hungerGain: 40,
    happinessGain: 5,
    ingredients: [
      { id: "chicken", amount: 1 },
      { id: "dry_food", amount: 1 },
    ],
  },
  {
    id: "special",
    name: "Special Bowl",
    icon: "🍲",
    hungerGain: 45,
    happinessGain: 4,
    ingredients: [
      { id: "dry_food", amount: 2 },
      { id: "fish", amount: 2 },
    ],
  },
];
