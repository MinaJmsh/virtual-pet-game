import React, { useMemo, useState } from 'react';
import { LayoutChangeEvent, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors, sketch } from '@/theme/tokens';

/**
 * Crayon-style outlines. The lines themselves are straight (same geometry as a normal border);
 * the "crayon" comes from the brush: a ragged, slightly uneven-width edge plus pale grain streaks
 * running along the stroke, like wax catching on paper. (react-native-svg has no feTurbulence
 * filter, so the roughness is built into the stroke outline itself.)
 */

interface P { x: number; y: number; nx: number; ny: number }
type Pt = [number, number];

const TUCK = 0.5; // line sits this much over the element's edge so the ragged edge never shows a gap
const STEP = 1.6; // fine sampling = fine-grained rough edge
const PI = Math.PI;

function rng(seed: number) {
  let s = (seed >>> 0) || 1;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function line(out: P[], x0: number, y0: number, x1: number, y1: number, nx: number, ny: number) {
  const n = Math.max(1, Math.round(Math.hypot(x1 - x0, y1 - y0) / STEP));
  for (let i = 0; i < n; i++) {
    const t = i / n;
    out.push({ x: x0 + (x1 - x0) * t, y: y0 + (y1 - y0) * t, nx, ny });
  }
}

function arc(out: P[], cx: number, cy: number, r: number, a0: number, a1: number) {
  const n = Math.max(3, Math.round((Math.abs(a1 - a0) * r) / STEP));
  for (let i = 0; i < n; i++) {
    const a = a0 + ((a1 - a0) * i) / n;
    out.push({ x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r, nx: Math.cos(a), ny: Math.sin(a) });
  }
}

/** w/h = overlay size; rc = corner radius of the centre line; inset = centre line distance from overlay edge; pad = distance of the element's own edge from the overlay edge. */
function rectPoints(w: number, h: number, rc: number, sides: 'all' | 'tab', inset: number, pad: number): P[] {
  const x0 = inset;
  const y0 = inset;
  const x1 = w - inset;
  const y1 = sides === 'tab' ? h - pad : h - inset;
  const r = Math.max(0, Math.min(rc, (x1 - x0) / 2, sides === 'tab' ? y1 - y0 : (y1 - y0) / 2));
  const out: P[] = [];
  if (sides === 'tab') {
    // open at the bottom: up the left side, over the top, down the right side
    line(out, x0, y1, x0, y0 + r, -1, 0);
    arc(out, x0 + r, y0 + r, r, PI, 1.5 * PI);
    line(out, x0 + r, y0, x1 - r, y0, 0, -1);
    arc(out, x1 - r, y0 + r, r, -PI / 2, 0);
    line(out, x1, y0 + r, x1, y1, 1, 0);
    out.push({ x: x1, y: y1, nx: 1, ny: 0 });
    return out;
  }
  line(out, x0 + r, y0, x1 - r, y0, 0, -1);
  arc(out, x1 - r, y0 + r, r, -PI / 2, 0);
  line(out, x1, y0 + r, x1, y1 - r, 1, 0);
  arc(out, x1 - r, y1 - r, r, 0, PI / 2);
  line(out, x1 - r, y1, x0 + r, y1, 0, 1);
  arc(out, x0 + r, y1 - r, r, PI / 2, PI);
  line(out, x0, y1 - r, x0, y0 + r, -1, 0);
  arc(out, x0 + r, y0 + r, r, PI, 1.5 * PI);
  return out;
}

const f = (n: number) => n.toFixed(2);
const poly = (pts: Pt[]) => pts.map((p, i) => `${i ? 'L' : 'M'}${f(p[0])} ${f(p[1])}`).join('');

/** The stroke as a filled outline whose two edges are ragged and whose thickness drifts slightly. */
function ribbon(pts: P[], width: number, seed: number, closed: boolean): string {
  const rand = rng(seed);
  const ph1 = rand() * 6.28;
  const ph2 = rand() * 6.28;
  const half = width / 2;
  const outer: Pt[] = [];
  const inner: Pt[] = [];
  let s = 0;
  let prev = pts[0];
  pts.forEach((p) => {
    s += Math.hypot(p.x - prev.x, p.y - prev.y);
    prev = p;
    const slow = 0.14 * Math.sin(s * 0.045 + ph1) + 0.1 * Math.sin(s * 0.13 + ph2); // pressure changes
    const eo = half + slow + (rand() - 0.5) * sketch.rough;
    const ei = half - slow + (rand() - 0.5) * sketch.rough;
    outer.push([p.x + p.nx * eo, p.y + p.ny * eo]);
    inner.push([p.x - p.nx * ei, p.y - p.ny * ei]);
  });
  if (closed) return `${poly(outer)}Z${poly(inner)}Z`;
  return `${poly(outer)}${poly(inner.reverse()).replace('M', 'L')}Z`;
}

/** Centre line, optionally pushed sideways: used for the grain streaks. */
function centre(pts: P[], shift: number, closed: boolean): string {
  return poly(pts.map((p) => [p.x + p.nx * shift, p.y + p.ny * shift] as Pt)) + (closed ? 'Z' : '');
}

const useSeed = () => useState(() => Math.floor(Math.random() * 1e9))[0];

interface DrawProps { pts: P[]; seed: number; color: string; width: number; closed: boolean }

function Crayon({ pts, seed, color, width, closed }: DrawProps) {
  const d = useMemo(
    () => ({
      body: ribbon(pts, width, seed, closed),
      streakA: centre(pts, width * 0.12, closed),
      streakB: centre(pts, -width * 0.18, closed),
    }),
    [pts, width, seed, closed],
  );
  return (
    <>
      <Path d={d.body} fill={color} fillRule="evenodd" />
      <Path d={d.streakA} fill="none" stroke={colors.creamWhite} strokeOpacity={sketch.grain} strokeWidth={width * 0.4} strokeDasharray="1.4 3.1 0.6 4.2 2.2 2.6 0.8 5.3" />
      <Path d={d.streakB} fill="none" stroke={colors.creamWhite} strokeOpacity={sketch.grain * 0.8} strokeWidth={width * 0.25} strokeDasharray="0.8 2.4 2.0 3.7 0.6 4.9 1.5 2.9" />
    </>
  );
}

interface BorderProps {
  radius?: number;
  color?: string;
  width?: number;
  sides?: 'all' | 'tab'; // 'tab' = open bottom, for folder tabs
  style?: StyleProp<ViewStyle>;
}

/**
 * Drop inside any View to give that View a crayon outline. The line is drawn OUTSIDE the View's edge
 * (the inner edge of the stroke sits exactly on the edge), so it never covers or shrinks the content.
 * Remove the View's own borderWidth, and don't put overflow: 'hidden' on the View itself.
 */
export function SketchBorder({ radius = 12, color = colors.outline, width = sketch.width, sides = 'all', style }: BorderProps) {
  const [size, setSize] = useState({ w: 0, h: 0 });
  const seed = useSeed();
  const half = width / 2;
  const pad = Math.ceil(width + sketch.rough + 1); // overlay sticks out this far on every side

  const pts = useMemo(
    () => (size.w > 0 && size.h > 0 ? rectPoints(size.w, size.h, radius + half - TUCK, sides, pad - half + TUCK, pad) : null),
    [size.w, size.h, radius, sides, half, pad],
  );
  const onLayout = (e: LayoutChangeEvent) => setSize({ w: e.nativeEvent.layout.width, h: e.nativeEvent.layout.height });

  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, { left: -pad, top: -pad, right: -pad, bottom: -pad }, style]} onLayout={onLayout}>
      {pts ? (
        <Svg width={size.w} height={size.h}>
          <Crayon pts={pts} seed={seed} color={color} width={width} closed={sides === 'all'} />
        </Svg>
      ) : null}
    </View>
  );
}

interface LineProps {
  color?: string;
  width?: number;
  style?: StyleProp<ViewStyle>;
}

/** A straight crayon line, full width of the box (8dp tall). Position it with `style`. */
export function SketchLine({ color = colors.outline, width = sketch.width, style }: LineProps) {
  const [w, setW] = useState(0);
  const seed = useSeed();
  const pts = useMemo(() => {
    if (w <= 0) return null;
    const out: P[] = [];
    line(out, 2, 4, w - 2, 4, 0, 1);
    out.push({ x: w - 2, y: 4, nx: 0, ny: 1 });
    return out;
  }, [w]);

  return (
    <View pointerEvents="none" style={[{ height: 8 }, style]} onLayout={(e) => setW(e.nativeEvent.layout.width)}>
      {pts ? (
        <Svg width={w} height={8}>
          <Crayon pts={pts} seed={seed} color={color} width={width} closed={false} />
        </Svg>
      ) : null}
    </View>
  );
}

interface PolygonProps {
  width: number;
  height: number;
  poly: Pt[]; // corner points, in order
  fill?: string;
  color?: string;
  strokeWidth?: number;
}

const chaikin = (pts: Pt[]): Pt[] => {
  const out: Pt[] = [];
  pts.forEach((a, i) => {
    const b = pts[(i + 1) % pts.length];
    out.push([0.75 * a[0] + 0.25 * b[0], 0.75 * a[1] + 0.25 * b[1]], [0.25 * a[0] + 0.75 * b[0], 0.25 * a[1] + 0.75 * b[1]]);
  });
  return out;
};

/** Filled shape with a crayon outline (used by the arrow buttons). Corners are rounded. */
export function SketchPolygon({ width, height, poly: corners, fill = colors.creamWhite, color = colors.outline, strokeWidth = sketch.width }: PolygonProps) {
  const seed = useSeed();
  const pts = useMemo(() => {
    let shape = corners;
    for (let i = 0; i < 3; i++) shape = chaikin(shape);
    const cx = shape.reduce((s, p) => s + p[0], 0) / shape.length;
    const cy = shape.reduce((s, p) => s + p[1], 0) / shape.length;
    const out: P[] = [];
    shape.forEach((a, i) => {
      const b = shape[(i + 1) % shape.length];
      const n = Math.max(1, Math.round(Math.hypot(b[0] - a[0], b[1] - a[1]) / STEP));
      let nx = -(b[1] - a[1]);
      let ny = b[0] - a[0];
      const len = Math.hypot(nx, ny) || 1;
      nx /= len;
      ny /= len;
      if (nx * (a[0] - cx) + ny * (a[1] - cy) < 0) { nx = -nx; ny = -ny; } // point outward
      for (let k = 0; k < n; k++) {
        const t = k / n;
        out.push({ x: a[0] + (b[0] - a[0]) * t, y: a[1] + (b[1] - a[1]) * t, nx, ny });
      }
    });
    return out;
  }, [corners]);

  return (
    <Svg width={width} height={height}>
      <Path d={`${poly(pts.map((p) => [p.x, p.y] as Pt))}Z`} fill={fill} />
      <Crayon pts={pts} seed={seed} color={color} width={strokeWidth} closed />
    </Svg>
  );
}
