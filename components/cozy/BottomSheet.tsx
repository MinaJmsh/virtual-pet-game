import React, { ReactNode, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withTiming } from 'react-native-reanimated';
import { colors, spacing } from '@/theme/tokens';
import { CollapseButton } from './CollapseButton';
import { FolderTab, FolderTabRow } from './FolderTabRow';

interface Props {
  tabs: FolderTab[];
  activeTab: string;
  onTabChange: (key: string) => void;
  collapsed: boolean;
  onToggleCollapsed: () => void;
  bodyHeight: number; // content height when open
  overlap?: boolean; // let the tab strip overlap the view above it
  children: ReactNode;
}

/** Folder-tab strip + collapsible body. Slides closed in 220ms via the red chevron button. */
export function BottomSheet({ tabs, activeTab, onTabChange, collapsed, onToggleCollapsed, bodyHeight, overlap, children }: Props) {
  const reduceMotion = useReducedMotion();
  const height = useSharedValue(collapsed ? 0 : bodyHeight);

  useEffect(() => {
    height.value = withTiming(collapsed ? 0 : bodyHeight, { duration: reduceMotion ? 0 : 220 });
  }, [collapsed, bodyHeight, reduceMotion, height]);

  const bodyStyle = useAnimatedStyle(() => ({ height: height.value }));

  return (
    <View style={styles.sheet}>
      <View>
        <FolderTabRow tabs={tabs} activeKey={activeTab} onChange={onTabChange} overlap={overlap} />
        <View style={styles.collapse}>
          <CollapseButton collapsed={collapsed} onPress={onToggleCollapsed} />
        </View>
      </View>
      <Animated.View style={[styles.body, bodyStyle]}>
        <View style={{ height: bodyHeight }}>{children}</View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  sheet: {}, // transparent: the room shows beside the tab bump
  body: { overflow: 'hidden', backgroundColor: colors.bgApp },
  collapse: { position: 'absolute', right: spacing.md, bottom: 8, zIndex: 3 },
});
