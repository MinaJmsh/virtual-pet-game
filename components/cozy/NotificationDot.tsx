import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '@/theme/tokens';

export function NotificationDot() {
  return <View style={styles.dot} />;
}

const styles = StyleSheet.create({
  dot: {
    position: 'absolute',
    top: -5,
    right: -5,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.accentRed,
    borderWidth: 2,
    borderColor: colors.creamWhite,
  },
});
