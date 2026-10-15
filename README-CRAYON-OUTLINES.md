# Crayon-outline update

This source bundle was reconstructed from the provided project source dump. The new `components/cozy/CrayonOutline.tsx` draws a slightly uneven, double-pass SVG outline to evoke the soft crayon/pencil borders in your reference image. It has been added to the shared outlined controls/cards (buttons, category pills, selected grid cells, popup, progress bar, currency pill, and toast), so the effect is reusable as you extend the UI.

To apply the effect to any additional outlined container, import `CrayonOutline` and place it as the final child inside a container with `position: 'relative'` (React Native views are normally positioned for absolute children), for example:

```tsx
<View style={styles.card}>
  {children}
  <CrayonOutline radius={14} />
</View>
```

The SVG overlay uses `pointerEvents="none"`, so it does not block taps. Existing native borders remain beneath the overlay; for the closest single-stroke look, set that container's native `borderColor` to `'transparent'` where the overlay is added. The full source dump did not include package metadata or image assets, so this ZIP contains the source files represented in the dump, not a complete runnable Expo repository.
