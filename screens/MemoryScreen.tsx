import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ActionButton } from '@/components/cozy/ActionButton';
import { BackButton } from '@/components/cozy/BackButton';
import { CozyText } from '@/components/cozy/CozyText';
import { CurrencyPill } from '@/components/cozy/CurrencyPill';
import { GinghamHeader } from '@/components/cozy/GinghamHeader';
import { PopupCard } from '@/components/cozy/PopupCard';
import { PressableScale } from '@/components/cozy/PressableScale';
import { MEMORY_MAX_COINS, MEMORY_MIN_COINS } from '@/game/config';
import { useGame } from '@/game/GameContext';
import { ActionResult } from '@/game/types';
import { colors, outlineWidth, radii, spacing } from '@/theme/tokens';

const FACES = ['🐟', '🍣', '🧶', '🎀', '🐭', '🥛'];

interface Card { id: number; emoji: string; matched: boolean }

function deal(): Card[] {
  const deck = [...FACES, ...FACES].map((emoji, id) => ({ id, emoji, matched: false }));
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

/** Mini game: find all the pairs. Fewer mistakes = more coins. */
export default function MemoryScreen() {
  const router = useRouter();
  const game = useGame();
  const [cards, setCards] = useState<Card[]>(deal);
  const [open, setOpen] = useState<number[]>([]);
  const [misses, setMisses] = useState(0);
  const [result, setResult] = useState<ActionResult | null>(null);
  const lock = useRef(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  useEffect(() => {
    if (!result && cards.every((c) => c.matched)) {
      const coins = Math.max(MEMORY_MIN_COINS, MEMORY_MAX_COINS - misses);
      setResult(game.claimReward(coins));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cards]);

  const later = (fn: () => void, ms: number) => { timers.current.push(setTimeout(fn, ms)); };

  const flip = (index: number) => {
    if (lock.current || cards[index].matched || open.includes(index)) return;
    const next = [...open, index];
    setOpen(next);
    if (next.length < 2) return;
    lock.current = true;
    const [a, b] = next;
    if (cards[a].emoji === cards[b].emoji) {
      later(() => {
        setCards((list) => list.map((c, i) => (i === a || i === b ? { ...c, matched: true } : c)));
        setOpen([]);
        lock.current = false;
      }, 400);
    } else {
      setMisses((m) => m + 1);
      later(() => { setOpen([]); lock.current = false; }, 750);
    }
  };

  const again = () => {
    timers.current.forEach(clearTimeout);
    lock.current = false;
    setCards(deal());
    setOpen([]);
    setMisses(0);
    setResult(null);
  };

  return (
    <View style={styles.screen}>
      <GinghamHeader>
        <BackButton />
        <CurrencyPill icon="❌" value={misses} />
      </GinghamHeader>

      <View style={styles.board}>
        <CozyText variant="label" color="textSecondary" style={styles.hint}>Find all the pairs. Fewer mistakes, more coins!</CozyText>
        <View style={styles.grid}>
          {cards.map((c, i) => {
            const faceUp = c.matched || open.includes(i);
            return (
              <View key={c.id} style={styles.slot}>
                <PressableScale
                  onPress={() => flip(i)}
                  accessibilityRole="button"
                  accessibilityLabel={faceUp ? c.emoji : 'Hidden card'}
                  style={[styles.card, faceUp ? (c.matched ? styles.matched : styles.up) : styles.down]}
                >
                  <CozyText variant="title" style={styles.face}>{faceUp ? c.emoji : '❓'}</CozyText>
                </PressableScale>
              </View>
            );
          })}
        </View>

        {result && (
          <PopupCard>
            <CozyText variant="title">All matched!</CozyText>
            <CozyText variant="label">Mistakes: {misses}</CozyText>
            <CozyText variant="numberLarge">{result.message}</CozyText>
            <View style={styles.buttons}>
              <ActionButton icon="🔁" label="Again" onPress={again} />
              <ActionButton icon="🎮" label="Games" onPress={() => router.back()} />
            </View>
          </PopupCard>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bgApp },
  board: { flex: 1, padding: spacing.lg, gap: spacing.md },
  hint: { textAlign: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  slot: { width: '33.33%', aspectRatio: 1, padding: spacing.xs },
  card: { flex: 1, borderRadius: radii.cell, borderWidth: outlineWidth.regular, borderColor: colors.outline, alignItems: 'center', justifyContent: 'center' },
  down: { backgroundColor: colors.coral },
  up: { backgroundColor: colors.creamWhite },
  matched: { backgroundColor: colors.cardFill, borderColor: colors.outlineSoft },
  face: { fontSize: 38, lineHeight: 46 },
  buttons: { flexDirection: 'row', gap: spacing.lg },
});
