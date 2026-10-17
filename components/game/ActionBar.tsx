import { ActionButton } from "@/components/cozy/ActionButton";
import { spacing } from "@/theme/tokens";
import React from "react";
import { StyleSheet, View } from "react-native";

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
      <View style={styles.slot}>
        <ActionButton fill icon="🍳" label="Cook" onPress={onCook} />
      </View>
      <View style={styles.slot}>
        <ActionButton fill icon="🛋️" label="Decorate" onPress={onDecorate} />
      </View>
      <View style={styles.slot}>
        <ActionButton fill icon="👗" label="Dress" onPress={onDress} />
      </View>
      <View style={styles.slot}>
        <ActionButton fill icon="🛍️" label="Shop" onPress={onShop} />
      </View>
    </View>
  );
}

// Grouped in the middle, equal width, small gap. They shrink together on narrow screens.
const styles = StyleSheet.create({
  row: { flexDirection: "row", justifyContent: "center", gap: spacing.md },
  slot: { flex: 1, maxWidth: 78 },
});
