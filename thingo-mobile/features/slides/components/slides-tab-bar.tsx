import { Text } from '@/components/ui/text';
import { SLIDE_TABS, type SlideTab } from '@/features/slides/constants/slide-tabs';
import { slidesTheme } from '@/features/slides/lib/slides-theme';
import * as React from 'react';
import { Pressable, ScrollView, StyleSheet, type LayoutChangeEvent, View } from 'react-native';

type SlidesTabBarProps = {
  activeTab: SlideTab;
  onTabPress: (tab: SlideTab) => void;
};

type TabLayout = {
  x: number;
  width: number;
};

export function SlidesTabBar({ activeTab, onTabPress }: SlidesTabBarProps) {
  const scrollRef = React.useRef<ScrollView>(null);
  const containerWidthRef = React.useRef(0);
  const tabLayoutsRef = React.useRef<Partial<Record<SlideTab, TabLayout>>>({});

  React.useEffect(() => {
    const layout = tabLayoutsRef.current[activeTab];
    const containerWidth = containerWidthRef.current;

    if (!layout || containerWidth === 0) {
      return;
    }

    const centeredX = Math.max(0, layout.x - containerWidth / 2 + layout.width / 2);
    scrollRef.current?.scrollTo({ x: centeredX, animated: true });
  }, [activeTab]);

  const handleContainerLayout = (event: LayoutChangeEvent) => {
    containerWidthRef.current = event.nativeEvent.layout.width;
  };

  const handleTabLayout = (tab: SlideTab, event: LayoutChangeEvent) => {
    const { x, width } = event.nativeEvent.layout;
    tabLayoutsRef.current[tab] = { x, width };
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        onLayout={handleContainerLayout}
        contentContainerStyle={styles.content}
      >
        {SLIDE_TABS.map((tab) => {
          const isActive = tab === activeTab;

          return (
            <Pressable
              key={tab}
              onLayout={(event) => handleTabLayout(tab, event)}
              onPress={() => onTabPress(tab)}
              style={styles.tab}
            >
              <Text style={[styles.tabLabel, isActive ? styles.activeLabel : styles.inactiveLabel]}>
                {tab}
              </Text>
              {isActive ? <View style={styles.activeIndicator} /> : null}
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 39,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: slidesTheme.colors.border,
  },
  content: {
    minHeight: 39,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  tab: {
    height: 39,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  tabLabel: {
    fontSize: 14,
    lineHeight: 21,
  },
  activeLabel: {
    color: slidesTheme.colors.primary,
    fontWeight: '600',
  },
  inactiveLabel: {
    color: slidesTheme.colors.textMuted,
    fontWeight: '500',
  },
  activeIndicator: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    left: 0,
    height: 2,
    backgroundColor: slidesTheme.colors.primary,
  },
});
