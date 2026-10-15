import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowButton } from '@/components/cozy/ArrowButton';
import { BackButton } from '@/components/cozy/BackButton';
import { BottomSheet } from '@/components/cozy/BottomSheet';
import { CategoryPill } from '@/components/cozy/CategoryPill';
import { CozyList } from '@/components/cozy/CozyList';
import { CozyText } from '@/components/cozy/CozyText';
import { GridCell } from '@/components/cozy/GridCell';
import { Toast } from '@/components/cozy/Toast';
import { RoomBackground } from '@/components/game/RoomBackground';
import { SHOP_ITEMS } from '@/data/items';
import { ROOM_ORDER, ROOMS } from '@/data/rooms';
import { useGame } from '@/game/GameContext';
import { ItemCategory, RoomId } from '@/game/types';
import { useToast } from '@/hooks/use-toast';
import { colors, outlineWidth, radii, spacing } from '@/theme/tokens';
import { padToColumns } from '@/utils/padToColumns';

const CATEGORIES: { key: ItemCategory; icon: string; label: string }[] = [
  { key: 'furniture', icon: '🛋️', label: 'Furniture' },
  { key: 'decor', icon: '🪴', label: 'Decorations' },
];

/** Pick a room with the arrows, then tap owned furniture/decorations to place or remove them. */
export default function DecorateScreen() {
  const game = useGame();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const { message, show } = useToast();
  const { state } = game;
  const [room, setRoom] = useState<RoomId>(state.selectedRoom);
  const [category, setCategory] = useState<ItemCategory>('furniture');
  const [collapsed, setCollapsed] = useState(false);

  const placedHere = state.placed[room] ?? [];
  const cells = useMemo(
    () => padToColumns(SHOP_ITEMS.filter((i) => i.category === category && state.ownedItems.includes(i.id)), 3),
    [category, state.ownedItems],
  );
  const changeRoom = (step: number) => {
    const i = ROOM_ORDER.indexOf(room);
    setRoom(ROOM_ORDER[(i + step + ROOM_ORDER.length) % ROOM_ORDER.length]);
  };

  return (
    <View style={styles.screen}>
      <View style={styles.stage}>
        <RoomBackground room={room} placed={placedHere} onObjectPress={() => {}} />
        <View style={[styles.back, { top: insets.top + spacing.sm }]}><BackButton /></View>
        <View style={[styles.roomName, { marginTop: insets.top + spacing.sm }]}>
          <CozyText variant="title">{ROOMS[room].name}</CozyText>
        </View>
        <View style={[styles.arrow, { left: spacing.md }]}><ArrowButton direction="left" onPress={() => changeRoom(-1)} /></View>
        <View style={[styles.arrow, { right: spacing.md }]}><ArrowButton direction="right" onPress={() => changeRoom(1)} /></View>
        <Toast message={message} top={insets.top + 48} />
      </View>

      <BottomSheet
        tabs={[{ key: 'decorate', icon: '🛋️' }]}
        activeTab="decorate"
        onTabChange={() => {}}
        collapsed={collapsed}
        onToggleCollapsed={() => setCollapsed((c) => !c)}
        bodyHeight={Math.round(height * 0.36)}
      >
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pillsScroll} contentContainerStyle={styles.pills}>
          {CATEGORIES.map((c) => (
            <CategoryPill key={c.key} icon={c.icon} label={c.label} active={c.key === category} onPress={() => setCategory(c.key)} />
          ))}
        </ScrollView>
        <CozyList
          data={cells}
          numColumns={3}
          key={category}
          keyExtractor={(c, i) => c?.id ?? `pad-${i}`}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.grid}
          ListFooterComponent={
            cells.filter(Boolean).length === 0 ? (
              <CozyText variant="label" color="textSecondary" style={styles.hint} onPress={() => router.push('/shop')}>
                Nothing here yet — tap to visit the shop 🛍️
              </CozyText>
            ) : null
          }
          renderItem={({ item }) =>
            item ? (
              <GridCell
                icon={item.icon}
                name={item.name}
                selected={placedHere.includes(item.id)}
                statusLabel={placedHere.includes(item.id) ? 'Placed' : undefined}
                onPress={() => show(game.togglePlace(item.id, room).message)}
              />
            ) : (
              <View style={{ flex: 1 }} />
            )
          }
        />
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bgApp },
  stage: { flex: 1, overflow: 'hidden' },
  back: { position: 'absolute', left: spacing.md, zIndex: 5 },
  roomName: {
    alignSelf: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: 4,
    borderRadius: radii.pill,
    backgroundColor: colors.creamWhite,
    borderWidth: outlineWidth.regular,
    borderColor: colors.outline,
  },
  arrow: { position: 'absolute', top: '52%' },
  pillsScroll: { flexGrow: 0 },
  pills: { padding: spacing.sm, gap: spacing.sm },
  row: { gap: spacing.sm },
  grid: { padding: spacing.sm, paddingRight: 18, gap: spacing.sm },
  hint: { textAlign: 'center', paddingVertical: spacing.md },
});
