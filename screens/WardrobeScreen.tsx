import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BackButton } from '@/components/cozy/BackButton';
import { BottomSheet } from '@/components/cozy/BottomSheet';
import { CategoryPill } from '@/components/cozy/CategoryPill';
import { CozyList } from '@/components/cozy/CozyList';
import { CozyText } from '@/components/cozy/CozyText';
import { GridCell } from '@/components/cozy/GridCell';
import { Toast } from '@/components/cozy/Toast';
import { CatDisplay } from '@/components/game/CatDisplay';
import { RoomBackground } from '@/components/game/RoomBackground';
import { ShopItem, SHOP_ITEMS } from '@/data/items';
import { useGame } from '@/game/GameContext';
import { EquipSlot } from '@/game/types';
import { useToast } from '@/hooks/use-toast';
import { colors, spacing } from '@/theme/tokens';
import { padToColumns } from '@/utils/padToColumns';

const SLOTS: { key: EquipSlot; icon: string; label: string }[] = [
  { key: 'head', icon: '🎩', label: 'Hats' },
  { key: 'neck', icon: '🧣', label: 'Neck' },
];

type Cell = ShopItem | 'none';

export default function WardrobeScreen() {
  const game = useGame();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const { message, show } = useToast();
  const { state } = game;
  const [slot, setSlot] = useState<EquipSlot>('head');
  const [collapsed, setCollapsed] = useState(false);

  const cells = useMemo(() => {
    const owned = SHOP_ITEMS.filter((i) => i.slot === slot && state.ownedItems.includes(i.id));
    return padToColumns<Cell>(['none', ...owned], 3);
  }, [slot, state.ownedItems]);

  const worn = state.equipped[slot] ?? null;

  return (
    <View style={styles.screen}>
      <View style={styles.stage}>
        <RoomBackground room="bedroom" onObjectPress={() => {}} />
        <View style={[styles.back, { top: insets.top + spacing.sm }]}><BackButton /></View>
        <View style={styles.catArea} pointerEvents="box-none">
          <CatDisplay state={state} onPress={() => show(game.pet().message)} />
        </View>
        <Toast message={message} top={insets.top + 48} />
      </View>

      <BottomSheet
        tabs={[{ key: 'clothes', icon: '👗' }]}
        activeTab="clothes"
        onTabChange={() => {}}
        collapsed={collapsed}
        onToggleCollapsed={() => setCollapsed((c) => !c)}
        bodyHeight={Math.round(height * 0.36)}
      >
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pillsScroll} contentContainerStyle={styles.pills}>
          {SLOTS.map((s) => (
            <CategoryPill key={s.key} icon={s.icon} label={s.label} active={s.key === slot} onPress={() => setSlot(s.key)} />
          ))}
        </ScrollView>
        <CozyList
          data={cells}
          numColumns={3}
          key={slot}
          keyExtractor={(c, i) => (c === 'none' ? 'none' : c?.id ?? `pad-${i}`)}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.grid}
          ListFooterComponent={
            cells.length <= 3 ? (
              <CozyText variant="label" color="textSecondary" style={styles.hint} onPress={() => router.push('/shop')}>
                Nothing here yet — tap to visit the shop 🛍️
              </CozyText>
            ) : null
          }
          renderItem={({ item }) => {
            if (item === null) return <View style={{ flex: 1 }} />;
            if (item === 'none') {
              return <GridCell icon="🚫" name="None" selected={!worn} onPress={() => show(game.unequip(slot).message)} />;
            }
            return (
              <GridCell
                icon={item.icon}
                name={item.name}
                selected={worn === item.id}
                statusLabel={worn === item.id ? 'In Use' : undefined}
                onPress={() => show(game.toggleEquip(item.id).message)}
              />
            );
          }}
        />
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bgApp },
  stage: { flex: 1, overflow: 'hidden' },
  back: { position: 'absolute', left: spacing.md, zIndex: 5 },
  catArea: { ...StyleSheet.absoluteFillObject, top: '30%', alignItems: 'center' },
  pillsScroll: { flexGrow: 0 },
  pills: { padding: spacing.sm, gap: spacing.sm },
  row: { gap: spacing.sm },
  grid: { padding: spacing.sm, paddingRight: 18, gap: spacing.sm },
  hint: { textAlign: 'center', paddingVertical: spacing.md },
});
