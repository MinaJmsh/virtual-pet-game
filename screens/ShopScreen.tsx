import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { BackButton } from '@/components/cozy/BackButton';
import { CategoryPill } from '@/components/cozy/CategoryPill';
import { CozyList } from '@/components/cozy/CozyList';
import { CurrencyPill } from '@/components/cozy/CurrencyPill';
import { FolderTabRow } from '@/components/cozy/FolderTabRow';
import { GinghamHeader } from '@/components/cozy/GinghamHeader';
import { GridCell } from '@/components/cozy/GridCell';
import { Toast } from '@/components/cozy/Toast';
import { ShopActionBar } from '@/components/game/ShopActionBar';
import { SHOP_ITEMS } from '@/data/items';
import { useGame } from '@/game/GameContext';
import { ItemCategory } from '@/game/types';
import { useToast } from '@/hooks/use-toast';
import { colors, spacing } from '@/theme/tokens';
import { padToColumns } from '@/utils/padToColumns';

const CATEGORIES: { key: ItemCategory; icon: string; label: string }[] = [
  { key: 'outfits', icon: '🎀', label: 'Outfits' },
  { key: 'furniture', icon: '🛋️', label: 'Furniture' },
  { key: 'decor', icon: '🪴', label: 'Decorations' },
];

export default function ShopScreen() {
  const game = useGame();
  const { state } = game;
  const { message, show } = useToast();
  const [category, setCategory] = useState<ItemCategory>('outfits');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const data = useMemo(() => padToColumns(SHOP_ITEMS.filter((i) => i.category === category), 3), [category]);
  const selected = SHOP_ITEMS.find((i) => i.id === selectedId) ?? null;
  const isEquipped = (id: string) => Object.values(state.equipped).includes(id);

  return (
    <View style={styles.screen}>
      <GinghamHeader>
        <BackButton />
        <CurrencyPill icon="🪙" value={state.coins} />
      </GinghamHeader>
      <FolderTabRow tabs={[{ key: 'shop', icon: '🛍️' }]} activeKey="shop" onChange={() => {}} />

      <View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pills}>
          {CATEGORIES.map((c) => (
            <CategoryPill key={c.key} icon={c.icon} label={c.label} active={c.key === category} onPress={() => { setCategory(c.key); setSelectedId(null); }} />
          ))}
        </ScrollView>
      </View>

      <CozyList
        data={data}
        numColumns={3}
        key={category}
        keyExtractor={(item, i) => item?.id ?? `pad-${i}`}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.grid}
        renderItem={({ item }) =>
          item ? (
            <GridCell
              icon={item.icon}
              name={item.name}
              selected={item.id === selectedId}
              statusLabel={isEquipped(item.id) ? 'In Use' : undefined}
              caption={state.ownedItems.includes(item.id) ? 'Owned' : `🪙 ${item.price}`}
              onPress={() => setSelectedId(item.id)}
            />
          ) : (
            <View style={{ flex: 1 }} />
          )
        }
      />

      <ShopActionBar
        item={selected}
        owned={!!selected && state.ownedItems.includes(selected.id)}
        equipped={!!selected && isEquipped(selected.id)}
        canAfford={!!selected && state.coins >= selected.price}
        onBuy={() => selected && show(game.buy(selected.id).message)}
        onToggleEquip={() => selected && show(game.toggleEquip(selected.id).message)}
      />
      <Toast message={message} top={130} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bgApp },
  pills: { padding: spacing.sm, gap: spacing.sm },
  row: { gap: spacing.sm },
  grid: { padding: spacing.sm, paddingRight: 18, gap: spacing.sm },
});
