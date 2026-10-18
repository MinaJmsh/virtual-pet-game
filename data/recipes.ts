import { IconSource } from "@/components/cozy/Illustration";
import { DISH_ICONS, INGREDIENT_ICONS } from "./foodIcons";

export interface Ingredient {
  id: string;
  name: string;
  description: string;
  icon: IconSource;
  infinite?: boolean; // always available
  price?: number; // sold in the shop when set
}

export type Station = "steamer" | "stock_pot" | "wok" | "frying_pan";

export interface Recipe {
  id: string;
  name: string;
  icon: IconSource;
  station: Station;
  ingredients: { id: string; amount: number }[];
  hungerGain: number;
  happinessGain?: number;
}

export const INGREDIENTS: Record<string, Ingredient> = {
  flour: { id: "flour", name: "Flour", description: "Soft white flour for buns and noodles.", icon: INGREDIENT_ICONS.flour, price: 2 },
  fish: { id: "fish", name: "Fish", description: "Fresh from the pond. Cats go wild for it.", icon: INGREDIENT_ICONS.fish, price: 5 },
  carrot: { id: "carrot", name: "Carrot", description: "Crunchy and sweet.", icon: INGREDIENT_ICONS.carrot, price: 3 },
  egg: { id: "egg", name: "Egg", description: "Smooth little eggs, good in everything.", icon: INGREDIENT_ICONS.egg, price: 3 },
  potato: { id: "potato", name: "Potato", description: "Hearty and filling.", icon: INGREDIENT_ICONS.potato, price: 3 },
  pork: { id: "pork", name: "Pork", description: "Tender pork for rich dishes.", icon: INGREDIENT_ICONS.pork, price: 6 },
  chili: { id: "chili", name: "Chili", description: "A little kick of spice.", icon: INGREDIENT_ICONS.chili, price: 2 },
  corn: { id: "corn", name: "Corn", description: "Golden sweet corn.", icon: INGREDIENT_ICONS.corn, price: 3 },
  scallion: { id: "scallion", name: "Scallion", description: "Fresh green topping.", icon: INGREDIENT_ICONS.scallion, price: 2 },
  sugar: { id: "sugar", name: "Sugar", description: "A pinch makes everything sweeter.", icon: INGREDIENT_ICONS.sugar, price: 2 },
  vinegar: { id: "vinegar", name: "Vinegar", description: "Tangy and bright.", icon: INGREDIENT_ICONS.vinegar, price: 2 },
  oil: { id: "oil", name: "Oil", description: "For frying and braising.", icon: INGREDIENT_ICONS.oil, price: 2 },
  soy_sauce: { id: "soy_sauce", name: "Soy sauce", description: "Salty, savory and deep.", icon: INGREDIENT_ICONS.soy_sauce, price: 2 },
  tomato: { id: "tomato", name: "Tomato", description: "Juicy red tomatoes.", icon: INGREDIENT_ICONS.tomato, price: 3 },
  milk: { id: "milk", name: "Milk", description: "Creamy milk. A little goes a long way.", icon: INGREDIENT_ICONS.milk, price: 4 },
  mango: { id: "mango", name: "Mango", description: "Sweet tropical fruit.", icon: INGREDIENT_ICONS.mango, price: 5 },
  strawberry: { id: "strawberry", name: "Strawberry", description: "Little red berries.", icon: INGREDIENT_ICONS.strawberry, price: 4 },
};

export const STARTING_INGREDIENTS: Record<string, number> = {
  fish: 3,
  flour: 6,
  egg: 3,
  potato: 3,
};

export const STATIONS: { key: Station; name: string }[] = [
  { key: "steamer", name: "Bamboo steamer" },
  { key: "stock_pot", name: "Stock pot" },
  { key: "wok", name: "Wok" },
  { key: "frying_pan", name: "Frying pan" },
];

type Ing = [string, number];

/** Hunger/happiness gain scale with how much goes into the dish. */
const mk = (station: Station, id: string, name: string, ings: Ing[]): Recipe => {
  const total = ings.reduce((s, [, n]) => s + n, 0);
  return {
    id,
    name,
    icon: DISH_ICONS[id],
    station,
    ingredients: ings.map(([i, amount]) => ({ id: i, amount })),
    hungerGain: Math.min(45, 8 + total * 3),
    happinessGain: ings.length >= 3 ? 6 : ings.length === 2 ? 3 : 0,
  };
};

export const RECIPES: Recipe[] = [
  // ---------- steamer ----------
  mk("steamer", "steamed_bun", "steamed bun", [["flour", 2]]),
  mk("steamer", "salmon_rice_ball", "salmon rice ball", [["fish", 2], ["flour", 2]]),
  mk("steamer", "veg_spring_roll", "vegetarian spring roll", [["flour", 3], ["carrot", 3], ["egg", 3]]),
  mk("steamer", "piggy_bun", "piggy bun", [["flour", 3], ["carrot", 3]]),
  mk("steamer", "soup_bun", "soup bun", [["flour", 3], ["pork", 3]]),
  mk("steamer", "chinese_hamburger", "chinese hamburger", [["flour", 3], ["carrot", 3], ["pork", 3]]),
  mk("steamer", "liangpi_noodles", "liangpi noodles", [["flour", 3], ["carrot", 3], ["chili", 1]]),
  mk("steamer", "steamed_pork_rice_powder", "steamed pork with rice powder", [["flour", 3], ["potato", 3], ["pork", 3]]),
  mk("steamer", "foo_young_egg", "foo young steamed egg", [["egg", 4]]),
  mk("steamer", "steamer_shrimp", "bamboo steamer shrimp", [["fish", 4]]),
  mk("steamer", "mashed_potatoes", "mashed potatoes", [["potato", 3], ["flour", 3]]),
  mk("steamer", "cantonese_rice_noodles", "cantonese steamed rice noodles", [["flour", 3], ["egg", 3]]),
  mk("steamer", "sticky_rice_meatballs", "sticky rice meatballs", [["flour", 3], ["pork", 3]]),
  mk("steamer", "shrimp_dumplings", "shrimp dumplings", [["flour", 3], ["fish", 3], ["corn", 3]]),
  mk("steamer", "potato_salad", "potato salad", [["potato", 3]]),
  mk("steamer", "sweet_corn_salad", "sweet corn salad", [["corn", 3]]),
  mk("steamer", "red_bean_cakes", "red bean paste cakes", [["flour", 3]]),
  mk("steamer", "bibimbap", "stone pot bibimbap", [["carrot", 3]]),
  mk("steamer", "three_delicacies", "three delicacies steamed dumplings", [["potato", 3], ["carrot", 3]]),

  // ---------- stock_pot ----------
  mk("stock_pot", "glutinous_rice_balls", "glutinous rice balls", [["flour", 3]]),
  mk("stock_pot", "dumpling", "dumpling", [["flour", 3], ["carrot", 3], ["pork", 3]]),
  mk("stock_pot", "plain_noodles", "plain noodles", [["flour", 3]]),
  mk("stock_pot", "tomato_ribs_soup", "tomato pork ribs soup", [["tomato", 3], ["pork", 3]]),
  mk("stock_pot", "milky_fish_soup", "milky fish soup", [["fish", 3], ["milk", 3]]),
  mk("stock_pot", "black_bean_noodles", "black bean sauce noodles", [["pork", 3], ["flour", 3], ["carrot", 3], ["soy_sauce", 1]]),
  mk("stock_pot", "borscht", "borscht", [["carrot", 3], ["potato", 3], ["pork", 3]]),
  mk("stock_pot", "congee", "congee with pork and century egg", [["egg", 3], ["pork", 3]]),
  mk("stock_pot", "hot_pot", "hot pot", [["pork", 4], ["fish", 4], ["potato", 4], ["oil", 1]]),
  mk("stock_pot", "sukiyaki", "sukiyaki", [["pork", 3], ["fish", 3], ["corn", 3]]),
  mk("stock_pot", "minced_pork_rice", "minced pork rice", [["pork", 3], ["potato", 3], ["egg", 3], ["soy_sauce", 1]]),
  mk("stock_pot", "army_stew", "army stew", [["flour", 3], ["carrot", 3], ["potato", 3], ["chili", 1]]),
  mk("stock_pot", "spaghetti", "spaghetti", [["pork", 3], ["flour", 3], ["tomato", 3]]),
  mk("stock_pot", "oden", "oden", [["flour", 3], ["fish", 3], ["corn", 3]]),
  mk("stock_pot", "boiled_sliced_fish", "boiled sliced fish", [["potato", 3], ["fish", 3], ["corn", 3], ["chili", 1]]),
  mk("stock_pot", "salted_yolk_zongzi", "salted yolk zongzi", [["flour", 3], ["egg", 3]]),
  mk("stock_pot", "cured_meat_zongzi", "cured meat zongzi", [["flour", 3], ["pork", 3]]),
  mk("stock_pot", "coconut_milk_sago", "coconut milk sago", [["flour", 3], ["mango", 3], ["sugar", 1]]),
  mk("stock_pot", "boiled_corn", "boiled corn", [["corn", 3]]),

  // ---------- wok ----------
  mk("wok", "dough_fritters", "dough fritters", [["flour", 3]]),
  mk("wok", "fried_zigzag_potato", "fried zigzag potato", [["potato", 3]]),
  mk("wok", "fried_sweet_rice_ball", "fried sweet rice ball", [["flour", 3]]),
  mk("wok", "shredded_potato", "stir-fried shredded potato", [["potato", 3]]),
  mk("wok", "braised_pork_ribs", "braised pork ribs", [["potato", 3], ["pork", 3]]),
  mk("wok", "yangzhou_fried_rice", "yangzhou fried rice", [["carrot", 3], ["egg", 3], ["scallion", 1]]),
  mk("wok", "crispy_fried_pork", "crispy fried pork", [["flour", 3], ["pork", 3]]),
  mk("wok", "fish_flavored_pork", "fish-flavored shredded pork", [["carrot", 3], ["pork", 3], ["sugar", 1], ["vinegar", 1]]),
  mk("wok", "crispy_sweet_sour_pork", "crispy sweet and sour pork", [["potato", 3], ["pork", 3]]),
  mk("wok", "braised_pork_ball", "braised pork ball", [["flour", 3], ["pork", 3], ["oil", 1]]),
  mk("wok", "french_fries", "french fries", [["potato", 3]]),
  mk("wok", "golden_corn", "golden corn", [["corn", 3], ["flour", 3], ["sugar", 1]]),
  mk("wok", "braised_pork_belly", "braised pork belly", [["pork", 3], ["soy_sauce", 1]]),
  mk("wok", "sweet_sour_spare_ribs", "sweet and sour spare ribs", [["pork", 3], ["sugar", 1], ["vinegar", 1]]),
  mk("wok", "double_cooked_pork", "double-cooked pork", [["pork", 3], ["carrot", 3]]),
  mk("wok", "poached_sliced_pork", "poached sliced pork", [["pork", 3], ["carrot", 3], ["potato", 3], ["chili", 1]]),
  mk("wok", "sweet_sour_pork", "sweet and sour pork", [["carrot", 3], ["corn", 3]]),
  mk("wok", "fried_chicken", "fried chicken", [["flour", 3], ["egg", 3], ["corn", 3]]),
  mk("wok", "egg_fried_rice", "egg fried rice", [["egg", 3]]),

  // ---------- frying_pan ----------
  mk("frying_pan", "omelet", "omelet", [["flour", 3], ["egg", 3], ["scallion", 1]]),
  mk("frying_pan", "dough_stick_pancake", "dough stick pancake", [["flour", 7], ["egg", 7]]),
  mk("frying_pan", "savory_pancake", "handheld savory pancake", [["flour", 3], ["egg", 3]]),
  mk("frying_pan", "sunny_side_up", "sunny side up egg", [["egg", 3]]),
  mk("frying_pan", "potato_pancake", "potato pancake", [["potato", 3], ["flour", 3]]),
  mk("frying_pan", "fried_spring_rolls", "fried spring rolls", [["flour", 3]]),
  mk("frying_pan", "curry_rice", "curry rice", [["potato", 3], ["carrot", 3], ["egg", 3]]),
  mk("frying_pan", "fish_and_chips", "fish and chips", [["fish", 3], ["potato", 3]]),
  mk("frying_pan", "fried_pork_chops", "fried pork chops", [["pork", 3]]),
  mk("frying_pan", "panfried_dumplings", "panfried dumplings", [["pork", 3], ["flour", 3]]),
  mk("frying_pan", "strawberry_tanghulu", "strawberry tanghulu", [["strawberry", 3], ["sugar", 1]]),
  mk("frying_pan", "sweet_corn_pizza", "sweet corn pizza", [["flour", 3], ["corn", 3]]),
];
