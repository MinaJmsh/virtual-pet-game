import React from 'react';
import { Nunito_500Medium, Nunito_600SemiBold, useFonts } from '@expo-google-fonts/nunito';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GameProvider } from '@/game/GameContext';
import { colors } from '@/theme/tokens';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({ Nunito_500Medium, Nunito_600SemiBold });
  if (!fontsLoaded) return null;

  return (
    <GameProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bgApp }, animation: 'fade' }} />
    </GameProvider>
  );
}
