export type NeedKey = "hunger" | "energy" | "hygiene" | "happiness";
export type Needs = Record<NeedKey, number>;
export type LifeStage = "kitten" | "young" | "adult";
export type RoomId = "kitchen" | "playroom" | "bathroom" | "bedroom";
export type ItemCategory = "outfits" | "furniture" | "decor";
export type EquipSlot = "head" | "neck" | "top";
export interface PlacedItem {
  id: string;
  col: number; // grid column
  row: number; // grid row
}
export interface CatState {
  name: string;
  lifeStage: LifeStage;
  needs: Needs;
  sleepingUntil: number | null;
  growthProgress: number;
}

export interface GameState {
  saveVersion: number;
  lastUpdated: number;
  coins: number;
  cat: CatState;
  ingredients: Record<string, number>;
  meals: Record<string, number>; // cooked dishes on the kitchen shelf, by recipe id
  ownedItems: string[];
  equipped: Partial<Record<EquipSlot, string | null>>;
  placed: Partial<Record<RoomId, string[]>>; // decorations placed per room
  selectedRoom: RoomId;
  lastPetAt: number;
  layout: Partial<Record<RoomId, PlacedItem[]>>; // free-placement furniture per room
}

export interface ActionResult {
  state: GameState;
  ok: boolean;
  coins: number;
  message: string;
}
