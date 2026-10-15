import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ActionButton } from '@/components/cozy/ActionButton';
import { BackButton } from '@/components/cozy/BackButton';
import { CozyList } from '@/components/cozy/CozyList';
import { CozyText } from '@/components/cozy/CozyText';
import { CurrencyPill } from '@/components/cozy/CurrencyPill';
import { FolderTabRow } from '@/components/cozy/FolderTabRow';
import { GinghamHeader } from '@/components/cozy/GinghamHeader';
import { Illustration } from '@/components/cozy/Illustration';
import { RowCard } from '@/components/cozy/RowCard';
import { useGame } from '@/game/GameContext';
import { colors, spacing } from '@/theme/tokens';

const GAMES = [
  { id: 'fishing', name: 'Fishing', icon: '🎣', route: '/fishing', info: 'Catch fish: earns coins and fish!' },
  { id: 'bubbles', name: 'Bubble Pop', icon: '🫧', route: '/bubbles', info: 'Pop bubbles: earns coins.' },
  { id: 'memory', name: 'Memory Match', icon: '🃏', route: '/memory', info: 'Find the pairs: earns coins.' },
] as const;

/** Mini games menu, opened from the 🎮 in the playroom. */
export default function GamesScreen() {
  const router = useRouter();
  const { state } = useGame();
  return (
    <View style={styles.screen}>
      <GinghamHeader>
        <BackButton />
        <CurrencyPill icon="🪙" value={state.coins} />
        <CurrencyPill icon="🐟" value={state.ingredients.fish ?? 0} />
      </GinghamHeader>
      <FolderTabRow tabs={[{ key: 'games', icon: '🎮' }]} activeKey="games" onChange={() => {}} />
      <CozyList
        data={GAMES}
        keyExtractor={(g) => g.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <RowCard>
            <Illustration icon={item.icon} size={48} />
            <View style={styles.middle}>
              <CozyText variant="title">{item.name}</CozyText>
              <CozyText variant="label" color="textSecondary">{item.info}</CozyText>
            </View>
            <ActionButton icon="🎮" label="Play" onPress={() => router.push(item.route)} />
          </RowCard>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bgApp },
  list: { padding: spacing.sm, paddingRight: 18, gap: spacing.sm },
  middle: { flex: 1, gap: spacing.xs },
});
