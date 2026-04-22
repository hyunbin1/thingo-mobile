import { Text } from '@/components/ui/text';
import { AllSectionHeader } from '@/features/slides/components/all/all-tab-shared';
import { slidesTheme } from '@/features/slides/lib/slides-theme';
import type { SlideScheduleItem } from '@/features/slides/model/slide-mock-data';
import { StyleSheet, View } from 'react-native';

type AllSlidesScheduleSectionProps = {
  items: SlideScheduleItem[];
  onSeeMorePress?: () => void;
};

export function AllSlidesScheduleSection({ items, onSeeMorePress }: AllSlidesScheduleSectionProps) {
  const primaryDate = items[0]?.dateLabel ?? '';

  return (
    <View style={styles.section}>
      <AllSectionHeader title='학사일정' onSeeMorePress={onSeeMorePress} />

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.primaryDate}>{primaryDate}</Text>
        </View>

        <View style={styles.list}>
          {items.map((item, index) => (
            <View key={item.id} style={[styles.row, index < items.length - 1 ? styles.rowGap : undefined]}>
              <Text style={styles.time}>{item.timeLabel}</Text>
              <Text style={styles.title}>{item.title}</Text>
            </View>
          ))}
        </View>
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
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  cardHeader: {
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: slidesTheme.colors.borderSoft,
  },
  primaryDate: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
    color: slidesTheme.colors.primary,
  },
  list: {
    paddingBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  rowGap: {
    marginBottom: 2,
  },
  time: {
    width: 75,
    fontSize: 12,
    lineHeight: 18,
    color: slidesTheme.colors.textMuted,
  },
  title: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '700',
    color: slidesTheme.colors.textStrong,
  },
});
