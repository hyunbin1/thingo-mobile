import { Text } from '@/components/ui/text';
import { AllSectionHeader } from '@/features/slides/components/all/all-tab-shared';
import { slidesTheme } from '@/features/slides/lib/slides-theme';
import type { SlideListItem } from '@/features/slides/model/slide-mock-data';
import { noticeFilterLabels } from '@/features/slides/model/slide-mock-data';
import { Pressable, StyleSheet, View } from 'react-native';

type AllSlidesNoticeSectionProps = {
  mode: 'hot' | 'default';
  items: SlideListItem[];
  onSeeMorePress?: () => void;
};

export function AllSlidesNoticeSection({ mode, items, onSeeMorePress }: AllSlidesNoticeSectionProps) {
  return (
    <View style={styles.section}>
      <AllSectionHeader
        title={mode === 'hot' ? 'HOT 공지사항' : '공지사항'}
        accent={mode === 'hot' ? 'hot' : 'default'}
        onSeeMorePress={onSeeMorePress}
        filterLabels={mode === 'default' ? noticeFilterLabels : undefined}
      />

      <View style={styles.card}>
        {items.map((item, index) => {
          const highlighted = mode === 'hot' && index === 1;

          return (
            <Pressable
              key={item.id}
              style={[
                styles.row,
                highlighted ? styles.highlightRow : undefined,
                index < items.length - 1 ? styles.rowBorder : undefined,
              ]}
            >
              <View style={styles.rowText}>
                {item.category ? (
                  <Text style={[styles.category, highlighted ? styles.highlightCategory : undefined]}>
                    {item.category}
                  </Text>
                ) : null}
                <Text numberOfLines={1} style={[styles.title, highlighted ? styles.highlightTitle : undefined]}>
                  {item.title}
                </Text>
              </View>
              {item.metaRight ? <Text style={styles.time}>{item.metaRight}</Text> : null}
            </Pressable>
          );
        })}
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
    minHeight: 45,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
  },
  highlightRow: {
    backgroundColor: slidesTheme.colors.primarySoft,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: slidesTheme.colors.borderSoft,
  },
  rowText: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  category: {
    fontSize: 14,
    lineHeight: 21,
    color: slidesTheme.colors.textStrong,
  },
  highlightCategory: {
    fontWeight: '600',
  },
  title: {
    flex: 1,
    fontSize: 13,
    lineHeight: 20,
    color: slidesTheme.colors.text,
  },
  highlightTitle: {
    fontSize: 14,
    lineHeight: 21,
    color: slidesTheme.colors.textStrong,
  },
  time: {
    fontSize: 11,
    lineHeight: 16,
    color: slidesTheme.colors.textSoft,
  },
});
