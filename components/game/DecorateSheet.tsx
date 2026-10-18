import { AddCell } from "@/components/cozy/AddCell";
import { BottomSheet } from "@/components/cozy/BottomSheet";
import { CategoryPill, FaIconName } from "@/components/cozy/CategoryPill";
import { CozyList } from "@/components/cozy/CozyList";
import { GridCell } from "@/components/cozy/GridCell";
import { SHOP_ITEMS, ShopItem } from "@/data/items";
import { ROOM_ORDER, ROOMS } from "@/data/rooms";
import { useGame } from "@/game/GameContext";
import { RoomId } from "@/game/types";
import { spacing } from "@/theme/tokens";
import { padToColumns } from "@/utils/padToColumns";
import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

// Same order as the rooms in the game.
const ROOM_ICONS: Record<RoomId, FaIconName> = {
  kitchen: "utensils",
  playroom: "gamepad",
  bathroom: "bath",
  bedroom: "bed",
};

type Cell = ShopItem | "add";

interface Props {
  room: RoomId; // the room currently shown behind the sheet
  onRoomChange: (room: RoomId) => void;
  bodyHeight: number;
  onClose: () => void; // the red chevron closes decorate mode
  onToast: (message: string) => void;
  /** Rooms with free placement: tapping an item adds it to the room (or removes it if it is already there). */
  onPickFurniture?: (item: ShopItem) => void;
  /** Ids of the items already placed in a free-placement room. */
  layoutIds?: string[];
}

/** Decorate mode: the pills are the rooms. Tapping one switches the room behind the sheet and shows that room's items. */
export function DecorateSheet({
  room,
  onRoomChange,
  bodyHeight,
  onClose,
  onToast,
  onPickFurniture,
  layoutIds,
}: Props) {
  const game = useGame();
  const router = useRouter();
  const { state } = game;
  const placedHere = onPickFurniture ? (layoutIds ?? []) : (state.placed[room] ?? []);

  const cells = useMemo(() => {
    const owned = SHOP_ITEMS.filter(
      (i) => i.room === room && state.ownedItems.includes(i.id),
    );
    return padToColumns<Cell>([...owned, "add"], 3);
  }, [room, state.ownedItems]);

  return (
    <BottomSheet
      tabs={[{ key: "decorate", icon: "🛋️" }]}
      activeTab="decorate"
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
        {ROOM_ORDER.map((r) => (
          <CategoryPill
            key={r}
            icon={ROOM_ICONS[r]}
            label={ROOMS[r].name}
            active={r === room}
            onPress={() => onRoomChange(r)}
          />
        ))}
      </ScrollView>
      <CozyList
        data={cells}
        numColumns={3}
        key={room}
        keyExtractor={(c, i) => (c === "add" ? "add" : (c?.id ?? `pad-${i}`))}
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
          const isPlaced = placedHere.includes(item.id);
          return (
            <GridCell
              icon={item.icon}
              name={item.name}
              selected={isPlaced}
              statusLabel={isPlaced ? "Placed" : undefined}
              onPress={() =>
                onPickFurniture
                  ? onPickFurniture(item)
                  : onToast(game.togglePlace(item.id, room).message)
              }
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
