import React from 'react';
import { StyleSheet, View } from 'react-native';
import { CozyText } from '@/components/cozy/CozyText';
import { Draggable } from '@/components/cozy/Draggable';
import { Illustration } from '@/components/cozy/Illustration';
import { ShelfBar } from '@/components/cozy/ShelfBar';
import { SketchBorder } from '@/components/cozy/SketchBorder';
import { RECIPES } from '@/data/recipes';
import { colors, outlineWidth, spacing } from '@/theme/tokens';

interface Props {
  meals: Record<string, number>;
  onDragStart: () => void;
  onDrop: (recipeId: string, x: number, y: number) => void;
}

/** Cooked meals waiting to be fed. Drag one onto the cat. */
export function MealShelf({ meals, onDragStart, onDrop }: Props) {
  const ready = RECIPES.filter((r) => (meals[r.id] ?? 0) > 0);
  return (
    <ShelfBar title="Drag a meal to your cat">
      {ready.length === 0 ? (
        <CozyText variant="label" color="textSecondary">Nothing cooked yet. Tap Cook below 🍳</CozyText>
      ) : (
        ready.map((r) => {
          const n = meals[r.id];
          return (
            <Draggable key={r.id} onDragStart={onDragStart} onRelease={(x, y) => onDrop(r.id, x, y)}>
              <View style={styles.item}>
                <View>
                  <Illustration icon={r.icon} size={46} />
                  {n > 1 ? (
                    <View style={styles.badge}>
                      <CozyText variant="caption">x{n}</CozyText>
                      <SketchBorder radius={999} />
                    </View>
                  ) : null}
                </View>
                <CozyText variant="caption">{r.name}</CozyText>
              </View>
            </Draggable>
          );
        })
      )}
    </ShelfBar>
  );
}

const styles = StyleSheet.create({
  item: { alignItems: 'center', gap: 2, paddingHorizontal: spacing.xs },
  badge: {
    position: 'absolute',
    top: -4,
    right: -10,
    paddingHorizontal: 5,
    borderRadius: 999,
    backgroundColor: colors.creamWhite,
  },
});
