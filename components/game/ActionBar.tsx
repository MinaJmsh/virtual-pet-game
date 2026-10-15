import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ActionButton } from '@/components/cozy/ActionButton';

interface Props {
  onCook: () => void;
  onDecorate: () => void;
  onDress: () => void;
  onShop: () => void;
}

/** Menu buttons only. Care activities (feed, wash, sleep, play) happen inside the rooms. */
export function ActionBar({ onCook, onDecorate, onDress, onShop }: Props) {
  return (
    <View style={styles.row}>
      <ActionButton icon="🍳" label="Cook" onPress={onCook} />
      <ActionButton icon="🛋️" label="Decorate" onPress={onDecorate} />
      <ActionButton icon="👗" label="Dress" onPress={onDress} />
      <ActionButton icon="🛍️" label="Shop" onPress={onShop} />
    </View>
  );
}

const styles = StyleSheet.create({ row: { flexDirection: 'row', justifyContent: 'space-between' } });
