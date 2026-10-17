import { spacing } from "@/theme/tokens";
import { useWindowDimensions } from "react-native";

export const GRID_COLUMNS = 3;
export const GRID_PAD_RIGHT = 18; // room for the always-visible scrollbar

/** One exact square size for every cell in the 3-column grids (items, "+", etc.), from the screen width. */
export function useGridCellSize(): number {
  const { width } = useWindowDimensions();
  return Math.floor(
    (width - spacing.sm - GRID_PAD_RIGHT - spacing.sm * (GRID_COLUMNS - 1)) /
      GRID_COLUMNS,
  );
}
