import { Text } from '@/components/ui/text';
import { SlidesTabBar } from '@/features/slides/components/slides-tab-bar';
import { SlidesTabContent } from '@/features/slides/components/slides-tab-content';
import { SLIDE_TABS, getSlideTabIndex, type SlideTab } from '@/features/slides/constants/slide-tabs';
import { getLastSelectedSlideTab, setLastSelectedSlideTab } from '@/features/slides/lib/slides-session';
import { slidesTheme } from '@/features/slides/lib/slides-theme';
import { Menu, Search, House, Lock, SquareStack } from 'lucide-react-native';
import { Stack } from 'expo-router';
import * as React from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
  useWindowDimensions,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';

export function SlidesHomeScreen() {
  const { width } = useWindowDimensions();
  const pagerRef = React.useRef<ScrollView>(null);
  const [activeTab, setActiveTab] = React.useState<SlideTab>(() => getLastSelectedSlideTab());
  const [isBannerInteracting, setIsBannerInteracting] = React.useState(false);

  React.useEffect(() => {
    setLastSelectedSlideTab(activeTab);
  }, [activeTab]);

  React.useEffect(() => {
    const nextOffset = getSlideTabIndex(activeTab) * width;
    pagerRef.current?.scrollTo({ x: nextOffset, animated: false });
  }, [activeTab, width]);

  const syncTab = React.useCallback((tab: SlideTab, animated: boolean) => {
    setActiveTab(tab);
    pagerRef.current?.scrollTo({ x: getSlideTabIndex(tab) * width, animated });
  }, [width]);

  const handlePagerMomentumEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const nextIndex = Math.round(event.nativeEvent.contentOffset.x / Math.max(width, 1));
    const nextTab = SLIDE_TABS[nextIndex];

    if (nextTab) {
      setActiveTab(nextTab);
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle='dark-content' backgroundColor='#FFFFFF' />
        <View style={styles.container}>
          <View style={styles.browserBar}>
            <View style={styles.statusBar}>
              <Text style={styles.statusTime}>12:30</Text>
              <View style={styles.statusIcons}>
                <View style={styles.statusDot} />
                <View style={styles.statusBarIcon} />
                <Text style={styles.batteryText}>50%</Text>
              </View>
            </View>

            <View style={styles.chromeBar}>
              <House size={18} color='#3D4043' />
              <View style={styles.addressBar}>
                <Lock size={12} color='#17171B' />
                <Text style={styles.addressText}>thingo.kr</Text>
              </View>
              <SquareStack size={18} color='#3D4043' />
              <Menu size={20} color='#3D4043' />
            </View>
          </View>

          <View style={styles.gnb}>
            <Text style={styles.logoText}>Th</Text>
            <Pressable style={styles.searchField}>
              <Search size={18} color={slidesTheme.colors.textSoft} />
            </Pressable>
            <Pressable style={styles.menuButton}>
              <Menu size={22} color={slidesTheme.colors.textStrong} />
            </Pressable>
          </View>

          <SlidesTabBar activeTab={activeTab} onTabPress={(tab) => syncTab(tab, true)} />

          <ScrollView
            ref={pagerRef}
            horizontal
            pagingEnabled
            scrollEnabled={!isBannerInteracting}
            showsHorizontalScrollIndicator={false}
            directionalLockEnabled
            nestedScrollEnabled
            onMomentumScrollEnd={handlePagerMomentumEnd}
            contentOffset={{ x: getSlideTabIndex(activeTab) * width, y: 0 }}
            style={styles.pager}
          >
            {SLIDE_TABS.map((tab) => (
              <View key={tab} style={[styles.page, { width }]}>
                <SlidesTabContent
                  tab={tab}
                  activeTab={activeTab}
                  onNavigateToTab={(nextTab) => syncTab(nextTab, true)}
                  onBannerInteractionChange={tab === 'ALL' ? setIsBannerInteracting : undefined}
                />
              </View>
            ))}
          </ScrollView>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  browserBar: {
    borderBottomWidth: 1,
    borderBottomColor: '#F1F3F4',
    backgroundColor: '#FFFFFF',
  },
  statusBar: {
    height: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 22,
    paddingRight: 15,
  },
  statusTime: {
    fontSize: 13,
    lineHeight: 15,
    fontWeight: '500',
    color: '#000000',
  },
  statusIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    backgroundColor: '#000000',
  },
  statusBarIcon: {
    width: 12,
    height: 12,
    borderRadius: 2,
    backgroundColor: '#000000',
  },
  batteryText: {
    fontSize: 13,
    lineHeight: 15,
    color: '#000000',
  },
  chromeBar: {
    height: 62,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 12,
    backgroundColor: '#FFFFFF',
  },
  addressBar: {
    flex: 1,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F3F4',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 13,
  },
  addressText: {
    fontSize: 15,
    lineHeight: 18,
    color: '#000000',
  },
  gnb: {
    height: 60,
    paddingLeft: 12,
    paddingRight: 17,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
  },
  logoText: {
    width: 48,
    textAlign: 'center',
    fontSize: 28,
    lineHeight: 32,
    fontWeight: '800',
    color: slidesTheme.colors.primary,
    fontStyle: 'italic',
  },
  searchField: {
    flex: 1,
    height: 36,
    borderRadius: 50,
    backgroundColor: '#F0F2F5',
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  menuButton: {
    width: 28,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pager: {
    flex: 1,
    backgroundColor: slidesTheme.colors.page,
  },
  page: {
    flex: 1,
    backgroundColor: slidesTheme.colors.page,
  },
});
