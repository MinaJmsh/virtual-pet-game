import { RoomId } from "@/game/types";

// lamp: toggles sleep (bedroom). games: opens the mini games menu (playroom).
export type RoomAction = "lamp" | "games";
// Rooms where furniture is placed freely on a grid.
export const FREE_PLACEMENT_ROOMS: RoomId[] = [
  "bedroom",
  "kitchen",
  "bathroom",
  "playroom",
];
export const MAX_FURNITURE = 100;

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
    objects: [{ id: "bowl", icon: "🥣", x: 68, y: 72, size: 46 }],
  },
  playroom: {
    name: "Playroom",
    objects: [
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
    objects: [],
  },
  bedroom: {
    name: "Bedroom",
    objects: [
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
    ],
  },
};
