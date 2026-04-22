import { Text } from '@/components/ui/text';
import { slidesTheme } from '@/features/slides/lib/slides-theme';
import type { SlideMealSummary } from '@/features/slides/model/slide-mock-data';
import { StyleSheet, View } from 'react-native';

type AllSlidesMealSummaryCardProps = {
  summary: SlideMealSummary;
};

export function AllSlidesMealSummaryCard({ summary }: AllSlidesMealSummaryCardProps) {
  return (
    <View style={styles.section}>
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <Text style={styles.dateText}>{summary.dateLabel}</Text>
          <Text style={styles.metaText}>
            {summary.mealType} · {summary.timeLabel}
          </Text>
        </View>

        {summary.tags.length > 0 ? (
          <View style={styles.tagWrap}>
            {summary.tags.map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.emptyText}>{summary.emptyMessage}</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 20,
  },
  card: {
    marginHorizontal: 16,
    borderRadius: 12,
    backgroundColor: slidesTheme.colors.surface,
    borderWidth: 1,
    borderColor: slidesTheme.colors.border,
    paddingHorizontal: 16,
    paddingVertical: 20,
    gap: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  dateText: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
    color: slidesTheme.colors.textStrong,
  },
  metaText: {
    fontSize: 12,
    lineHeight: 18,
    color: '#6D7073',
  },
  tagWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tag: {
    borderRadius: 6,
    backgroundColor: slidesTheme.colors.primarySoft,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  tagText: {
    fontSize: 14,
    lineHeight: 21,
    color: slidesTheme.colors.text,
  },
  emptyText: {
    fontSize: 14,
    lineHeight: 21,
    color: slidesTheme.colors.textMuted,
  },
});
