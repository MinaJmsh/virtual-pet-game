import React, { useMemo } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { Illustration } from '@/components/cozy/Illustration';
import { PressableScale } from '@/components/cozy/PressableScale';
import { getItem } from '@/data/items';
import { PLACE_SLOTS, RoomAction, ROOMS } from '@/data/rooms';
import { RoomId } from '@/game/types';
import { colors, outlineWidth } from '@/theme/tokens';

const STRIPE = 24;
const TILE = 44;
const FLOOR_ROWS = 10;

interface Props {
  room: RoomId;
  onObjectPress: (action: RoomAction) => void;
  dark?: boolean; // lights off (cat sleeping)
  placed?: string[]; // item ids the player decorated this room with
}

export function RoomBackground({ room, onObjectPress, dark, placed = [] }: Props) {
  const { width } = useWindowDimensions();
  const stripes = useMemo(() => Array.from({ length: Math.ceil(width / STRIPE) }, (_, i) => i), [width]);
  const tiles = useMemo(() => {
    const cols = Math.ceil(width / TILE) + 1;
    return Array.from({ length: FLOOR_ROWS }, (_, r) => Array.from({ length: cols }, (_, c) => (r + c) % 2));
  }, [width]);

  return (
    <View style={StyleSheet.absoluteFill}>
      <View style={styles.tileTop} />
      <View style={styles.band} />
      <View style={styles.wall}>
        {stripes.map((i) => (
          <View key={i} style={{ width: STRIPE, backgroundColor: i % 2 ? colors.wallStripe : colors.wallCream }} />
        ))}
      </View>
      <View style={styles.floor}>
        {tiles.map((row, r) => (
          <View key={r} style={styles.tileRow}>
            {row.map((v, c) => (
              <View key={c} style={{ width: TILE, height: TILE, backgroundColor: v ? colors.floorA : colors.floorB }} />
            ))}
          </View>
        ))}
      </View>

      {dark ? <View pointerEvents="none" style={styles.night} /> : null}

      {placed.slice(0, PLACE_SLOTS.length).map((id, i) => {
        const item = getItem(id);
        if (!item) return null;
        const [x, y] = PLACE_SLOTS[i];
        return (
          <View key={id} pointerEvents="none" style={{ position: 'absolute', left: `${x}%`, top: `${y}%` }}>
            <Illustration icon={item.icon} size={52} />
          </View>
        );
      })}

      {ROOMS[room].objects.map((o) => {
        const art = <Illustration icon={dark && o.altIcon ? o.altIcon : o.icon} size={o.size} />;
        const position = { position: 'absolute' as const, left: `${o.x}%` as const, top: `${o.y}%` as const };
        return o.action ? (
          <PressableScale key={o.id} style={position} onPress={() => onObjectPress(o.action!)} accessibilityRole="button" accessibilityLabel={o.label}>
            {art}
          </PressableScale>
        ) : (
          <View key={o.id} style={position} pointerEvents="none">{art}</View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tileTop: { height: '12%', backgroundColor: colors.wallTopGreen },
  band: { height: 18, backgroundColor: colors.wallBorderPink, borderTopWidth: outlineWidth.regular, borderBottomWidth: outlineWidth.regular, borderColor: colors.outline },
  wall: { height: '26%', flexDirection: 'row' },
  floor: { flex: 1, borderTopWidth: outlineWidth.regular, borderTopColor: colors.outline, overflow: 'hidden' },
  tileRow: { flexDirection: 'row' },
  night: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(80,60,100,0.35)' },
});
