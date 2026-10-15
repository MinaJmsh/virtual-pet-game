import React from 'react';
import { StyleSheet, View } from 'react-native';
import { CozyText } from '@/components/cozy/CozyText';
import { Draggable } from '@/components/cozy/Draggable';
import { Illustration } from '@/components/cozy/Illustration';
import { ProgressBar } from '@/components/cozy/ProgressBar';
import { ShelfBar } from '@/components/cozy/ShelfBar';
import { BATH_STEPS } from '@/data/bathSteps';
import { spacing } from '@/theme/tokens';

interface Props {
  stepIndex: number;
  progress: number; // 0..1 of the current step
  onDragStart: (key: string) => void;
  onMove: (key: string, x: number, y: number) => void;
  onRelease: (key: string, x: number, y: number) => void;
}

/** Shampoo, shower and towel. Drag each onto the cat and rub, in order. */
export function BathShelf({ stepIndex, progress, onDragStart, onMove, onRelease }: Props) {
  const step = BATH_STEPS[stepIndex];
  return (
    <ShelfBar title={`Step ${stepIndex + 1}/${BATH_STEPS.length} · ${step.hint}`}>
      {BATH_STEPS.map((s, i) => (
        <Draggable
          key={s.key}
          onDragStart={() => onDragStart(s.key)}
          onMove={(x, y) => onMove(s.key, x, y)}
          onRelease={(x, y) => onRelease(s.key, x, y)}
        >
          <View style={[styles.tool, i !== stepIndex && styles.dim]}>
            <Illustration icon={i < stepIndex ? '✅' : s.tool} size={44} />
            <CozyText variant="caption">{s.title}</CozyText>
          </View>
        </Draggable>
      ))}
      <View style={styles.bar}><ProgressBar value={progress} /></View>
    </ShelfBar>
  );
}

const styles = StyleSheet.create({
  tool: { alignItems: 'center', gap: 2, paddingHorizontal: spacing.xs },
  dim: { opacity: 0.5 },
  bar: { flex: 1 },
});
