import { IconSource } from "@/components/cozy/Illustration";
import { EquipSlot, ItemCategory, RoomId } from "@/game/types";
import { BEDROOM_FURNITURE } from "./bedroomFurniture";
import { KITCHEN_FURNITURE } from "./kitchenFurniture";

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  icon: IconSource;
  category: ItemCategory;
  price: number;
  slot?: EquipSlot; // only outfits can be worn
  room?: RoomId; // furniture/decor belongs to one room
}

export const SHOP_ITEMS: ShopItem[] = [
  // hats
  {
    id: "bow",
    name: "Pink Bow",
    description: "A big pink bow. Instantly adorable.",
    icon: "🎀",
    category: "outfits",
    price: 25,
    slot: "head",
  },
  {
    id: "cap",
    name: "Sporty Cap",
    description: "A cap for adventurous cats on the go.",
    icon: "🧢",
    category: "outfits",
    price: 30,
    slot: "head",
  },
  {
    id: "top_hat",
    name: "Top Hat",
    description: "Very fancy. Tipping is optional.",
    icon: "🎩",
    category: "outfits",
    price: 40,
    slot: "head",
  },
  {
    id: "crown",
    name: "Little Crown",
    description: "For the royal ruler of the house.",
    icon: "👑",
    category: "outfits",
    price: 100,
    slot: "head",
  },

  // tops
  {
    id: "tshirt",
    name: "T-Shirt",
    description: "Casual and comfy for everyday naps.",
    icon: "👕",
    category: "outfits",
    price: 35,
    slot: "top",
  },
  {
    id: "sweater",
    name: "Cozy Sweater",
    description: "Soft knit that keeps your cat warm.",
    icon: "🧥",
    category: "outfits",
    price: 50,
    slot: "top",
  },
  {
    id: "dress",
    name: "Twirly Dress",
    description: "A twirly dress for special days.",
    icon: "👗",
    category: "outfits",
    price: 65,
    slot: "top",
  },

  // accessories
  {
    id: "bell",
    name: "Bell Collar",
    description: "Jingles sweetly whenever your cat walks.",
    icon: "🔔",
    category: "outfits",
    price: 25,
    slot: "neck",
  },
  {
    id: "scarf",
    name: "Cozy Scarf",
    description: "A long, warm scarf for chilly days.",
    icon: "🧣",
    category: "outfits",
    price: 45,
    slot: "neck",
  },
  {
    id: "medal",
    name: "Gold Medal",
    description: "Awarded to the best cat in town.",
    icon: "🏅",
    category: "outfits",
    price: 55,
    slot: "neck",
  },

  // kitchen: free-placement furniture
  ...KITCHEN_FURNITURE.map(
    (f): ShopItem => ({
      id: f.id,
      name: f.name,
      description: f.description,
      icon: f.icon,
      category: "furniture",
      price: f.price,
      room: "kitchen",
    }),
  ),

  // playroom
  {
    id: "sofa",
    name: "Sofa",
    description: "A soft sofa, perfect for post-game lounging.",
    icon: "🛋️",
    category: "furniture",
    price: 80,
    room: "playroom",
  },
  {
    id: "yarn",
    name: "Yarn Ball",
    description: "Endless fun to bat around.",
    icon: "🧶",
    category: "decor",
    price: 35,
    room: "playroom",
  },
  {
    id: "ball",
    name: "Ball",
    description: "Bouncy and ready to be chased.",
    icon: "⚽",
    category: "decor",
    price: 25,
    room: "playroom",
  },
  {
    id: "blocks",
    name: "Toy Blocks",
    description: "Colorful blocks for tiny architects.",
    icon: "🧩",
    category: "decor",
    price: 30,
    room: "playroom",
  },
  {
    id: "drum",
    name: "Drum",
    description: "Make some noise. Gently, please.",
    icon: "🥁",
    category: "decor",
    price: 45,
    room: "playroom",
  },

  // bathroom
  {
    id: "laundry",
    name: "Laundry Basket",
    description: "A handy basket for all the fluffy towels.",
    icon: "🧺",
    category: "furniture",
    price: 55,
    room: "bathroom",
  },
  {
    id: "duck",
    name: "Rubber Duck",
    description: "Bath time is better with a duck.",
    icon: "🦆",
    category: "decor",
    price: 30,
    room: "bathroom",
  },
  {
    id: "soap",
    name: "Soap",
    description: "Smells like fresh flowers.",
    icon: "🧼",
    category: "decor",
    price: 20,
    room: "bathroom",
  },
  {
    id: "toothbrush",
    name: "Toothbrush",
    description: "For a sparkling smile.",
    icon: "🪥",
    category: "decor",
    price: 20,
    room: "bathroom",
  },

  // bedroom: free-placement furniture
  ...BEDROOM_FURNITURE.map(
    (f): ShopItem => ({
      id: f.id,
      name: f.name,
      description: f.description,
      icon: f.icon,
      category: "furniture",
      price: f.price,
      room: "bedroom",
    }),
  ),
];

export const getItem = (id: string | null | undefined) =>
  SHOP_ITEMS.find((i) => i.id === id);
