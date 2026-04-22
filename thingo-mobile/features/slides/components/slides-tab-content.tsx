import { Text } from '@/components/ui/text';
import { AllTabScreen } from '@/features/slides/components/all/all-tab-screen';
import { SlidesCampusMapPanel } from '@/features/slides/components/slides-campus-map-panel';
import { SlidesSectionShell } from '@/features/slides/components/slides-section-shell';
import { type SlideTab } from '@/features/slides/constants/slide-tabs';
import { slidesTheme } from '@/features/slides/lib/slides-theme';
import {
  boardItems,
  newsVideoItems,
  newspaperItems,
  noticeItems,
  scheduleItems,
  slideMealSummary,
} from '@/features/slides/model/slide-mock-data';
import { Heart, MessageCircle, Play } from 'lucide-react-native';
import { Pressable, ScrollView, StyleSheet, View, type ViewStyle } from 'react-native';

type SlidesTabContentProps = {
  tab: SlideTab;
  activeTab: SlideTab;
  onNavigateToTab: (tab: SlideTab) => void;
  onBannerInteractionChange?: (isInteracting: boolean) => void;
};

export function SlidesTabContent({
  tab,
  activeTab,
  onNavigateToTab,
  onBannerInteractionChange,
}: SlidesTabContentProps) {
  if (tab === 'ALL') {
    return (
      <AllTabScreen
        onNavigateToTab={onNavigateToTab}
        onBannerInteractionChange={onBannerInteractionChange}
      />
    );
  }

  if (tab === '학식') {
    return (
      <TabScrollFrame style={styles.pageBackground}>
        <SlidesSectionShell title='학식' subtitle='메인 식단 요약을 탭 단위 화면으로 확장한 상태입니다.'>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryDate}>{slideMealSummary.dateLabel}</Text>
            <Text style={styles.summaryLocation}>{slideMealSummary.location}</Text>
            <View style={styles.tagRow}>
              {slideMealSummary.tags.map((tag) => (
                <View key={tag} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        </SlidesSectionShell>
      </TabScrollFrame>
    );
  }

  if (tab === '게시판') {
    return (
      <TabScrollFrame style={styles.pageBackground}>
        <SlidesSectionShell title='게시판' subtitle='ALL 탭과 같은 카드 톤을 유지한 게시판 전용 화면입니다.'>
          <View style={styles.listBlock}>
            {boardItems.map((item) => (
              <Pressable key={item.id} style={styles.boardCard}>
                <Text style={styles.listTitle}>{item.title}</Text>
                <View style={styles.boardMetaRow}>
                  <Text style={styles.listMeta}>{item.metaLeft}</Text>
                  {activeTab === '게시판' ? (
                    <View style={styles.boardCounts}>
                      <View style={styles.boardCountItem}>
                        <Heart size={12} color={slidesTheme.colors.iconBlue} />
                        <Text style={styles.countText}>NN</Text>
                      </View>
                      <View style={styles.boardCountItem}>
                        <MessageCircle size={12} color={slidesTheme.colors.iconBlue} />
                        <Text style={styles.countText}>NN</Text>
                      </View>
                    </View>
                  ) : null}
                </View>
              </Pressable>
            ))}
          </View>
        </SlidesSectionShell>
      </TabScrollFrame>
    );
  }

  if (tab === '명지도') {
    return (
      <TabScrollFrame style={styles.pageBackground}>
        <SlidesCampusMapPanel />
      </TabScrollFrame>
    );
  }

  if (tab === '공지사항') {
    return (
      <TabScrollFrame style={styles.pageBackground}>
        <SlidesSectionShell title='공지사항' subtitle='인문캠퍼스 기준 공지 목록입니다.'>
          <View style={styles.listBlock}>
            {noticeItems.map((item) => (
              <Pressable key={item.id} style={styles.listCard}>
                <Text style={styles.listCategory}>{item.category}</Text>
                <Text style={styles.listTitle}>{item.title}</Text>
                <Text style={styles.listMeta}>{item.metaRight}</Text>
              </Pressable>
            ))}
          </View>
        </SlidesSectionShell>
      </TabScrollFrame>
    );
  }

  if (tab === '학사일정') {
    return (
      <TabScrollFrame style={styles.pageBackground}>
        <SlidesSectionShell title='학사일정' subtitle='인문캠퍼스 기준 일정 목록입니다.'>
          <View style={styles.listBlock}>
            {scheduleItems.map((item) => (
              <View key={item.id} style={styles.scheduleCard}>
                <Text style={styles.scheduleTime}>{item.timeLabel}</Text>
                <Text style={styles.scheduleTitle}>{item.title}</Text>
              </View>
            ))}
          </View>
        </SlidesSectionShell>
      </TabScrollFrame>
    );
  }

  if (tab === '명대신문') {
    return (
      <TabScrollFrame style={styles.pageBackground}>
        <SlidesSectionShell title='명대신문' subtitle='명대신문 카드형 목록입니다.'>
          <View style={styles.listBlock}>
            {newspaperItems.map((item) => (
              <Pressable key={item.id} style={styles.mediaCard}>
                <View style={styles.logoBox}>
                  <Text style={styles.logoText}>MJU</Text>
                </View>
                <View style={styles.mediaBody}>
                  <Text style={styles.mediaTitle}>{item.title}</Text>
                  <Text style={styles.mediaSummary}>{item.summary}</Text>
                  <Text style={styles.listMeta}>{item.dateLabel}</Text>
                </View>
              </Pressable>
            ))}
          </View>
        </SlidesSectionShell>
      </TabScrollFrame>
    );
  }

  return (
    <TabScrollFrame style={styles.pageBackground}>
      <SlidesSectionShell title='명대뉴스' subtitle='영상 카드형 명대뉴스 목록입니다.'>
        <View style={styles.listBlock}>
          {newsVideoItems.map((item) => (
            <Pressable key={item.id} style={styles.videoCard}>
              <View style={styles.videoThumb}>
                <View style={styles.playButton}>
                  <Play size={16} fill='#FFFFFF' color='#FFFFFF' />
                </View>
              </View>
              <View style={styles.videoBody}>
                <Text style={styles.mediaTitle}>{item.title}</Text>
                <Text style={styles.listMeta}>{item.dateLabel}</Text>
              </View>
            </Pressable>
          ))}
        </View>
      </SlidesSectionShell>
    </TabScrollFrame>
  );
}

function TabScrollFrame({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
}) {
  return (
    <ScrollView
      style={style}
      contentContainerStyle={styles.pageContent}
      showsVerticalScrollIndicator={false}
      nestedScrollEnabled
    >
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  pageBackground: {
    backgroundColor: slidesTheme.colors.page,
  },
  pageContent: {
    paddingTop: 10,
    paddingBottom: 24,
    gap: 8,
  },
  summaryCard: {
    borderRadius: 18,
    backgroundColor: slidesTheme.colors.surface,
    borderWidth: 1,
    borderColor: slidesTheme.colors.border,
    padding: 14,
    gap: 8,
  },
  summaryDate: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '800',
    color: slidesTheme.colors.textStrong,
  },
  summaryLocation: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '700',
    color: slidesTheme.colors.textStrong,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tag: {
    borderRadius: 999,
    backgroundColor: '#EEF4FB',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  tagText: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '700',
    color: '#5579A7',
  },
  listBlock: {
    gap: 10,
  },
  listCard: {
    borderRadius: 16,
    backgroundColor: slidesTheme.colors.surface,
    borderWidth: 1,
    borderColor: slidesTheme.colors.border,
    padding: 14,
    gap: 6,
  },
  listCategory: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '700',
    color: '#6F7787',
  },
  listTitle: {
    fontSize: 13,
    lineHeight: 18,
    color: slidesTheme.colors.textStrong,
  },
  listMeta: {
    fontSize: 11,
    lineHeight: 14,
    color: '#B1B8C5',
  },
  scheduleCard: {
    flexDirection: 'row',
    gap: 10,
    borderRadius: 16,
    backgroundColor: slidesTheme.colors.surface,
    borderWidth: 1,
    borderColor: slidesTheme.colors.border,
    padding: 14,
  },
  scheduleTime: {
    width: 72,
    fontSize: 11,
    lineHeight: 15,
    color: '#8E97A6',
  },
  scheduleTitle: {
    flex: 1,
    fontSize: 12,
    lineHeight: 17,
    color: slidesTheme.colors.textStrong,
  },
  boardCard: {
    borderRadius: 16,
    backgroundColor: slidesTheme.colors.surface,
    borderWidth: 1,
    borderColor: slidesTheme.colors.border,
    padding: 14,
    gap: 8,
  },
  boardMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  boardCounts: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  boardCountItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  countText: {
    fontSize: 11,
    lineHeight: 14,
    color: '#9AA4B4',
  },
  mediaCard: {
    flexDirection: 'row',
    gap: 10,
    borderRadius: 16,
    backgroundColor: slidesTheme.colors.surface,
    borderWidth: 1,
    borderColor: slidesTheme.colors.border,
    padding: 10,
  },
  logoBox: {
    width: 80,
    height: 80,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F6FAFF',
  },
  logoText: {
    fontSize: 19,
    lineHeight: 22,
    fontWeight: '800',
    color: slidesTheme.colors.primary,
  },
  mediaBody: {
    flex: 1,
    gap: 4,
  },
  mediaTitle: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '700',
    color: slidesTheme.colors.textStrong,
  },
  mediaSummary: {
    fontSize: 11,
    lineHeight: 15,
    color: '#586273',
  },
  videoCard: {
    borderRadius: 16,
    backgroundColor: slidesTheme.colors.surface,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: slidesTheme.colors.border,
  },
  videoThumb: {
    height: 164,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6FC5D1',
  },
  playButton: {
    width: 42,
    height: 30,
    borderRadius: 12,
    backgroundColor: '#FF2E2E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoBody: {
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
});
