import { BackButton } from "@/components/cozy/BackButton";
import { CategoryPill, FaIconName } from "@/components/cozy/CategoryPill";
import { CozyList } from "@/components/cozy/CozyList";
import { CozyText } from "@/components/cozy/CozyText";
import { CurrencyPill } from "@/components/cozy/CurrencyPill";
import { FolderTabRow } from "@/components/cozy/FolderTabRow";
import { GinghamHeader } from "@/components/cozy/GinghamHeader";
import { Toast } from "@/components/cozy/Toast";
import { RecipeRow } from "@/components/game/RecipeRow";
import { RECIPES, STATIONS, Station } from "@/data/recipes";
import { useGame } from "@/game/GameContext";
import { useToast } from "@/hooks/use-toast";
import { colors, spacing } from "@/theme/tokens";
import React, { useMemo, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

// Change these to any FontAwesome 6 icon name you like.
const STATION_ICONS: Record<Station, FaIconName> = {
  steamer: "bowl-rice",
  stock_pot: "bowl-food",
  wok: "fire",
  frying_pan: "egg",
};

export default function KitchenScreen() {
  const game = useGame();
  const { message, show } = useToast();
  const { state } = game;
  const [station, setStation] = useState<Station>("steamer");

  // Only the recipes of the selected category are shown.
  const recipes = useMemo(
    () => RECIPES.filter((r) => r.station === station),
    [station],
  );
  const stationName = STATIONS.find((s) => s.key === station)?.name ?? "";

  return (
    <View style={styles.screen}>
      <GinghamHeader withTab>
        <BackButton />
        <CurrencyPill icon="🐟" value={state.ingredients.fish ?? 0} />
        <CurrencyPill icon="🪙" value={state.coins} />
      </GinghamHeader>
      <FolderTabRow
        tabs={[{ key: "recipes", icon: "🍳" }]}
        activeKey="recipes"
        onChange={() => {}}
        overlap
      />

      <View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.pills}
        >
          {STATIONS.map((s) => (
            <CategoryPill
              key={s.key}
              icon={STATION_ICONS[s.key]}
              label={s.name}
              active={s.key === station}
              onPress={() => setStation(s.key)}
            />
          ))}
        </ScrollView>
      </View>

      <CozyText
        variant="caption"
        color="textSecondary"
        style={styles.stationName}
      >
        {stationName} · {recipes.length} recipes
      </CozyText>

      <CozyList
        key={station}
        data={recipes}
        keyExtractor={(r) => r.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <RecipeRow
            recipe={item}
            owned={state.ingredients}
            onCook={() => show(game.cook(item.id).message)}
          />
        )}
      />
      <Toast message={message} top={130} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bgApp },
  pills: { padding: spacing.sm, gap: spacing.sm },
  stationName: { paddingHorizontal: spacing.md, paddingBottom: spacing.xs },
  list: { padding: spacing.sm, paddingRight: 18, gap: spacing.sm },
});
