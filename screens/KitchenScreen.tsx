import React from 'react';
import { StyleSheet, View } from 'react-native';
import { BackButton } from '@/components/cozy/BackButton';
import { CozyList } from '@/components/cozy/CozyList';
import { CurrencyPill } from '@/components/cozy/CurrencyPill';
import { FolderTabRow } from '@/components/cozy/FolderTabRow';
import { GinghamHeader } from '@/components/cozy/GinghamHeader';
import { Toast } from '@/components/cozy/Toast';
import { RecipeRow } from '@/components/game/RecipeRow';
import { RECIPES } from '@/data/recipes';
import { useGame } from '@/game/GameContext';
import { useToast } from '@/hooks/use-toast';
import { colors, spacing } from '@/theme/tokens';

export default function KitchenScreen() {
  const game = useGame();
  const { message, show } = useToast();
  const { state } = game;

  return (
    <View style={styles.screen}>
      <GinghamHeader>
        <BackButton />
        <CurrencyPill icon="🐟" value={state.ingredients.fish ?? 0} />
        <CurrencyPill icon="🪙" value={state.coins} />
      </GinghamHeader>
      <FolderTabRow tabs={[{ key: 'recipes', icon: '🍳' }]} activeKey="recipes" onChange={() => {}} />
      <CozyList
        data={RECIPES}
        keyExtractor={(r) => r.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <RecipeRow recipe={item} owned={state.ingredients} onCook={() => show(game.cook(item.id).message)} />
        )}
      />
      <Toast message={message} top={130} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bgApp },
  list: { padding: spacing.sm, paddingRight: 18, gap: spacing.sm },
});
