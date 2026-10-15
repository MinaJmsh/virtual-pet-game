import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ActionButton } from '@/components/cozy/ActionButton';
import { BackButton } from '@/components/cozy/BackButton';
import { CozyText } from '@/components/cozy/CozyText';
import { CurrencyPill } from '@/components/cozy/CurrencyPill';
import { GinghamHeader } from '@/components/cozy/GinghamHeader';
import { PopupCard } from '@/components/cozy/PopupCard';
import { BubbleTarget } from '@/components/game/BubbleTarget';
import { BUBBLE_DURATION_S, BUBBLE_MAX_ON_SCREEN, BUBBLE_SPAWN_MS } from '@/game/config';
import { Bubble, coinsForBubbles, spawnBubble } from '@/game/bubbles';
import { useGame } from '@/game/GameContext';
import { ActionResult } from '@/game/types';
import { colors, spacing } from '@/theme/tokens';

type Phase = 'ready' | 'playing' | 'done';

/** Mini game: pop the floating bubbles. Coins = score (capped). */
export default function BubblePopScreen() {
  const router = useRouter();
  const game = useGame();
  const [phase, setPhase] = useState<Phase>('ready');
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(BUBBLE_DURATION_S);
  const [area, setArea] = useState({ w: 0, h: 0 });
  const [result, setResult] = useState<ActionResult | null>(null);
  const scoreRef = useRef(0);
  const idRef = useRef(0);

  const start = () => {
    scoreRef.current = 0;
    setScore(0);
    setBubbles([]);
    setResult(null);
    setTimeLeft(BUBBLE_DURATION_S);
    setPhase('playing');
  };

  useEffect(() => {
    if (phase !== 'playing') return;
    const spawn = setInterval(() => {
      const now = Date.now();
      setBubbles((list) => {
        const alive = list.filter((b) => b.expiresAt > now);
        return alive.length >= BUBBLE_MAX_ON_SCREEN ? alive : [...alive, spawnBubble(++idRef.current, now)];
      });
    }, BUBBLE_SPAWN_MS);
    const clock = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => { clearInterval(spawn); clearInterval(clock); };
  }, [phase]);

  useEffect(() => {
    if (phase === 'playing' && timeLeft <= 0) {
      setPhase('done');
      setBubbles([]);
      setResult(game.claimReward(coinsForBubbles(scoreRef.current)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, phase]);

  const onPop = (b: Bubble) => {
    scoreRef.current += b.points;
    setScore(scoreRef.current);
    setBubbles((list) => list.filter((x) => x.id !== b.id));
  };

  return (
    <View style={styles.screen}>
      <GinghamHeader>
        <BackButton />
        <CurrencyPill icon="⏱️" value={`${Math.max(0, timeLeft)}s`} />
        <CurrencyPill icon="🫧" value={score} />
      </GinghamHeader>

      <View
        style={styles.area}
        onLayout={(e) => setArea({ w: e.nativeEvent.layout.width, h: e.nativeEvent.layout.height })}
      >
        {phase === 'playing' && area.w > 0 &&
          bubbles.map((b) => <BubbleTarget key={b.id} bubble={b} areaWidth={area.w} areaHeight={area.h} onPop={onPop} />)}

        {phase === 'ready' && (
          <PopupCard>
            <CozyText variant="title">Bubble Pop 🫧</CozyText>
            <CozyText variant="label" style={styles.center}>Pop the bubbles before they float away! Balloons and stars are worth more.</CozyText>
            <ActionButton icon="🫧" label="Start" onPress={start} />
          </PopupCard>
        )}

        {phase === 'done' && result && (
          <PopupCard>
            <CozyText variant="title">Pop-tastic!</CozyText>
            <CozyText variant="label" style={styles.center}>Score: {score}</CozyText>
            <CozyText variant="numberLarge">{result.message}</CozyText>
            <View style={styles.buttons}>
              <ActionButton icon="🔁" label="Again" onPress={start} />
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
  area: { flex: 1, backgroundColor: colors.pinkLight, overflow: 'hidden' },
  center: { textAlign: 'center' },
  buttons: { flexDirection: 'row', gap: spacing.lg },
});
