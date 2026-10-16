import React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Nunito_500Medium, Nunito_600SemiBold, useFonts } from '@expo-google-fonts/nunito';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GameProvider } from '@/game/GameContext';
import { colors } from '@/theme/tokens';

/** Keeps every screen above the Android navigation bar / gesture area. */
function Shell({ children }: { children: React.ReactNode }) {
  const insets = useSafeAreaInsets();
  return <View style={{ flex: 1, paddingBottom: insets.bottom, backgroundColor: colors.bgApp }}>{children}</View>;
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({ Nunito_500Medium, Nunito_600SemiBold });
  if (!fontsLoaded) return null;

  return (
    <GameProvider>
      <StatusBar style="dark" />
      <Shell>
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bgApp }, animation: 'fade' }} />
      </Shell>
    </GameProvider>
  );
}
