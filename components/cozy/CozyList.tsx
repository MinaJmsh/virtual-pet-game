import React, { useState } from 'react';
import { FlatList, FlatListProps, View } from 'react-native';
import { Scrollbar } from './Scrollbar';

type Props<T> = Omit<FlatListProps<T>, 'showsVerticalScrollIndicator' | 'scrollEventThrottle'>;

/** FlatList with the coral always-visible scrollbar overlay. */
export function CozyList<T>({ onScroll, onContentSizeChange, ...rest }: Props<T>) {
  const [viewHeight, setViewHeight] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);
  const [offset, setOffset] = useState(0);

  return (
    <View style={{ flex: 1 }} onLayout={(e) => setViewHeight(e.nativeEvent.layout.height)}>
      <FlatList
        {...rest}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={(e) => {
          setOffset(e.nativeEvent.contentOffset.y);
          onScroll?.(e);
        }}
        onContentSizeChange={(w, h) => {
          setContentHeight(h);
          onContentSizeChange?.(w, h);
        }}
      />
      <Scrollbar viewHeight={viewHeight} contentHeight={contentHeight} offset={offset} />
    </View>
  );
}
