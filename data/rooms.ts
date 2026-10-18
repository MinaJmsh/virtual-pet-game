import { RoomId } from "@/game/types";

// lamp: toggles sleep (bedroom). games: opens the mini games menu (playroom).
export type RoomAction = "lamp" | "games";
export const FREE_PLACEMENT_ROOMS: RoomId[] = ["bedroom"];
export const MAX_FURNITURE = 10;

export interface RoomObject {
  id: string;
  icon: string;
  altIcon?: string; // shown when the room is dark
  label?: string; // accessibility
  x: number; // % of room width
  y: number; // % of room height
  size: number;
  action?: RoomAction;
}

export const ROOM_ORDER: RoomId[] = [
  "kitchen",
  "playroom",
  "bathroom",
  "bedroom",
];

// Where decorations the player places appear (% of room width/height).
export const PLACE_SLOTS: [number, number][] = [
  [3, 36],
  [3, 52],
  [84, 52],
  [84, 36],
];
export const MAX_PLACED = PLACE_SLOTS.length;

export const ROOMS: Record<RoomId, { name: string; objects: RoomObject[] }> = {
  kitchen: {
    name: "Kitchen",
    objects: [
      { id: "fridge", icon: "🧊", x: 72, y: 4, size: 60 },
      { id: "pan", icon: "🍳", x: 12, y: 8, size: 48 },
      { id: "bowl", icon: "🥣", x: 68, y: 72, size: 46 },
    ],
  },
  playroom: {
    name: "Playroom",
    objects: [
      { id: "balloon", icon: "🎈", x: 14, y: 6, size: 52 },
      { id: "toys", icon: "🧸", x: 6, y: 72, size: 46 },
      {
        id: "arcade",
        icon: "🎮",
        label: "Mini games",
        x: 66,
        y: 62,
        size: 72,
        action: "games",
      },
    ],
  },
  bathroom: {
    name: "Bathroom",
    objects: [
      { id: "mirror", icon: "🪞", x: 14, y: 4, size: 60 },
      { id: "shower", icon: "🚿", x: 74, y: 5, size: 54 },
      { id: "tub", icon: "🛁", x: 62, y: 66, size: 70 },
    ],
  },
  bedroom: {
    name: "Bedroom",
    objects: [
      // { id: "window", icon: "🪟", x: 14, y: 4, size: 60 },
      {
        id: "lamp",
        icon: "💡",
        altIcon: "🌙",
        label: "Lamp",
        x: 76,
        y: 14,
        size: 52,
        action: "lamp",
      },
      // { id: 'bed', icon: '🛏️', x: 64, y: 66, size: 66 },
      // { id: 'plant', icon: '🪴', x: 6, y: 74, size: 44 },
    ],
  },
};
