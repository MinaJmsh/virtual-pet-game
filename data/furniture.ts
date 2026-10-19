import { BATHROOM_FURNITURE } from "./bathroomFurniture";
import { BEDROOM_FURNITURE, FurnitureDef } from "./bedroomFurniture";
import { KITCHEN_FURNITURE } from "./kitchenFurniture";
import { PLAYROOM_FURNITURE } from "./playroomFurniture";

/** Every piece that can be placed freely on a room grid, from all rooms. */
export const ALL_FURNITURE: FurnitureDef[] = [
  ...BEDROOM_FURNITURE,
  ...KITCHEN_FURNITURE,
  ...BATHROOM_FURNITURE,
  ...PLAYROOM_FURNITURE,
];

export const FURNITURE_BY_ID: Record<string, FurnitureDef> = Object.fromEntries(
  ALL_FURNITURE.map((f) => [f.id, f]),
);
