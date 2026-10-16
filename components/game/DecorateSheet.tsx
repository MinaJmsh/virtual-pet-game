import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { BottomSheet } from '@/components/cozy/BottomSheet';
import { CategoryPill } from '@/components/cozy/CategoryPill';
import { CozyList } from '@/components/cozy/CozyList';
import { CozyText } from '@/components/cozy/CozyText';
import { GridCell } from '@/components/cozy/GridCell';
import { SHOP_ITEMS } from '@/data/items';
import { useGame } from '@/game/GameContext';
import { ItemCategory, RoomId } from '@/game/types';
import { spacing } from '@/theme/tokens';
import { padToColumns } from '@/utils/padToColumns';

const CATEGORIES: { key: ItemCategory; icon: string; label: string }[] = [
  { key: 'furniture', icon: '🛋️', label: 'Furniture' },
  { key: 'decor', icon: '🪴', label: 'Decorations' },
];

interface Props {
  room: RoomId; // the room currently shown behind the sheet
  bodyHeight: number;
  onClose: () => void; // the red chevron closes decorate mode
  onToast: (message: string) => void;
}

/** Decorate mode: a folder-tab sheet over the bottom of the home screen. Tap owned items to place/remove them in the room you see. */
export function DecorateSheet({ room, bodyHeight, onClose, onToast }: Props) {
  const game = useGame();
  const router = useRouter();
  const { state } = game;
  const [category, setCategory] = useState<ItemCategory>('furniture');
  const placedHere = state.placed[room] ?? [];

  const cells = useMemo(
    () => padToColumns(SHOP_ITEMS.filter((i) => i.category === category && state.ownedItems.includes(i.id)), 3),
    [category, state.ownedItems],
  );

  return (
    <BottomSheet
      tabs={[{ key: 'decorate', icon: '🛋️' }]}
      activeTab="decorate"
      onTabChange={() => {}}
      collapsed={false}
      onToggleCollapsed={onClose}
      bodyHeight={bodyHeight}
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
              onPress={() => onToast(game.togglePlace(item.id, room).message)}
            />
          ) : (
            <View style={{ flex: 1 }} />
          )
        }
      />
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  pillsScroll: { flexGrow: 0 },
  pills: { padding: spacing.sm, gap: spacing.sm },
  row: { gap: spacing.sm },
  grid: { padding: spacing.sm, paddingRight: 18, gap: spacing.sm },
  hint: { textAlign: 'center', paddingVertical: spacing.md },
});
