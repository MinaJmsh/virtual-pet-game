# Pet Game — Crayon Border Update

This archive was reconstructed from the 70 source files in the original pasted-code dump.

## What changed
- Added `components/cozy/CrayonOutline.tsx` for irregular, doubled hand-drawn outlines.
- Added `components/cozy/CrayonLine.tsx` for rough horizontal divider lines.
- Updated shared UI components and key screens to use the textured outlines instead of clean native brown borders.
- Preserved the existing source files and game logic from the pasted dump.

## How to use
Copy the included source folders (`app`, `components`, `data`, `game`, `hooks`, `screens`, `theme`, and `utils`) into your existing Expo project folder and allow the updated source files to replace the matching ones.

**Important:** The original pasted dump did not include `package.json`, app configuration, image assets, or other project-root files, so this archive does not invent or replace those. Keep your existing project-root files and assets.

The project already referenced `react-native-svg` in its original source, so the new outline components use that same dependency.
