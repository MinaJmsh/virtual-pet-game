// Single source of truth for the cozy kawaii look. Never hard-code values in screens.
export const colors = {
  outline: "#7B5549",
  outlineSoft: "#B9A59B",
  textPrimary: "#6A5048",
  textSecondary: "#8C746B",
  bgApp: "#F6F3EA",
  cardFill: "#EFE8DB",
  cardFillPressed: "#E6DDCC",
  scrollTrack: "#E3DACA",
  coral: "#FFB8AB",
  coralPressed: "#F5A292",
  pinkLight: "#FFE3DD",
  ginghamA: "#FBD6D1",
  ginghamB: "#FDE6E2",
  ginghamStripe: "#F8B9B0",
  accentRed: "#E8504A",
  creamWhite: "#FFFDF6",
  floorA: "#FBE3D0",
  floorB: "#FFF5E2",
  wallCream: "#FBF1DC",
  wallStripe: "#F4E7C8",
  wallBorderPink: "#F6D3C6",
  wallTopGreen: "#DDE5D3",
  disabledFill: "#E8E2D6",
  disabledText: "#B5A89F",
  backdrop: "rgba(107,74,63,0.35)",
  water: "#D3E6E2",
  waterWave: "#BBD6D2",
} as const;

export type ColorName = keyof typeof colors;

export const radii = {
  pill: 999,
  card: 14,
  cell: 16,
  button: 12,
  tab: 12,
  banner: 12,
  small: 8,
} as const;
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
} as const;
export const outlineWidth = { regular: 1.5, thin: 1 } as const;
export const sizes = { minTap: 44, headerHeight: 118 } as const;

export const fonts = {
  medium: "Nunito_500Medium",
  semibold: "Nunito_600SemiBold",
} as const;

export const typography = {
  title: { fontFamily: fonts.semibold, fontSize: 16 },
  titleSmall: { fontFamily: fonts.medium, fontSize: 13 },
  label: { fontFamily: fonts.medium, fontSize: 12 },
  caption: { fontFamily: fonts.medium, fontSize: 11 },
  numberLarge: { fontFamily: fonts.semibold, fontSize: 15 },
} as const;

export type TypographyVariant = keyof typeof typography;

// Crayon outline look: straight lines with a rough, grainy brush edge.
// width = line thickness (dp), rough = how ragged the edge is (dp), grain = opacity of the paper-streaks.
export const sketch = { width: 2.6, rough: 0.7, grain: 0.3 } as const;
