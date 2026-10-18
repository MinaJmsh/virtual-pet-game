import { ArrowButton } from "@/components/cozy/ArrowButton";
import { CozyText } from "@/components/cozy/CozyText";
import { CurrencyPill } from "@/components/cozy/CurrencyPill";
import { TAB_ROW_HEIGHT } from "@/components/cozy/FolderTabRow";
import { GinghamHeader } from "@/components/cozy/GinghamHeader";
import { IconSource, Illustration } from "@/components/cozy/Illustration";
import { SHELF_HEIGHT } from "@/components/cozy/ShelfBar";
import { SketchBorder, SketchLine } from "@/components/cozy/SketchBorder";
import { Toast } from "@/components/cozy/Toast";
import { ActionBar } from "@/components/game/ActionBar";
import { BathShelf } from "@/components/game/BathShelf";
import { BubbleCloud } from "@/components/game/BubbleCloud";
import { CatDisplay } from "@/components/game/CatDisplay";
import { DecorateSheet } from "@/components/game/DecorateSheet";
import { DressSheet } from "@/components/game/DressSheet";
import { MealShelf } from "@/components/game/MealShelf";
import { NeedsPanel } from "@/components/game/NeedsPanel";
import { RoomBackground } from "@/components/game/RoomBackground";
import { BATH_STEPS } from "@/data/bathSteps";
import { RECIPES } from "@/data/recipes";
import { ROOM_ORDER, RoomAction, ROOMS } from "@/data/rooms";
import { BATH_STEP_GOAL, BATH_TAP_VALUE } from "@/game/config";
import { useGame } from "@/game/GameContext";
import { ActionResult, RoomId } from "@/game/types";
import { useToast } from "@/hooks/use-toast";
import { colors, radii, spacing } from "@/theme/tokens";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import Animated, { SlideInDown, SlideOutDown } from "react-native-reanimated";
// ...

const HIT_PAD = 24; // forgiving drop area around the cat
type Rect = { x: number; y: number; w: number; h: number };
type Mode = "none" | "decorate" | "dress";

export default function HomeScreen() {
  const router = useRouter();
  const game = useGame();
  const { state } = game;
  const { message, show } = useToast();
  const room = state.selectedRoom;
  const [panelHeight, setPanelHeight] = useState(150);
  const [mode, setMode] = useState<Mode>("none");

  const sheetOpen = mode !== "none";
  const asleep = state.cat.sleepingUntil !== null;
  // The meal being dragged from the shelf: drawn as a floating copy that follows the finger.
  const [drag, setDrag] = useState<{
    icon: IconSource;
    x: number;
    y: number;
  } | null>(null);
  const rootRef = useRef<View>(null);
  const rootPos = useRef({ x: 0, y: 0 });
  const measureRoot = () =>
    rootRef.current?.measureInWindow((x, y) => {
      rootPos.current = { x, y };
    });

  // --- where the cat is on screen (for drag & drop) ---
  const catBox = useRef<View>(null);
  const catRect = useRef<Rect | null>(null);
  const measureCat = () =>
    catBox.current?.measureInWindow((x, y, w, h) => {
      catRect.current = { x, y, w, h };
    });
  const overCat = (x: number, y: number) => {
    const r = catRect.current;
    return (
      !!r &&
      x >= r.x - HIT_PAD &&
      x <= r.x + r.w + HIT_PAD &&
      y >= r.y - HIT_PAD &&
      y <= r.y + r.h + HIT_PAD
    );
  };

  const report = (r: ActionResult) => show(r.message);
  // Switching rooms wakes a sleeping cat.
  const goToRoom = (next: RoomId) => {
    if (next === room) return;
    if (asleep) report(game.toggleSleep());
    game.selectRoom(next);
  };
  const changeRoom = (step: number) => {
    const i = ROOM_ORDER.indexOf(room);
    goToRoom(ROOM_ORDER[(i + step + ROOM_ORDER.length) % ROOM_ORDER.length]);
  };
  const onObjectPress = (action: RoomAction) => {
    if (action === "lamp") report(game.toggleSleep());
    else router.push("/games");
  };

  // --- kitchen: drag a cooked meal onto the cat ---
  const onMealStart = (recipeId: string, x: number, y: number) => {
    measureCat();
    measureRoot();
    setDrag({
      icon: RECIPES.find((r) => r.id === recipeId)?.icon ?? "🍽️",
      x,
      y,
    });
  };
  const onMealMove = (x: number, y: number) =>
    setDrag((d) => (d ? { ...d, x, y } : d));
  const onMealDrop = (recipeId: string, x: number, y: number) => {
    setDrag(null);
    if (overCat(x, y)) report(game.feedMeal(recipeId));
  };

  // --- bathroom: drag shampoo / shower / towel onto the cat and rub ---
  const [bath, setBath] = useState({ step: 0, progress: 0 });
  const bathRef = useRef(bath);
  const lastPoint = useRef<{ x: number; y: number } | null>(null);

  const addBath = (amount: number) => {
    const cur = bathRef.current;
    let next = {
      step: cur.step,
      progress: cur.progress + amount / BATH_STEP_GOAL,
    };
    if (next.progress >= 1) {
      if (cur.step < BATH_STEPS.length - 1)
        next = { step: cur.step + 1, progress: 0 };
      else {
        next = { step: 0, progress: 0 };
        report(game.bathe());
      }
    }
    bathRef.current = next;
    setBath(next);
  };
  const onBathStart = () => {
    measureCat();
    lastPoint.current = null;
    if (asleep) show("Shh… your cat is sleeping 💤");
  };
  const onBathMove = (key: string, x: number, y: number) => {
    const last = lastPoint.current;
    lastPoint.current = { x, y };
    if (
      asleep ||
      !last ||
      !overCat(x, y) ||
      key !== BATH_STEPS[bathRef.current.step].key
    )
      return;
    addBath(Math.hypot(x - last.x, y - last.y));
  };
  const onBathRelease = (key: string, x: number, y: number) => {
    lastPoint.current = null;
    if (asleep || !overCat(x, y)) return;
    const current = BATH_STEPS[bathRef.current.step];
    if (key === current.key) addBath(BATH_TAP_VALUE);
    else show(`Start with the ${current.title.toLowerCase()} first`);
  };
  const step = BATH_STEPS[bath.step];
  const cloudCount = Math.ceil(
    (step.cloudGrows ? bath.progress : 1 - bath.progress) * 8,
  );
  const showCloud = room === "bathroom" && (bath.step > 0 || bath.progress > 0);

  // Decorate / dress sheet: its top edge lines up with the top of the shelves (panel + shelf tall).
  const sheetBodyHeight = Math.max(
    120,
    Math.round(panelHeight + SHELF_HEIGHT - TAB_ROW_HEIGHT),
  );

  return (
    <View
      ref={rootRef}
      collapsable={false}
      onLayout={measureRoot}
      style={styles.screen}
    >
      <GinghamHeader>
        <CurrencyPill
          icon="🪙"
          value={state.coins}
          onPress={() => router.push("/shop")}
        />
        <CurrencyPill icon="🐟" value={state.ingredients.fish ?? 0} />
      </GinghamHeader>
      <View style={styles.room}>
        <RoomBackground
          room={room}
          dark={asleep && room === "bedroom"}
          placed={state.placed[room]}
          onObjectPress={onObjectPress}
        />
        <View style={styles.roomName}>
          <CozyText variant="title">{ROOMS[room].name}</CozyText>
          <SketchBorder radius={radii.pill} />
        </View>
        {mode !== "decorate" ? (
          <View style={styles.catArea} pointerEvents="box-none">
            <View
              ref={catBox}
              collapsable={false}
              onLayout={measureCat}
              style={styles.catBox}
            >
              <CatDisplay state={state} onPress={() => report(game.pet())} />
              {showCloud ? (
                <BubbleCloud emoji={step.cloud} count={cloudCount} />
              ) : null}
            </View>
          </View>
        ) : null}
        <View style={[styles.arrow, { left: spacing.md }]}>
          <ArrowButton direction="left" onPress={() => changeRoom(-1)} />
        </View>
        <View style={[styles.arrow, { right: spacing.md }]}>
          <ArrowButton direction="right" onPress={() => changeRoom(1)} />
        </View>
        {!sheetOpen && room === "kitchen" ? (
          <View style={styles.shelfSlot} pointerEvents="box-none">
            <MealShelf
              meals={state.meals}
              onDragStart={onMealStart}
              onDragMove={onMealMove}
              onDrop={onMealDrop}
              onCancel={() => setDrag(null)}
              onAdd={() => router.push("/kitchen")}
            />
          </View>
        ) : null}
        {!sheetOpen && room === "bathroom" ? (
          <View style={styles.shelfSlot} pointerEvents="box-none">
            <BathShelf
              stepIndex={bath.step}
              progress={bath.progress}
              onDragStart={onBathStart}
              onMove={onBathMove}
              onRelease={onBathRelease}
            />
          </View>
        ) : null}
        <Toast message={message} top={56} />
      </View>
      {/* Kept in the layout (just invisible) while a sheet is open so the room never changes size. */}
      <View
        style={[styles.panel, sheetOpen && styles.panelHidden]}
        pointerEvents={sheetOpen ? "none" : "auto"}
        onLayout={(e) => setPanelHeight(e.nativeEvent.layout.height)}
      >
        <SketchLine style={styles.panelLine} />
        <NeedsPanel needs={state.cat.needs} />
        <ActionBar
          onCook={() => router.push("/kitchen")}
          onDecorate={() => setMode("decorate")}
          onDress={() => setMode("dress")}
          onShop={() => router.push("/shop")}
        />
      </View>
      {sheetOpen ? (
        <Animated.View
          entering={SlideInDown.duration(220)}
          exiting={SlideOutDown.duration(220)}
          style={styles.sheetSlot}
        >
          {mode === "decorate" ? (
            <DecorateSheet
              room={room}
              onRoomChange={goToRoom}
              bodyHeight={sheetBodyHeight}
              onClose={() => setMode("none")}
              onToast={show}
            />
          ) : (
            <DressSheet
              bodyHeight={sheetBodyHeight}
              onClose={() => setMode("none")}
              onToast={show}
            />
          )}
        </Animated.View>
      ) : null}
      {drag ? (
        <View
          pointerEvents="none"
          style={[
            styles.ghost,
            {
              left: drag.x - rootPos.current.x - 28,
              top: drag.y - rootPos.current.y - 28,
            },
          ]}
        >
          <Illustration icon={drag.icon} size={56} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bgApp },
  room: { flex: 1, overflow: "hidden" },
  roomName: {
    alignSelf: "center",
    marginTop: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: 4,
    borderRadius: radii.pill,
    backgroundColor: colors.creamWhite,
  },
  catArea: {
    ...StyleSheet.absoluteFillObject,
    top: "36%",
    alignItems: "center",
  },
  catBox: { width: 220, height: 190 },
  arrow: { position: "absolute", top: "52%" },
  panel: {
    gap: spacing.lg,
    padding: spacing.md,
    paddingBottom: spacing.lg,
    backgroundColor: colors.bgApp,
  },
  panelHidden: { opacity: 0 },
  shelfSlot: { position: "absolute", left: 0, right: 0, bottom: 0 },
  sheetSlot: { position: "absolute", left: 0, right: 0, bottom: 0, zIndex: 40 },
  panelLine: { position: "absolute", left: 0, right: 0, top: -4 },
  ghost: {
    position: "absolute",
    width: 56,
    height: 56,
    zIndex: 60,
    alignItems: "center",
    justifyContent: "center",
  },
});
