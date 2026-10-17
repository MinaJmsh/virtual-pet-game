import { ActionButton } from "@/components/cozy/ActionButton";
import { CozyText } from "@/components/cozy/CozyText";
import { Illustration } from "@/components/cozy/Illustration";
import { RowCard } from "@/components/cozy/RowCard";
import { INGREDIENTS, Recipe } from "@/data/recipes";
import { spacing } from "@/theme/tokens";
import React from "react";
import { StyleSheet, View } from "react-native";
const COOK_HAT = require("../../assets/icons/cookhat.png");

interface Props {
  recipe: Recipe;
  owned: Record<string, number>;
  onCook: () => void;
}

export function RecipeRow({ recipe, owned, onCook }: Props) {
  const chips = recipe.ingredients.map(({ id, amount }) => {
    const ing = INGREDIENTS[id];
    const have = ing.infinite ? Infinity : (owned[id] ?? 0);
    return { id, icon: ing.icon, amount, have, enough: have >= amount };
  });
  const canCook = chips.every((c) => c.enough);

  return (
    <RowCard>
      <Illustration icon={recipe.icon} size={48} />
      <View style={styles.middle}>
        <CozyText
          variant="title"
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.8}
        >
          {recipe.name}
        </CozyText>
        <View style={styles.chips}>
          {chips.map((c) => (
            <View key={c.id} style={styles.chip}>
              <Illustration icon={c.icon} size={28} />
              <CozyText
                variant="caption"
                color={c.enough ? "textPrimary" : "textSecondary"}
              >
                {c.have === Infinity ? "∞" : c.have}/{c.amount}
              </CozyText>
            </View>
          ))}
        </View>
      </View>
      <ActionButton
        icon={COOK_HAT}
        label="Cook"
        onPress={onCook}
        disabled={!canCook}
      />
    </RowCard>
  );
}

const styles = StyleSheet.create({
  middle: { flex: 1, gap: spacing.sm },
  chips: { flexDirection: "row", gap: spacing.md },
  chip: { alignItems: "center" },
});
