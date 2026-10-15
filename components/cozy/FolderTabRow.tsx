import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, outlineWidth, radii, spacing } from '@/theme/tokens';
import { IconSource, Illustration } from './Illustration';
import { NotificationDot } from './NotificationDot';
import { PressableScale } from './PressableScale';

export interface FolderTab {
  key: string;
  icon: IconSource;
  badge?: boolean;
}

interface Props {
  tabs: FolderTab[];
  activeKey: string;
  onChange: (key: string) => void;
}

const TAB_H = 36;
const LINE = outlineWidth.regular;

/** Folder tabs sitting on a divider line. The active tab covers the line so it merges with the panel. */
export function FolderTabRow({ tabs, activeKey, onChange }: Props) {
  return (
    <View style={styles.row}>
      <View style={styles.line} />
      {tabs.map((tab, i) => {
        const active = tab.key === activeKey;
        return (
          <PressableScale
            key={tab.key}
            onPress={() => onChange(tab.key)}
            scaleTo={0.97}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            style={[styles.tab, active ? styles.active : styles.inactive, i > 0 && { marginLeft: -LINE }]}
          >
            <Illustration icon={tab.icon} size={26} />
            {tab.badge ? <NotificationDot /> : null}
          </PressableScale>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-end', height: TAB_H + 8 + LINE, paddingLeft: spacing.md, backgroundColor: colors.bgApp },
  line: { position: 'absolute', left: 0, right: 0, bottom: 0, height: LINE, backgroundColor: colors.outline },
  tab: {
    width: 66,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: radii.tab,
    borderTopRightRadius: radii.tab,
    borderWidth: LINE,
    borderColor: colors.outline,
    borderBottomWidth: 0,
  },
  inactive: { height: TAB_H, marginBottom: LINE, backgroundColor: colors.coral, zIndex: 1 },
  active: { height: TAB_H + 8 + LINE, backgroundColor: colors.bgApp, zIndex: 2 },
});
