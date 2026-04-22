import { Text } from '@/components/ui/text';
import { AllSectionHeader } from '@/features/slides/components/all/all-tab-shared';
import { slidesTheme } from '@/features/slides/lib/slides-theme';
import type { SlideNewspaperItem, SlideVideoItem } from '@/features/slides/model/slide-mock-data';
import { Play } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';

type AllSlidesNewsSectionProps =
  | {
      type: 'newspaper';
      items: SlideNewspaperItem[];
      onSeeMorePress?: () => void;
    }
  | {
      type: 'video';
      items: SlideVideoItem[];
      onSeeMorePress?: () => void;
    };

export function AllSlidesNewsSection(props: AllSlidesNewsSectionProps) {
  return (
    <View style={[styles.section, props.type === 'video' ? styles.videoSection : undefined]}>
      <AllSectionHeader
        title={props.type === 'newspaper' ? '명대신문' : '명대뉴스'}
        onSeeMorePress={props.onSeeMorePress}
        filterLabels={props.type === 'newspaper' ? ['전체', '보도', '사회'] : undefined}
      />

      <View style={styles.list}>
        {props.type === 'newspaper'
          ? props.items.map((item, index) => (
              <NewspaperCard key={item.id} item={item} highlighted={index === 0} />
            ))
          : props.items.map((item) => <VideoCard key={item.id} item={item} />)}
      </View>
    </View>
  );
}

function NewspaperCard({
  item,
  highlighted,
}: {
  item: SlideNewspaperItem;
  highlighted: boolean;
}) {
  return (
    <Pressable style={[styles.newspaperCard, highlighted ? styles.highlightedCard : undefined]}>
      <View style={styles.logoBox}>
        <Text style={styles.logoText}>MJU</Text>
      </View>
      <View style={styles.newspaperBody}>
        <Text numberOfLines={1} style={styles.cardTitle}>
          {item.title}
        </Text>
        <Text numberOfLines={2} style={styles.summary}>
          {item.summary}
        </Text>
        <Text style={styles.publisher}>{item.publisher}</Text>
        <Text style={styles.dateLabel}>{item.dateLabel}</Text>
      </View>
    </Pressable>
  );
}

function VideoCard({ item }: { item: SlideVideoItem }) {
  return (
    <Pressable style={styles.videoCard}>
      <View style={styles.videoThumb}>
        <View style={styles.channelBadge}>
          <Text style={styles.channelText}>{item.channelLabel}</Text>
        </View>
        <View style={styles.playButton}>
          <Play size={16} fill='#FFFFFF' color='#FFFFFF' />
        </View>
      </View>
      <View style={styles.videoBody}>
        <Text numberOfLines={2} style={styles.videoTitle}>
          {item.title}
        </Text>
        <Text style={styles.dateLabel}>{item.dateLabel}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  section: {
    backgroundColor: '#FFFFFF',
    paddingTop: 20,
    paddingBottom: 8,
    gap: 12,
  },
  videoSection: {
    backgroundColor: slidesTheme.colors.sectionMuted,
    paddingBottom: 36,
    gap: 16,
  },
  list: {
    gap: 8,
    paddingHorizontal: 16,
  },
  newspaperCard: {
    flexDirection: 'row',
    gap: 16,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: slidesTheme.colors.borderSoft,
    padding: 16,
  },
  highlightedCard: {
    backgroundColor: slidesTheme.colors.primarySoft,
  },
  logoBox: {
    width: 110,
    height: 103,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: slidesTheme.colors.border,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 28,
    lineHeight: 32,
    fontWeight: '800',
    color: slidesTheme.colors.primary,
  },
  newspaperBody: {
    flex: 1,
    gap: 2,
  },
  cardTitle: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
    color: slidesTheme.colors.textStrong,
  },
  summary: {
    fontSize: 14,
    lineHeight: 21,
    color: slidesTheme.colors.textStrong,
  },
  publisher: {
    marginTop: 'auto',
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '600',
    color: slidesTheme.colors.textSoft,
  },
  dateLabel: {
    fontSize: 11,
    lineHeight: 16,
    color: slidesTheme.colors.textSoft,
  },
  videoCard: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
  videoThumb: {
    height: 198,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#7CB7C8',
  },
  channelBadge: {
    position: 'absolute',
    left: 12,
    top: 12,
    borderRadius: 999,
    backgroundColor: 'rgba(0,0,0,0.35)',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  channelText: {
    fontSize: 10,
    lineHeight: 13,
    color: '#FFFFFF',
  },
  playButton: {
    width: 44,
    height: 32,
    borderRadius: 12,
    backgroundColor: '#FF2E2E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoBody: {
    gap: 2,
    paddingHorizontal: 16,
    paddingVertical: 9,
    backgroundColor: '#FFFFFF',
  },
  videoTitle: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
    color: slidesTheme.colors.textStrong,
  },
});
