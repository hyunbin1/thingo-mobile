import { Text } from '@/components/ui/text';
import { AllSectionHeader, BoardMeta } from '@/features/slides/components/all/all-tab-shared';
import { slidesTheme } from '@/features/slides/lib/slides-theme';
import type { SlideListItem } from '@/features/slides/model/slide-mock-data';
import { Pressable, StyleSheet, View } from 'react-native';

type AllSlidesBoardSectionProps = {
  mode: 'hot' | 'default';
  items: SlideListItem[];
  onSeeMorePress?: () => void;
};

export function AllSlidesBoardSection({ mode, items, onSeeMorePress }: AllSlidesBoardSectionProps) {
  return (
    <View style={styles.section}>
      <AllSectionHeader
        title={mode === 'hot' ? 'HOT 게시판' : '게시판'}
        accent={mode === 'hot' ? 'hot' : 'default'}
        onSeeMorePress={onSeeMorePress}
      />

      <View style={styles.card}>
        {items.map((item, index) => (
          <Pressable
            key={item.id}
            style={[styles.row, index < items.length - 1 ? styles.rowBorder : undefined]}
          >
            <Text numberOfLines={mode === 'default' ? 2 : 1} style={styles.title}>
              {item.title}
            </Text>
            <View style={styles.bottomRow}>
              <Text style={styles.date}>{item.metaLeft}</Text>
              <BoardMeta likes={item.counts?.likes} comments={item.counts?.comments} />
            </View>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    backgroundColor: '#FFFFFF',
    paddingTop: 20,
    paddingBottom: 8,
    gap: 12,
  },
  card: {
    marginHorizontal: 16,
    borderRadius: 12,
    backgroundColor: slidesTheme.colors.surface,
    overflow: 'hidden',
  },
  row: {
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: slidesTheme.colors.borderSoft,
  },
  title: {
    fontSize: 14,
    lineHeight: 21,
    color: slidesTheme.colors.textStrong,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  date: {
    fontSize: 11,
    lineHeight: 16,
    color: slidesTheme.colors.textSoft,
  },
});
