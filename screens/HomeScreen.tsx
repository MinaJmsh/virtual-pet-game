import React, { useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowButton } from '@/components/cozy/ArrowButton';
import { CozyText } from '@/components/cozy/CozyText';
import { CurrencyPill } from '@/components/cozy/CurrencyPill';
import { GinghamHeader } from '@/components/cozy/GinghamHeader';
import { Toast } from '@/components/cozy/Toast';
import { ActionBar } from '@/components/game/ActionBar';
import { BathShelf } from '@/components/game/BathShelf';
import { BubbleCloud } from '@/components/game/BubbleCloud';
import { CatDisplay } from '@/components/game/CatDisplay';
import { MealShelf } from '@/components/game/MealShelf';
import { NeedsPanel } from '@/components/game/NeedsPanel';
import { RoomBackground } from '@/components/game/RoomBackground';
import { BATH_STEPS } from '@/data/bathSteps';
import { RoomAction, ROOM_ORDER, ROOMS } from '@/data/rooms';
import { BATH_STEP_GOAL, BATH_TAP_VALUE } from '@/game/config';
import { useGame } from '@/game/GameContext';
import { ActionResult } from '@/game/types';
import { useToast } from '@/hooks/use-toast';
import { colors, outlineWidth, radii, spacing } from '@/theme/tokens';

const HIT_PAD = 24; // forgiving drop area around the cat
type Rect = { x: number; y: number; w: number; h: number };

export default function HomeScreen() {
  const router = useRouter();
  const game = useGame();
  const { state } = game;
  const { message, show } = useToast();
  const room = state.selectedRoom;
  const asleep = state.cat.sleepingUntil !== null;

  // --- where the cat is on screen (for drag & drop) ---
  const catBox = useRef<View>(null);
  const catRect = useRef<Rect | null>(null);
  const measureCat = () => catBox.current?.measureInWindow((x, y, w, h) => { catRect.current = { x, y, w, h }; });
  const overCat = (x: number, y: number) => {
    const r = catRect.current;
    return !!r && x >= r.x - HIT_PAD && x <= r.x + r.w + HIT_PAD && y >= r.y - HIT_PAD && y <= r.y + r.h + HIT_PAD;
  };

  const report = (r: ActionResult) => show(r.message);
  const changeRoom = (step: number) => {
    const i = ROOM_ORDER.indexOf(room);
    game.selectRoom(ROOM_ORDER[(i + step + ROOM_ORDER.length) % ROOM_ORDER.length]);
  };
  const onObjectPress = (action: RoomAction) => {
    if (action === 'lamp') report(game.toggleSleep());
    else router.push('/games');
  };

  // --- kitchen: drag a cooked meal onto the cat ---
  const onMealDrop = (recipeId: string, x: number, y: number) => {
    if (overCat(x, y)) report(game.feedMeal(recipeId));
  };

  // --- bathroom: drag shampoo / shower / towel onto the cat and rub ---
  const [bath, setBath] = useState({ step: 0, progress: 0 });
  const bathRef = useRef(bath);
  const lastPoint = useRef<{ x: number; y: number } | null>(null);

  const addBath = (amount: number) => {
    const cur = bathRef.current;
    let next = { step: cur.step, progress: cur.progress + amount / BATH_STEP_GOAL };
    if (next.progress >= 1) {
      if (cur.step < BATH_STEPS.length - 1) next = { step: cur.step + 1, progress: 0 };
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
    if (asleep) show('Shh… your cat is sleeping 💤');
  };
  const onBathMove = (key: string, x: number, y: number) => {
    const last = lastPoint.current;
    lastPoint.current = { x, y };
    if (asleep || !last || !overCat(x, y) || key !== BATH_STEPS[bathRef.current.step].key) return;
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
  const cloudCount = Math.ceil((step.cloudGrows ? bath.progress : 1 - bath.progress) * 8);
  const showCloud = room === 'bathroom' && (bath.step > 0 || bath.progress > 0);

  return (
    <View style={styles.screen}>
      <GinghamHeader>
        <CurrencyPill icon="🪙" value={state.coins} onPress={() => router.push('/shop')} />
        <CurrencyPill icon="🐟" value={state.ingredients.fish ?? 0} />
      </GinghamHeader>

      <View style={styles.room}>
        <RoomBackground
          room={room}
          dark={asleep && room === 'bedroom'}
          placed={state.placed[room]}
          onObjectPress={onObjectPress}
        />
        <View style={styles.roomName}>
          <CozyText variant="title">{ROOMS[room].name}</CozyText>
        </View>
        <View style={styles.catArea} pointerEvents="box-none">
          <View ref={catBox} collapsable={false} onLayout={measureCat} style={styles.catBox}>
            <CatDisplay state={state} onPress={() => report(game.pet())} />
            {showCloud ? <BubbleCloud emoji={step.cloud} count={cloudCount} /> : null}
          </View>
        </View>
        <View style={[styles.arrow, { left: spacing.md }]}><ArrowButton direction="left" onPress={() => changeRoom(-1)} /></View>
        <View style={[styles.arrow, { right: spacing.md }]}><ArrowButton direction="right" onPress={() => changeRoom(1)} /></View>
        <Toast message={message} top={56} />
      </View>

      {room === 'kitchen' ? <MealShelf meals={state.meals} onDragStart={measureCat} onDrop={onMealDrop} /> : null}
      {room === 'bathroom' ? (
        <BathShelf stepIndex={bath.step} progress={bath.progress} onDragStart={onBathStart} onMove={onBathMove} onRelease={onBathRelease} />
      ) : null}

      <View style={styles.panel}>
        <NeedsPanel needs={state.cat.needs} />
        <ActionBar
          onCook={() => router.push('/kitchen')}
          onDecorate={() => router.push('/decorate')}
          onDress={() => router.push('/wardrobe')}
          onShop={() => router.push('/shop')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bgApp },
  room: { flex: 1, overflow: 'hidden' },
  roomName: {
    alignSelf: 'center',
    marginTop: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: 4,
    borderRadius: radii.pill,
    backgroundColor: colors.creamWhite,
    borderWidth: outlineWidth.regular,
    borderColor: colors.outline,
  },
  catArea: { ...StyleSheet.absoluteFillObject, top: '36%', alignItems: 'center' },
  catBox: { width: 220, height: 190 },
  arrow: { position: 'absolute', top: '52%' },
  panel: {
    gap: spacing.lg,
    padding: spacing.md,
    paddingBottom: spacing.lg,
    backgroundColor: colors.bgApp,
    borderTopWidth: outlineWidth.regular,
    borderTopColor: colors.outline,
  },
});
