import { AllSlidesBanner } from '@/features/slides/components/all/all-tab-banner';
import { AllSlidesBoardSection } from '@/features/slides/components/all/all-tab-board-section';
import { AllSlidesFooter } from '@/features/slides/components/all/all-tab-footer';
import { AllSlidesMealSummaryCard } from '@/features/slides/components/all/all-tab-meal-summary-card';
import { AllSlidesNewsSection } from '@/features/slides/components/all/all-tab-news-section';
import { AllSlidesNoticeSection } from '@/features/slides/components/all/all-tab-notice-section';
import { AllSlidesQuickLinks } from '@/features/slides/components/all/all-tab-quick-links';
import { AllSlidesScheduleSection } from '@/features/slides/components/all/all-tab-schedule-section';
import { type SlideTab } from '@/features/slides/constants/slide-tabs';
import { slidesTheme } from '@/features/slides/lib/slides-theme';
import {
  boardItems,
  hotBoardItems,
  hotNoticeItems,
  newspaperItems,
  newsVideoItems,
  noticeItems,
  scheduleItems,
  slideBannerItems,
  slideMealSummary,
  slideQuickLinks,
} from '@/features/slides/model/slide-mock-data';
import { ScrollView, StyleSheet } from 'react-native';

type AllTabScreenProps = {
  onNavigateToTab: (tab: SlideTab) => void;
  onBannerInteractionChange?: (isInteracting: boolean) => void;
};

/**
 * ALL 탭은 새 PM 시안의 섹션 순서를 그대로 유지한다.
 * 웹에서 재사용한 정보 구조 위에 새 비주얼을 입힌다.
 */
export function AllTabScreen({
  onNavigateToTab,
  onBannerInteractionChange,
}: AllTabScreenProps) {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      nestedScrollEnabled
    >
      <AllSlidesBanner
        items={slideBannerItems}
        onInteractionChange={onBannerInteractionChange}
      />
      <AllSlidesQuickLinks
        items={slideQuickLinks}
        onPressItem={(item) => onNavigateToTab(item.targetTab)}
      />
      <AllSlidesMealSummaryCard summary={slideMealSummary} />
      <AllSlidesNoticeSection
        mode='hot'
        items={hotNoticeItems}
        onSeeMorePress={() => onNavigateToTab('공지사항')}
      />
      <AllSlidesBoardSection
        mode='hot'
        items={hotBoardItems}
        onSeeMorePress={() => onNavigateToTab('게시판')}
      />
      <AllSlidesNoticeSection
        mode='default'
        items={noticeItems}
        onSeeMorePress={() => onNavigateToTab('공지사항')}
      />
      <AllSlidesScheduleSection
        items={scheduleItems}
        onSeeMorePress={() => onNavigateToTab('학사일정')}
      />
      <AllSlidesBoardSection
        mode='default'
        items={boardItems}
        onSeeMorePress={() => onNavigateToTab('게시판')}
      />
      <AllSlidesNewsSection
        type='newspaper'
        items={newspaperItems}
        onSeeMorePress={() => onNavigateToTab('명대신문')}
      />
      <AllSlidesNewsSection
        type='video'
        items={newsVideoItems}
        onSeeMorePress={() => onNavigateToTab('명대뉴스')}
      />
      <AllSlidesFooter />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: slidesTheme.colors.page,
  },
  content: {
    paddingTop: 8,
    paddingBottom: 24,
    gap: 8,
  },
});
