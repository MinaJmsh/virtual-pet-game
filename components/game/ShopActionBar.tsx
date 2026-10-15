import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ActionButton } from '@/components/cozy/ActionButton';
import { CozyText } from '@/components/cozy/CozyText';
import { Illustration } from '@/components/cozy/Illustration';
import { ShopItem } from '@/data/items';
import { colors, outlineWidth, spacing } from '@/theme/tokens';

interface Props {
  item: ShopItem | null;
  owned: boolean;
  equipped: boolean;
  canAfford: boolean;
  onBuy: () => void;
  onToggleEquip: () => void;
}

/** Bottom bar for the selected shop item: shows what it is and offers Buy / Use / Remove. */
export function ShopActionBar({ item, owned, equipped, canAfford, onBuy, onToggleEquip }: Props) {
  return (
    <View style={styles.bar}>
      {item ? (
        <>
          <Illustration icon={item.icon} size={40} />
          <View style={styles.info}>
            <CozyText variant="title" numberOfLines={1}>{item.name}</CozyText>
            <CozyText variant="caption" color="textSecondary">{owned ? 'Owned' : `🪙 ${item.price}`}</CozyText>
          </View>
          {!owned ? (
            <ActionButton icon="🛍️" label="Buy" onPress={onBuy} disabled={!canAfford} />
          ) : item.slot ? (
            <ActionButton icon={equipped ? '❌' : '✅'} label={equipped ? 'Remove' : 'Use'} onPress={onToggleEquip} />
          ) : (
            <ActionButton icon="🏠" label="Owned" onPress={() => {}} disabled />
          )}
        </>
      ) : (
        <CozyText variant="label" color="textSecondary">Tap an item to see details</CozyText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    minHeight: 76,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.bgApp,
    borderTopWidth: outlineWidth.regular,
    borderTopColor: colors.outline,
  },
  info: { flex: 1 },
});
