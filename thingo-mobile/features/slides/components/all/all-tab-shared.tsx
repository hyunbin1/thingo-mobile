import { Text } from '@/components/ui/text';
import { slidesTheme } from '@/features/slides/lib/slides-theme';
import { ChevronRight, Heart, MessageCircle, Star } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';

type SectionHeaderProps = {
  title: string;
  accent?: 'hot' | 'star' | 'default';
  onSeeMorePress?: () => void;
  filterLabels?: readonly string[];
};

export function AllSectionHeader({
  title,
  accent = 'default',
  onSeeMorePress,
  filterLabels,
}: SectionHeaderProps) {
  return (
    <View style={styles.headerWrap}>
      <View style={styles.titleRow}>
        <View style={styles.titleGroup}>
          {accent === 'hot' ? <Text style={styles.hotAccent}>🔥</Text> : null}
          {accent === 'star' ? (
            <Star size={14} color={slidesTheme.colors.star} fill={slidesTheme.colors.star} />
          ) : null}
          <Text style={styles.title}>{title}</Text>
        </View>

        {onSeeMorePress ? (
          <Pressable style={styles.moreButton} onPress={onSeeMorePress}>
            <ChevronRight size={18} color={slidesTheme.colors.primaryStrong} />
          </Pressable>
        ) : null}
      </View>

      {filterLabels ? (
        <View style={styles.filterRow}>
          {filterLabels.map((label, index) => (
            <View key={label} style={[styles.filterChip, index === 0 ? styles.filterChipActive : undefined]}>
              <Text style={[styles.filterText, index === 0 ? styles.filterTextActive : undefined]}>
                {label}
              </Text>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}

type BoardMetaProps = {
  likes?: number;
  comments?: number;
};

export function BoardMeta({ likes = 0, comments = 0 }: BoardMetaProps) {
  return (
    <View style={styles.metaRow}>
      <View style={styles.metaItem}>
        <Heart size={14} color={slidesTheme.colors.iconBlue} />
        <Text style={styles.metaText}>{likes > 0 ? likes : 'NN'}</Text>
      </View>
      <View style={styles.metaItem}>
        <MessageCircle size={14} color={slidesTheme.colors.iconBlue} />
        <Text style={styles.metaText}>{comments > 0 ? comments : 'NN'}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerWrap: {
    gap: 12,
  },
  titleRow: {
    minHeight: 27,
    paddingLeft: 16,
    paddingRight: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  title: {
    flex: 1,
    fontSize: 18,
    lineHeight: 27,
    fontWeight: '700',
    color: slidesTheme.colors.textStrong,
  },
  hotAccent: {
    fontSize: 14,
    lineHeight: 18,
  },
  moreButton: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 4,
  },
  filterChip: {
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: slidesTheme.colors.chipBorder,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  filterChipActive: {
    backgroundColor: slidesTheme.colors.primary,
    borderColor: slidesTheme.colors.primary,
  },
  filterText: {
    fontSize: 14,
    lineHeight: 21,
    color: '#6D7073',
  },
  filterTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    lineHeight: 18,
    color: slidesTheme.colors.textMuted,
  },
});
