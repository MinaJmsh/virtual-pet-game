import { FurnitureDef } from "@/data/bedroomFurniture";
import { FURNITURE_BY_ID } from "@/data/furniture";
import { PlacedItem } from "@/game/types";
import { colors } from "@/theme/tokens";
import { clampSpot, Grid, spanOf } from "@/utils/furnitureGrid";
import { FontAwesome6 } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
  PanResponder,
  Pressable,
  StyleSheet,
  View,
} from "react-native";

interface Box {
  col: number;
  row: number;
  cw: number;
  ch: number;
}

interface Props {
  grid: Grid;
  items: PlacedItem[];
  editable: boolean; // decorate mode: items can be selected, dragged and removed
  dark?: boolean; // lights off
  onMove: (id: string, col: number, row: number) => void;
  onRemove: (id: string) => void;
}

/** Furniture placed on the room grid. Wall pieces draw first, then floor pieces from the back to the front. */
export function FurnitureLayer({
  grid,
  items,
  editable,
  dark,
  onMove,
  onRemove,
}: Props) {
  const [preview, setPreview] = useState<Box | null>(null); // where a piece being dragged would land
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const list = items
    .map((p) => ({ p, def: FURNITURE_BY_ID[p.id] }))
    .filter((x): x is { p: PlacedItem; def: FurnitureDef } => !!x.def)
    .map((x) => {
      const spot = clampSpot(grid, x.def, x.p.col, x.p.row);
      return { ...x, spot, base: spot.row + spanOf(x.def).ch };
    })
    .sort((a, b) => Number(b.def.wall) - Number(a.def.wall) || a.base - b.base);

  const sel = editable ? list.find((x) => x.p.id === selectedId) : undefined;
  const selBox: Box | null = sel
    ? { col: sel.spot.col, row: sel.spot.row, ...spanOf(sel.def) }
    : null;
  // While dragging, the dashed box shows the landing spot; otherwise it frames the selected piece.
  const box = preview ?? selBox;
  const showDelete = !!sel && !preview;

  return (
    <View
      pointerEvents={editable ? "box-none" : "none"}
      style={[StyleSheet.absoluteFill, dark && { opacity: 0.65 }]}
    >
      {/* Tap on empty space to deselect. */}
      {showDelete ? (
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={() => setSelectedId(null)}
          accessibilityLabel="Deselect"
        />
      ) : null}
      {box ? (
        <View
          pointerEvents="none"
          style={[
            styles.box,
            {
              left: box.col * grid.cell,
              top: grid.top + box.row * grid.cell,
              width: box.cw * grid.cell,
              height: box.ch * grid.cell,
            },
          ]}
        />
      ) : null}
      {list.map(({ p, def, spot }) => (
        <FurnitureItem
          key={p.id}
          grid={grid}
          def={def}
          id={p.id}
          spot={spot}
          editable={editable}
          onMove={onMove}
          onPreview={setPreview}
          onSelect={(id) => setSelectedId((cur) => (cur === id ? null : id))}
        />
      ))}
      {showDelete && sel && selBox ? (
        <Pressable
          onPress={() => {
            setSelectedId(null);
            onRemove(sel.p.id);
          }}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel={`Remove ${sel.def.name}`}
          style={[
            styles.delete,
            {
              left: (selBox.col + selBox.cw) * grid.cell - 26,
              top: grid.top + selBox.row * grid.cell + 2,
            },
          ]}
        >
          <FontAwesome6 name="xmark" size={12} color={colors.creamWhite} />
        </Pressable>
      ) : null}
    </View>
  );
}

interface ItemProps {
  grid: Grid;
  def: FurnitureDef;
  id: string;
  spot: { col: number; row: number };
  editable: boolean;
  onMove: (id: string, col: number, row: number) => void;
  onPreview: (b: Box | null) => void;
  onSelect: (id: string) => void;
}

function FurnitureItem({
  grid,
  def,
  id,
  spot,
  editable,
  onMove,
  onPreview,
  onSelect,
}: ItemProps) {
  const { cw, ch } = spanOf(def);
  const pan = useRef(new Animated.ValueXY()).current;
  const [dragging, setDragging] = useState(false);
  // The responder is created once, so it reads the latest props through a ref.
  const live = useRef({
    grid,
    def,
    id,
    spot,
    editable,
    onMove,
    onPreview,
    onSelect,
  });
  live.current = { grid, def, id, spot, editable, onMove, onPreview, onSelect };

  // After a drop the item re-renders at its new spot: only then clear the drag offset (no flicker).
  useEffect(() => {
    pan.setValue({ x: 0, y: 0 });
  }, [spot.col, spot.row, pan]);

  const target = (dx: number, dy: number) => {
    const l = live.current;
    return clampSpot(
      l.grid,
      l.def,
      l.spot.col + dx / l.grid.cell,
      l.spot.row + dy / l.grid.cell,
    );
  };

  const responder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => live.current.editable,
      onMoveShouldSetPanResponder: () => live.current.editable,
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: () => {
        setDragging(true);
        const l = live.current;
        l.onPreview({ ...l.spot, ...spanOf(l.def) });
      },
      onPanResponderMove: (_, g) => {
        pan.setValue({ x: g.dx, y: g.dy });
        live.current.onPreview({
          ...target(g.dx, g.dy),
          ...spanOf(live.current.def),
        });
      },
      onPanResponderRelease: (_, g) => {
        const l = live.current;
        setDragging(false);
        l.onPreview(null);
        // A tap (barely any movement) selects the piece instead of moving it.
        if (Math.hypot(g.dx, g.dy) < 6) {
          pan.setValue({ x: 0, y: 0 });
          l.onSelect(l.id);
          return;
        }
        const t = target(g.dx, g.dy);
        if (t.col === l.spot.col && t.row === l.spot.row)
          pan.setValue({ x: 0, y: 0 });
        else l.onMove(l.id, t.col, t.row);
      },
      onPanResponderTerminate: () => {
        setDragging(false);
        live.current.onPreview(null);
        pan.setValue({ x: 0, y: 0 });
      },
    }),
  ).current;

  return (
    <Animated.View
      {...responder.panHandlers}
      style={[
        styles.item,
        {
          left: spot.col * grid.cell,
          top: grid.top + spot.row * grid.cell,
          width: cw * grid.cell,
          height: ch * grid.cell,
          zIndex: dragging ? 100 : 0,
          opacity: dragging ? 0.9 : 1,
          transform: [
            ...pan.getTranslateTransform(),
            { scale: dragging ? 1.05 : 1 },
          ],
        },
      ]}
    >
      <Image
        source={def.icon}
        resizeMode="contain"
        style={{ width: def.wc * grid.cell, height: def.hc * grid.cell }}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  item: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  box: {
    position: "absolute",
    borderRadius: 8,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: colors.coral,
    backgroundColor: "rgba(255,184,171,0.25)",
  },
  delete: {
    position: "absolute",
    width: 24,
    height: 24,
    borderRadius: 12,
    zIndex: 200,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.accentRed,
    borderWidth: 2,
    borderColor: colors.creamWhite,
  },
});
