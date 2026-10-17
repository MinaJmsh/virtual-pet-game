import { AddCell } from "@/components/cozy/AddCell";
import { BottomSheet } from "@/components/cozy/BottomSheet";
import { CategoryPill, FaIconName } from "@/components/cozy/CategoryPill";
import { CozyList } from "@/components/cozy/CozyList";
import { GridCell } from "@/components/cozy/GridCell";
import { SHOP_ITEMS, ShopItem } from "@/data/items";
import { useGame } from "@/game/GameContext";
import { EquipSlot } from "@/game/types";
import { spacing } from "@/theme/tokens";
import { padToColumns } from "@/utils/padToColumns";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

const SLOTS: { key: EquipSlot; icon: FaIconName; label: string }[] = [
  { key: "head", icon: "crown", label: "Hats" },
  { key: "top", icon: "shirt", label: "Tops" },
  { key: "neck", icon: "ribbon", label: "Accessories" },
];

type Cell = ShopItem | "none" | "add";

interface Props {
  bodyHeight: number;
  onClose: () => void; // the red chevron closes dress mode
  onToast: (message: string) => void;
}

/** Dress mode: same sheet as decorating, drawn over the bottom of the home screen. The cat stays visible. */
export function DressSheet({ bodyHeight, onClose, onToast }: Props) {
  const game = useGame();
  const router = useRouter();
  const { state } = game;
  const [slot, setSlot] = useState<EquipSlot>("head");

  const cells = useMemo(() => {
    const owned = SHOP_ITEMS.filter(
      (i) => i.slot === slot && state.ownedItems.includes(i.id),
    );
    // "None" only makes sense when there is something to take off.
    const list: Cell[] = owned.length > 0 ? ["none", ...owned, "add"] : ["add"];
    return padToColumns<Cell>(list, 3);
  }, [slot, state.ownedItems]);

  const worn = state.equipped[slot] ?? null;

  return (
    <BottomSheet
      tabs={[{ key: "clothes", icon: "👗" }]}
      activeTab="clothes"
      onTabChange={() => {}}
      collapsed={false}
      onToggleCollapsed={onClose}
      bodyHeight={bodyHeight}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.pillsScroll}
        contentContainerStyle={styles.pills}
      >
        {SLOTS.map((s) => (
          <CategoryPill
            key={s.key}
            icon={s.icon}
            label={s.label}
            active={s.key === slot}
            onPress={() => setSlot(s.key)}
          />
        ))}
      </ScrollView>
      <CozyList
        data={cells}
        numColumns={3}
        key={slot}
        keyExtractor={(c, i) =>
          c === "none" || c === "add" ? c : (c?.id ?? `pad-${i}`)
        }
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.grid}
        renderItem={({ item }) => {
          if (item === null) return <View style={{ flex: 1 }} />;
          if (item === "add")
            return (
              <AddCell
                label="Get more in the shop"
                onPress={() => router.push("/shop")}
              />
            );
          if (item === "none") {
            return (
              <GridCell
                icon="🚫"
                name="None"
                selected={!worn}
                onPress={() => onToast(game.unequip(slot).message)}
              />
            );
          }
          return (
            <GridCell
              icon={item.icon}
              name={item.name}
              selected={worn === item.id}
              statusLabel={worn === item.id ? "In Use" : undefined}
              onPress={() => onToast(game.toggleEquip(item.id).message)}
            />
          );
        }}
      />
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  pillsScroll: { flexGrow: 0 },
  pills: { padding: spacing.sm, gap: spacing.sm },
  row: { gap: spacing.sm },
  grid: { padding: spacing.sm, paddingRight: 18, gap: spacing.sm },
});
