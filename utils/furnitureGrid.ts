import { SHELF_HEIGHT } from "@/components/cozy/ShelfBar";
import { FurnitureDef } from "@/data/bedroomFurniture";

export const GRID_COLS = 13; // must match RoomBackground: 12 squares across the room

// Must match RoomBackground: the wall starts at 12% of the room, the floor at 38% + the pink band.
const WALL_START = 0.12;
const WALL_END = 0.38;
const BAND_H = 18;

export interface Grid {
  cell: number; // size of one square in dp
  cols: number;
  rows: number;
  top: number; // y of row 0 inside the room
  floorRow: number; // first row that is floor
}

/** The decorate sheet covers the bottom SHELF_HEIGHT of the room, so the grid stops above it. */
export function makeGrid(w: number, h: number): Grid | null {
  if (w <= 0 || h <= 0) return null;
  const cell = w / GRID_COLS;
  const top = h * WALL_START;
  const usable = h - SHELF_HEIGHT - top;
  const rows = Math.max(5, Math.floor(usable / cell));
  const wallBottom = h * WALL_END + BAND_H;
  const floorRow = Math.min(
    rows - 2,
    Math.max(1, Math.floor((wallBottom - top) / cell)),
  );
  return { cell, cols: GRID_COLS, rows, top, floorRow };
}

type Size = Pick<FurnitureDef, "wc" | "hc" | "wall">;

/** How many whole grid squares a piece occupies. */
export const spanOf = (f: Size) => ({
  cw: Math.max(1, Math.ceil(f.wc - 0.001)),
  ch: Math.max(1, Math.ceil(f.hc - 0.001)),
});

/** Snaps to the grid and keeps the piece where it belongs: wall pieces fully on the wall, floor pieces with their feet on the floor. */
export function clampSpot(g: Grid, f: Size, col: number, row: number) {
  const { cw, ch } = spanOf(f);
  const c = Math.min(Math.max(0, Math.round(col)), Math.max(0, g.cols - cw));
  const minR = f.wall ? 0 : Math.max(0, g.floorRow - ch + 1);
  const maxR = f.wall
    ? Math.max(0, g.floorRow - ch)
    : Math.max(minR, g.rows - ch);
  const r = Math.min(Math.max(minR, Math.round(row)), maxR);
  return { col: c, row: r };
}

export interface Taken {
  col: number;
  row: number;
  cw: number;
  ch: number;
}

const overlaps = (a: Taken, b: Taken) =>
  a.col < b.col + b.cw &&
  b.col < a.col + a.cw &&
  a.row < b.row + b.ch &&
  b.row < a.row + a.ch;

/** First free spot, trying the middle of the room first. Falls back to the middle if the room is crowded. */
export function findFreeSpot(g: Grid, f: Size, taken: Taken[]) {
  const { cw, ch } = spanOf(f);
  const mid = clampSpot(g, f, (g.cols - cw) / 2, g.rows);
  const first = clampSpot(g, f, 0, 0);
  const last = clampSpot(g, f, 0, g.rows);
  const colOrder = Array.from({ length: g.cols - cw + 1 }, (_, i) => i).sort(
    (a, b) => Math.abs(a - mid.col) - Math.abs(b - mid.col),
  );
  for (let r = first.row; r <= last.row; r++) {
    for (const c of colOrder) {
      if (!taken.some((t) => overlaps(t, { col: c, row: r, cw, ch })))
        return { col: c, row: r };
    }
  }
  return mid;
}
