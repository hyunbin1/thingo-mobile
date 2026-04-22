import { Text } from '@/components/ui/text';
import { slidesTheme } from '@/features/slides/lib/slides-theme';
import type { SlideQuickLink } from '@/features/slides/model/slide-mock-data';
import { Image, Pressable, StyleSheet, View } from 'react-native';

type AllSlidesQuickLinksProps = {
  items: SlideQuickLink[];
  onPressItem: (item: SlideQuickLink) => void;
};

export function AllSlidesQuickLinks({ items, onPressItem }: AllSlidesQuickLinksProps) {
  const regularItems = items.filter((item) => item.icon !== 'dDay');
  const dDayItem = items.find((item) => item.icon === 'dDay');

  return (
    <View style={styles.wrapper}>
      <View style={styles.gridColumn}>
        <View style={styles.row}>
          {regularItems.slice(0, 2).map((item) => (
            <QuickCard key={item.id} item={item} onPress={() => onPressItem(item)} />
          ))}
        </View>
        <View style={styles.row}>
          {regularItems.slice(2, 5).map((item) => (
            <MiniQuickCard key={item.id} item={item} onPress={() => onPressItem(item)} />
          ))}
        </View>
      </View>

      {dDayItem ? <DdayCard item={dDayItem} onPress={() => onPressItem(dDayItem)} /> : null}
    </View>
  );
}

function QuickCard({ item, onPress }: { item: SlideQuickLink; onPress: () => void }) {
  return (
    <Pressable style={styles.quickCard} onPress={onPress}>
      <Text style={styles.quickCardTitle}>{item.label}</Text>
      <View style={styles.quickIconWrap}>
        {item.iconUrl ? <Image source={{ uri: item.iconUrl }} style={styles.quickIcon} resizeMode='contain' /> : null}
      </View>
    </Pressable>
  );
}

function MiniQuickCard({ item, onPress }: { item: SlideQuickLink; onPress: () => void }) {
  return (
    <Pressable style={styles.miniCard} onPress={onPress}>
      <View style={styles.miniIconWrap}>
        {item.iconUrl ? <Image source={{ uri: item.iconUrl }} style={styles.miniIcon} resizeMode='contain' /> : null}
      </View>
      <Text style={styles.miniLabel}>{item.label}</Text>
    </Pressable>
  );
}

function DdayCard({ item, onPress }: { item: SlideQuickLink; onPress: () => void }) {
  return (
    <Pressable style={styles.ddayCard} onPress={onPress}>
      <View style={styles.ddayBlock}>
        <Text style={styles.ddayMain}>{item.label}</Text>
        <Text style={styles.ddayCaption}>{item.caption}</Text>
      </View>
      <View style={styles.ddayBlock}>
        <Text style={styles.ddaySub}>D-8</Text>
        <Text style={styles.ddaySubCaption}>2학기 개강 학기 개시일</Text>
      </View>
      <View style={styles.ddayBlock}>
        <Text style={styles.ddaySub}>D-13</Text>
        <Text style={styles.ddaySubCaption}>2학기 개강 학기 개시일</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    gap: 16,
    paddingHorizontal: 16,
  },
  gridColumn: {
    width: 196,
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  quickCard: {
    width: 94,
    height: 76,
    borderRadius: 12,
    backgroundColor: slidesTheme.colors.surfaceMuted,
    paddingTop: 8,
    paddingLeft: 10,
    paddingRight: 6,
    paddingBottom: 2,
  },
  quickCardTitle: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '600',
    color: slidesTheme.colors.textStrong,
  },
  quickIconWrap: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  quickIcon: {
    width: 56,
    height: 56,
  },
  miniCard: {
    width: 60,
    height: 76,
    borderRadius: 12,
    backgroundColor: slidesTheme.colors.surfaceMuted,
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 4,
  },
  miniIconWrap: {
    width: 40,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniIcon: {
    width: 40,
    height: 40,
  },
  miniLabel: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '600',
    color: slidesTheme.colors.textStrong,
    textAlign: 'center',
  },
  ddayCard: {
    width: 149,
    minHeight: 160,
    borderRadius: 12,
    backgroundColor: slidesTheme.colors.surfaceMuted,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 8,
  },
  ddayBlock: {
    gap: 4,
  },
  ddayMain: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '600',
    color: '#0084FF',
  },
  ddayCaption: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '600',
    color: slidesTheme.colors.text,
  },
  ddaySub: {
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '600',
    color: slidesTheme.colors.primaryStrong,
  },
  ddaySubCaption: {
    fontSize: 12,
    lineHeight: 18,
    color: slidesTheme.colors.text,
  },
});
