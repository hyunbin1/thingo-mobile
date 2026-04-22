import { Text } from '@/components/ui/text';
import { slidesTheme } from '@/features/slides/lib/slides-theme';
import { Github, Instagram } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';

export function AllSlidesFooter() {
  return (
    <View style={styles.footer}>
      <View style={styles.content}>
        <View style={styles.socialRow}>
          <Pressable style={styles.iconButton}>
            <Github size={20} color={slidesTheme.colors.iconBlue} />
          </Pressable>
          <Pressable style={styles.iconButton}>
            <Instagram size={20} color={slidesTheme.colors.iconBlue} />
          </Pressable>
        </View>

        <View style={styles.linkRow}>
          <Text style={styles.linkText}>이용약관</Text>
          <Text style={styles.linkText}>개인정보 처리방침</Text>
          <Text style={styles.linkText}>문의하기</Text>
        </View>

        <Text style={styles.copyText}>© 2025 MJS. All rights reserved</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    marginTop: 12,
    backgroundColor: slidesTheme.colors.footer,
    paddingHorizontal: 40,
    paddingVertical: 20,
    alignItems: 'center',
  },
  content: {
    width: '100%',
    gap: 12,
  },
  socialRow: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 16,
  },
  linkText: {
    fontSize: 12,
    lineHeight: 18,
    color: slidesTheme.colors.textMuted,
  },
  copyText: {
    fontSize: 12,
    lineHeight: 18,
    color: slidesTheme.colors.textPlaceholder,
  },
});
