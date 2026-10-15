import React from 'react';
import { Image, ImageSourcePropType, Text } from 'react-native';

export type IconSource = string | ImageSourcePropType;

/** One place to render art. Emoji strings now; pass require('...png') once you draw assets in Krita. */
export function Illustration({ icon, size = 32 }: { icon: IconSource; size?: number }) {
  if (typeof icon === 'string') {
    return <Text style={{ fontSize: size * 0.8, lineHeight: size, width: size, textAlign: 'center' }}>{icon}</Text>;
  }
  return <Image source={icon} style={{ width: size, height: size }} resizeMode="contain" />;
}
