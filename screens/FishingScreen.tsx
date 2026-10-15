import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ActionButton } from '@/components/cozy/ActionButton';
import { BackButton } from '@/components/cozy/BackButton';
import { CozyText } from '@/components/cozy/CozyText';
import { CurrencyPill } from '@/components/cozy/CurrencyPill';
import { GinghamHeader } from '@/components/cozy/GinghamHeader';
import { PopupCard } from '@/components/cozy/PopupCard';
import { FishTarget } from '@/components/game/FishTarget';
import { Pond } from '@/components/game/Pond';
import { FISHING_DURATION_S, FISH_MAX_ON_SCREEN, FISH_SPAWN_MS } from '@/game/config';
import { Fish, spawnFish } from '@/game/fishing';
import { useGame } from '@/game/GameContext';
import { ActionResult } from '@/game/types';
import { colors, spacing } from '@/theme/tokens';

type Phase = 'ready' | 'playing' | 'done';

export default function FishingScreen() {
  const router = useRouter();
  const game = useGame();
  const [phase, setPhase] = useState<Phase>('ready');
  const [fishes, setFishes] = useState<Fish[]>([]);
  const [score, setScore] = useState(0);
  const [caught, setCaught] = useState(0);
  const [timeLeft, setTimeLeft] = useState(FISHING_DURATION_S);
  const [pond, setPond] = useState({ w: 0, h: 0 });
  const [result, setResult] = useState<ActionResult | null>(null);
  const scoreRef = useRef(0);
  const caughtRef = useRef(0);
  const idRef = useRef(0);

  const start = () => {
    scoreRef.current = 0;
    caughtRef.current = 0;
    setScore(0);
    setCaught(0);
    setFishes([]);
    setResult(null);
    setTimeLeft(FISHING_DURATION_S);
    setPhase('playing');
  };

  useEffect(() => {
    if (phase !== 'playing') return;
    const spawn = setInterval(() => {
      const now = Date.now();
      setFishes((list) => {
        const alive = list.filter((f) => f.expiresAt > now);
        return alive.length >= FISH_MAX_ON_SCREEN ? alive : [...alive, spawnFish(++idRef.current, now)];
      });
    }, FISH_SPAWN_MS);
    const clock = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => { clearInterval(spawn); clearInterval(clock); };
  }, [phase]);

  useEffect(() => {
    if (phase === 'playing' && timeLeft <= 0) {
      setPhase('done');
      setFishes([]);
      // Every fish you caught is added to your fish stock (the 🐟 counter), plus coins from the score.
      setResult(game.claimFishing(scoreRef.current, caughtRef.current));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, phase]);

  const onCatch = (fish: Fish) => {
    scoreRef.current += fish.points;
    caughtRef.current += 1;
    setScore(scoreRef.current);
    setCaught(caughtRef.current);
    setFishes((list) => list.filter((f) => f.id !== fish.id));
  };

  return (
    <View style={styles.screen}>
      <GinghamHeader>
        <BackButton />
        <CurrencyPill icon="⏱️" value={`${Math.max(0, timeLeft)}s`} />
        <CurrencyPill icon="🐟" value={caught} />
      </GinghamHeader>

      <View style={styles.pondWrap}>
        <Pond onLayout={(e) => setPond({ w: e.nativeEvent.layout.width, h: e.nativeEvent.layout.height })} />
        {phase === 'playing' && pond.w > 0 &&
          fishes.map((f) => <FishTarget key={f.id} fish={f} pondWidth={pond.w} pondHeight={pond.h} onCatch={onCatch} />)}

        {phase === 'ready' && (
          <PopupCard>
            <CozyText variant="title">Fishing 🎣</CozyText>
            <CozyText variant="label" style={styles.center}>Tap the fish before they swim away! Every fish you catch goes to your stock, and rarer fish earn more coins.</CozyText>
            <ActionButton icon="🎣" label="Start" onPress={start} />
          </PopupCard>
        )}

        {phase === 'done' && result && (
          <PopupCard>
            <CozyText variant="title">Nice catch!</CozyText>
            <CozyText variant="label" style={styles.center}>Score: {score} · Fish caught: {caught}</CozyText>
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
  pondWrap: { flex: 1 },
  center: { textAlign: 'center' },
  buttons: { flexDirection: 'row', gap: spacing.lg },
});
