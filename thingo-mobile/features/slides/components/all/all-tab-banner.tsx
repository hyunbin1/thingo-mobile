import { Text } from '@/components/ui/text';
import { slidesTheme } from '@/features/slides/lib/slides-theme';
import type { SlideBannerItem } from '@/features/slides/model/slide-mock-data';
import * as React from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';

type AllSlidesBannerProps = {
  items: SlideBannerItem[];
  onInteractionChange?: (isInteracting: boolean) => void;
};

const AUTO_PLAY_MS = 5000;
const CARD_WIDTH = 350;
const CARD_HEIGHT = 200;
const CARD_GAP = 10;

export function AllSlidesBanner({ items, onInteractionChange }: AllSlidesBannerProps) {
  const { width } = useWindowDimensions();
  const scrollRef = React.useRef<ScrollView>(null);
  const releaseTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const sidePeek = Math.max((width - CARD_WIDTH) / 2, 0);
  const loopItems = React.useMemo(() => {
    if (items.length <= 1) return items;
    return [items[items.length - 1], ...items, items[0]];
  }, [items]);

  const initialLoopIndex = items.length > 1 ? 1 : 0;
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [isInteracting, setIsInteracting] = React.useState(false);
  const loopIndexRef = React.useRef(initialLoopIndex);

  const setInteraction = React.useCallback(
    (nextValue: boolean) => {
      setIsInteracting(nextValue);
      onInteractionChange?.(nextValue);
    },
    [onInteractionChange]
  );

  const clearReleaseTimer = React.useCallback(() => {
    if (releaseTimerRef.current) {
      clearTimeout(releaseTimerRef.current);
      releaseTimerRef.current = null;
    }
  }, []);

  const scheduleInteractionRelease = React.useCallback(() => {
    clearReleaseTimer();
    releaseTimerRef.current = setTimeout(() => {
      setInteraction(false);
    }, 120);
  }, [clearReleaseTimer, setInteraction]);

  const getOffset = React.useCallback(
    (index: number) => index * (CARD_WIDTH + CARD_GAP),
    []
  );

  React.useEffect(() => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ x: getOffset(initialLoopIndex), animated: false });
    });
  }, [getOffset, initialLoopIndex]);

  React.useEffect(() => {
    if (items.length <= 1 || isInteracting) return;

    const interval = setInterval(() => {
      const nextIndex = loopIndexRef.current + 1;
      scrollRef.current?.scrollTo({ x: getOffset(nextIndex), animated: true });
    }, AUTO_PLAY_MS);

    return () => clearInterval(interval);
  }, [getOffset, isInteracting, items.length]);

  React.useEffect(() => () => clearReleaseTimer(), [clearReleaseTimer]);

  const syncLoopEdges = React.useCallback(
    (rawIndex: number) => {
      if (items.length <= 1) {
        setActiveIndex(0);
        loopIndexRef.current = 0;
        return;
      }

      if (rawIndex === 0) {
        const target = items.length;
        loopIndexRef.current = target;
        setActiveIndex(items.length - 1);
        requestAnimationFrame(() => {
          scrollRef.current?.scrollTo({ x: getOffset(target), animated: false });
        });
        return;
      }

      if (rawIndex === items.length + 1) {
        loopIndexRef.current = 1;
        setActiveIndex(0);
        requestAnimationFrame(() => {
          scrollRef.current?.scrollTo({ x: getOffset(1), animated: false });
        });
        return;
      }

      loopIndexRef.current = rawIndex;
      setActiveIndex(rawIndex - 1);
    },
    [getOffset, items.length]
  );

  const handleMomentumEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const nextLoopIndex = Math.round(
      event.nativeEvent.contentOffset.x / Math.max(CARD_WIDTH + CARD_GAP, 1)
    );
    syncLoopEdges(nextLoopIndex);
  };

  return (
    <View style={styles.section}>
      <ScrollView
        ref={scrollRef}
        horizontal
        decelerationRate='fast'
        snapToInterval={CARD_WIDTH + CARD_GAP}
        snapToAlignment='start'
        showsHorizontalScrollIndicator={false}
        directionalLockEnabled
        nestedScrollEnabled
        contentContainerStyle={[styles.bannerScrollContent, { paddingHorizontal: sidePeek }]}
        onTouchStart={() => {
          clearReleaseTimer();
          setInteraction(true);
        }}
        onTouchEnd={scheduleInteractionRelease}
        onTouchCancel={scheduleInteractionRelease}
        onScrollBeginDrag={() => {
          clearReleaseTimer();
          setInteraction(true);
        }}
        onScrollEndDrag={scheduleInteractionRelease}
        onMomentumScrollEnd={handleMomentumEnd}
      >
        {loopItems.map((item, index) => (
          <BannerCard key={`${item.id}-${index}`} item={item} />
        ))}
      </ScrollView>

      <View style={styles.indicatorRow}>
        {items.map((item, index) => (
          <View
            key={item.id}
            style={[styles.indicator, index === activeIndex ? styles.indicatorActive : undefined]}
          />
        ))}
      </View>
    </View>
  );
}

function BannerCard({ item }: { item: SlideBannerItem }) {
  return (
    <Pressable
      style={[
        styles.bannerCard,
        item.bordered ? styles.bannerCardBordered : undefined,
      ]}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.bannerImage} resizeMode='cover' />
      {item.overlayImageUrl ? (
        <Image source={{ uri: item.overlayImageUrl }} style={styles.bannerImage} resizeMode='cover' />
      ) : null}
      <View style={[styles.blueOverlay, item.overlayTone ? { backgroundColor: item.overlayTone } : null]} />
      <View style={styles.bottomOverlay} />

      <View style={styles.bannerContent}>
        <View style={styles.bannerIndexRow}>
          <View style={styles.bannerIndex}>
            <Text style={styles.bannerIndexText}>{item.pageLabel}</Text>
          </View>
        </View>

        <View style={styles.bannerBottom}>
          <View style={styles.bannerBadge}>
            <Text style={styles.bannerBadgeText}>{item.badge}</Text>
          </View>
          <Text style={styles.bannerTitle}>{item.title}</Text>
          <Text style={styles.bannerSubtitle}>{item.subtitle}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: 8,
    backgroundColor: '#FFFFFF',
    paddingTop: 20,
  },
  bannerScrollContent: {
    gap: CARD_GAP,
  },
  bannerCard: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 16,
    overflow: 'hidden',
    padding: 16,
  },
  bannerCardBordered: {
    borderWidth: 0.6,
    borderColor: '#8BC7FF',
  },
  bannerImage: {
    ...StyleSheet.absoluteFillObject,
  },
  blueOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  bottomOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(37, 135, 255, 0.35)',
  },
  bannerContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  bannerIndexRow: {
    width: '100%',
    alignItems: 'flex-end',
  },
  bannerIndex: {
    borderRadius: 100,
    backgroundColor: 'rgba(23, 23, 27, 0.6)',
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  bannerIndexText: {
    fontSize: 12,
    lineHeight: 18,
    color: '#FFFFFF',
  },
  bannerBottom: {
    padding: 8,
    gap: 12,
  },
  bannerBadge: {
    alignSelf: 'flex-start',
    borderRadius: 6,
    backgroundColor: slidesTheme.colors.primarySoft,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  bannerBadgeText: {
    fontSize: 12,
    lineHeight: 15,
    fontWeight: '700',
    color: slidesTheme.colors.primaryStrong,
  },
  bannerTitle: {
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  bannerSubtitle: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '600',
    color: slidesTheme.colors.primarySoft,
  },
  indicatorRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    paddingBottom: 8,
  },
  indicator: {
    width: 4,
    height: 4,
    borderRadius: 999,
    backgroundColor: slidesTheme.colors.textPlaceholder,
  },
  indicatorActive: {
    backgroundColor: '#3B96FF',
  },
});
