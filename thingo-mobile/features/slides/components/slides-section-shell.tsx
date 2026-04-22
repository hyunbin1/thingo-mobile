import { Text } from '@/components/ui/text';
import { ChevronRight } from 'lucide-react-native';
import { Pressable, StyleSheet, View, type ViewStyle } from 'react-native';

type SlidesSectionShellProps = {
  title: string;
  subtitle?: string;
  onSeeMorePress?: () => void;
  children: React.ReactNode;
  style?: ViewStyle;
};

export function SlidesSectionShell({
  title,
  subtitle,
  onSeeMorePress,
  children,
  style,
}: SlidesSectionShellProps) {
  return (
    <View style={[styles.section, style]}>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>

        {onSeeMorePress ? (
          <Pressable onPress={onSeeMorePress} style={styles.moreButton}>
            <Text style={styles.moreText}>더보기</Text>
            <ChevronRight size={14} color='#7B8794' />
          </Pressable>
        ) : null}
      </View>

      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  headerText: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 19,
    color: '#6B7280',
  },
  moreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingLeft: 8,
    paddingVertical: 4,
  },
  moreText: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '700',
    color: '#111827',
  },
});
