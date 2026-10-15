import React from 'react';
import { Text, TextProps } from 'react-native';
import { ColorName, colors, typography, TypographyVariant } from '@/theme/tokens';

interface Props extends TextProps {
  variant?: TypographyVariant;
  color?: ColorName;
}

export function CozyText({ variant = 'label', color = 'textPrimary', style, ...rest }: Props) {
  return <Text {...rest} style={[typography[variant], { color: colors[color] }, style]} />;
}
