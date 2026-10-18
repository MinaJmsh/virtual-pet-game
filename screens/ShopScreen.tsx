import { BackButton } from "@/components/cozy/BackButton";
import { CategoryPill, FaIconName } from "@/components/cozy/CategoryPill";
import { CozyList } from "@/components/cozy/CozyList";
import { CurrencyPill } from "@/components/cozy/CurrencyPill";
import { FolderTab, FolderTabRow } from "@/components/cozy/FolderTabRow";
import { GinghamHeader } from "@/components/cozy/GinghamHeader";
import { GridCell } from "@/components/cozy/GridCell";
import { IconSource } from "@/components/cozy/Illustration";
import { Toast } from "@/components/cozy/Toast";
import { ShopAction, ShopActionBar } from "@/components/game/ShopActionBar";
import { SHOP_ITEMS } from "@/data/items";
import { INGREDIENTS } from "@/data/recipes";
import { useGame } from "@/game/GameContext";
import { EquipSlot, RoomId } from "@/game/types";
import { useToast } from "@/hooks/use-toast";
import { colors, spacing } from "@/theme/tokens";
import { padToColumns } from "@/utils/padToColumns";
import React, { useMemo, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

type MainTab = "wear" | "decor" | "food";

const TABS: FolderTab[] = [
  { key: "wear", icon: "👗" },
  { key: "decor", icon: "🛋️" },
  { key: "food", icon: "🥕" },
];

const WEAR_CATS: { key: EquipSlot; icon: FaIconName; label: string }[] = [
  { key: "head", icon: "crown", label: "Hats" },
  { key: "top", icon: "shirt", label: "Tops" },
  { key: "neck", icon: "ribbon", label: "Accessories" },
];

// Same order as the rooms in the game.
const DECOR_CATS: { key: RoomId; icon: FaIconName; label: string }[] = [
  { key: "kitchen", icon: "utensils", label: "Kitchen" },
  { key: "playroom", icon: "gamepad", label: "Playroom" },
  { key: "bathroom", icon: "bath", label: "Bathroom" },
  { key: "bedroom", icon: "bed", label: "Bedroom" },
];

interface Entry {
  id: string;
  name: string;
  description: string;
  icon: IconSource; // was string
  price: number;
  slot?: EquipSlot;
}
export default function ShopScreen() {
  const game = useGame();
  const { state } = game;
  const { message, show } = useToast();
  const [tab, setTab] = useState<MainTab>("wear");
  const [wearCat, setWearCat] = useState<EquipSlot>("head");
  const [decorCat, setDecorCat] = useState<RoomId>("kitchen");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const entries = useMemo<Entry[]>(() => {
    if (tab === "wear") return SHOP_ITEMS.filter((i) => i.slot === wearCat);
    if (tab === "decor")
      return SHOP_ITEMS.filter(
        (i) => i.category !== "outfits" && i.room === decorCat,
      );
    return Object.values(INGREDIENTS).filter(
      (i): i is typeof i & { price: number } => i.price !== undefined,
    );
  }, [tab, wearCat, decorCat]);

  const data = useMemo(() => padToColumns(entries, 3), [entries]);
  const selected = entries.find((e) => e.id === selectedId) ?? null;

  const isEquipped = (id: string) => Object.values(state.equipped).includes(id);
  const have = (id: string) => state.ingredients[id] ?? 0;

  // What the bottom bar offers for the selected entry.
  let subtitle = "";
  let action: ShopAction | null = null;
  if (selected) {
    const canAfford = state.coins >= selected.price;
    if (tab === "food") {
      subtitle = `🪙 ${selected.price} · You have ${have(selected.id)}`;
      action = {
        icon: "🛍️",
        label: "Buy",
        disabled: !canAfford,
        onPress: () => show(game.buyIngredient(selected.id).message),
      };
    } else if (!state.ownedItems.includes(selected.id)) {
      subtitle = `🪙 ${selected.price}`;
      action = {
        icon: "🛍️",
        label: "Buy",
        disabled: !canAfford,
        onPress: () => show(game.buy(selected.id).message),
      };
    } else if (selected.slot) {
      const worn = isEquipped(selected.id);
      subtitle = "Owned";
      action = {
        icon: worn ? "❌" : "✅",
        label: worn ? "Remove" : "Use",
        onPress: () => show(game.toggleEquip(selected.id).message),
      };
    } else {
      subtitle = "Owned · place it with Decorate";
      action = {
        icon: "🏠",
        label: "Owned",
        disabled: true,
        onPress: () => {},
      };
    }
  }

  const pills =
    tab === "wear"
      ? WEAR_CATS.map((c) => ({
          key: c.key,
          icon: c.icon,
          label: c.label,
          active: c.key === wearCat,
          onPress: () => {
            setWearCat(c.key);
            setSelectedId(null);
          },
        }))
      : tab === "decor"
        ? DECOR_CATS.map((c) => ({
            key: c.key,
            icon: c.icon,
            label: c.label,
            active: c.key === decorCat,
            onPress: () => {
              setDecorCat(c.key);
              setSelectedId(null);
            },
          }))
        : [];

  return (
    <View style={styles.screen}>
      <GinghamHeader withTab>
        <BackButton />
        <CurrencyPill icon="🪙" value={state.coins} />
        <CurrencyPill icon="🐟" value={state.ingredients.fish ?? 0} />
      </GinghamHeader>
      <FolderTabRow
        tabs={TABS}
        activeKey={tab}
        onChange={(k) => {
          setTab(k as MainTab);
          setSelectedId(null);
        }}
        overlap
      />

      {pills.length > 0 ? (
        <View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.pills}
          >
            {pills.map((p) => (
              <CategoryPill
                key={p.key}
                icon={p.icon}
                label={p.label}
                active={p.active}
                onPress={p.onPress}
              />
            ))}
          </ScrollView>
        </View>
      ) : null}

      <CozyList
        data={data}
        numColumns={3}
        key={`${tab}-${wearCat}-${decorCat}`}
        keyExtractor={(item, i) => item?.id ?? `pad-${i}`}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.grid}
        renderItem={({ item }) => {
          if (!item) return <View style={{ flex: 1 }} />;
          const caption =
            tab === "food"
              ? `🪙 ${item.price} · x${have(item.id)}`
              : state.ownedItems.includes(item.id)
                ? "Owned"
                : `🪙 ${item.price}`;
          return (
            <GridCell
              icon={item.icon}
              name={item.name}
              selected={item.id === selectedId}
              statusLabel={
                tab !== "food" && isEquipped(item.id) ? "In Use" : undefined
              }
              caption={caption}
              onPress={() => setSelectedId(item.id)}
            />
          );
        }}
      />

      <ShopActionBar item={selected} subtitle={subtitle} action={action} />
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
