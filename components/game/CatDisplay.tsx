import { PressableScale } from "@/components/cozy/PressableScale";
import { getItem } from "@/data/items";
import { getCatFace } from "@/game/mood";
import { GameState } from "@/game/types";
import { colors } from "@/theme/tokens";
import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

/** Placeholder cat: emoji face on a coral rug. Swap the <Text> for your Krita sprite later. */
export function CatDisplay({
  state,
  onPress,
}: {
  state: GameState;
  onPress: () => void;
}) {
  const reduceMotion = useReducedMotion();
  const bob = useSharedValue(0);

  useEffect(() => {
    if (reduceMotion) return;
    bob.value = withRepeat(
      withSequence(
        withTiming(-3, { duration: 1000 }),
        withTiming(0, { duration: 1000 }),
      ),
      -1,
    );
  }, [reduceMotion, bob]);

  const bobStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bob.value }],
  }));
  const head = getItem(state.equipped.head)?.icon as string | undefined;
  const neck = getItem(state.equipped.neck)?.icon as string | undefined;
  const top = getItem(state.equipped.top)?.icon as string | undefined;

  return (
    <View style={styles.wrap}>
      {/* <View style={styles.rug}>
        <SketchBorder radius={27} />
      </View> */}
      <PressableScale
        onPress={onPress}
        scaleTo={0.97}
        accessibilityRole="button"
        accessibilityLabel={`Pet ${state.cat.name}`}
      >
        <Animated.View style={[styles.cat, bobStyle]}>
          <Text style={styles.face}>{getCatFace(state.cat)}</Text>
          {head ? <Text style={styles.head}>{head}</Text> : null}
          {neck ? <Text style={styles.neck}>{neck}</Text> : null}
          {top ? <Text style={styles.top}>{top}</Text> : null}
        </Animated.View>
      </PressableScale>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: "center", justifyContent: "flex-end", height: 190 },
  rug: {
    position: "absolute",
    bottom: 4,
    width: 200,
    height: 54,
    borderRadius: 100,
    backgroundColor: colors.coral,
  },
  cat: { alignItems: "center", marginBottom: 18 },
  face: { fontSize: 100, lineHeight: 130 },
  head: { position: "absolute", top: -14, fontSize: 40, lineHeight: 46 },
  neck: { position: "absolute", bottom: 30, fontSize: 30, lineHeight: 36 },
  top: { position: "absolute", bottom: -22, fontSize: 40, lineHeight: 46 },
});
