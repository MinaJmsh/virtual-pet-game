import { IconSource } from "@/components/cozy/Illustration";
import { EquipSlot, ItemCategory, RoomId } from "@/game/types";
import { BATHROOM_FURNITURE } from "./bathroomFurniture";
import { BEDROOM_FURNITURE } from "./bedroomFurniture";
import { KITCHEN_FURNITURE } from "./kitchenFurniture";
import { PLAYROOM_FURNITURE } from "./playroomFurniture";

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

/** Turns a room's free-placement furniture list into shop items. */
const furnitureItems = (
  list: {
    id: string;
    name: string;
    description: string;
    icon: IconSource;
    price: number;
  }[],
  room: RoomId,
): ShopItem[] =>
  list.map((f) => ({
    id: f.id,
    name: f.name,
    description: f.description,
    icon: f.icon,
    category: "furniture",
    price: f.price,
    room,
  }));

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

  // furniture: every room uses free placement on a grid
  ...furnitureItems(KITCHEN_FURNITURE, "kitchen"),
  ...furnitureItems(PLAYROOM_FURNITURE, "playroom"),
  ...furnitureItems(BATHROOM_FURNITURE, "bathroom"),
  ...furnitureItems(BEDROOM_FURNITURE, "bedroom"),
];

export const getItem = (id: string | null | undefined) =>
  SHOP_ITEMS.find((i) => i.id === id);
