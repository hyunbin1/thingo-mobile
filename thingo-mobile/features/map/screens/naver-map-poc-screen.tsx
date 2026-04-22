import { getNaverMapClientId, isNaverMapClientIdConfigured } from '@/features/map/lib/naver-map-config';
import { Text } from '@/components/ui/text';
import * as React from 'react';
import { Platform, SafeAreaView, StyleSheet, View } from 'react-native';

const SAMPLE_CAMERA = {
  latitude: 37.5665,
  longitude: 126.978,
  zoom: 14,
};

let NaverMapView: null | React.ComponentType<React.ComponentProps<any>> = null;
let NaverMapMarkerOverlay: null | React.ComponentType<React.ComponentProps<any>> = null;

if (Platform.OS !== 'web') {
  try {
    const naverMap = require('@mj-studio/react-native-naver-map');
    NaverMapView = naverMap.NaverMapView;
    NaverMapMarkerOverlay = naverMap.NaverMapMarkerOverlay;
  } catch {
    NaverMapView = null;
    NaverMapMarkerOverlay = null;
  }
}

export function NaverMapPocScreen() {
  const clientId = getNaverMapClientId();
  const hasClientId = isNaverMapClientIdConfigured();

  const nativeUnavailable = Platform.OS === 'web' || !NaverMapView || !NaverMapMarkerOverlay;

  let mapContent: React.ReactNode;

  if (nativeUnavailable) {
    mapContent = (
      <FallbackMessage
        title='개발 빌드가 필요합니다'
        description='Expo Go나 웹에서는 네이버 지도 네이티브 모듈을 로드할 수 없습니다.'
      />
    );
  } else if (!hasClientId) {
    mapContent = (
      <FallbackMessage
        title='클라이언트 ID가 필요합니다'
        description='네이버 클라우드에서 발급한 Maps Client ID를 NAVER_MAP_CLIENT_ID에 넣은 뒤 dev build를 다시 생성해야 합니다.'
      />
    );
  } else {
    const NativeMapView = NaverMapView as React.ComponentType<any>;
    const NativeMarkerOverlay = NaverMapMarkerOverlay as React.ComponentType<any>;

    mapContent = (
      <NativeMapView style={styles.map} initialCamera={SAMPLE_CAMERA}>
        <NativeMarkerOverlay
          latitude={SAMPLE_CAMERA.latitude}
          longitude={SAMPLE_CAMERA.longitude}
          caption={{ text: 'PoC 중심점' }}
        />
      </NativeMapView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>네이버 지도 기술 PoC</Text>
          <Text style={styles.subtitle}>
            Expo Development Build 전용 최소 화면입니다.
          </Text>
        </View>

        <View style={styles.metaCard}>npx expo run:android
          <Text style={styles.metaLabel}>현재 상태</Text>
          <Text style={styles.metaValue}>
            {nativeUnavailable
              ? '네이티브 모듈 미탑재'
              : hasClientId
                ? '클라이언트 ID 설정됨'
                : '클라이언트 ID 미설정'}
          </Text>
          <Text style={styles.metaHint}>
            {hasClientId
              ? `NAVER_MAP_CLIENT_ID: ${clientId}`
              : 'app.config.ts와 .env에서 NAVER_MAP_CLIENT_ID를 설정해야 실제 지도가 표시됩니다.'}
          </Text>
        </View>

        <View style={styles.mapFrame}>
          {mapContent}
        </View>

        <View style={styles.notes}>
          <Text style={styles.noteTitle}>이번 단계에서 의도적으로 한정한 범위</Text>
          <Text style={styles.noteItem}>- 지도 렌더링 가능 여부 확인</Text>
          <Text style={styles.noteItem}>- Expo config plugin 연결</Text>
          <Text style={styles.noteItem}>- API 키 주입 위치 명시</Text>
          <Text style={styles.noteItem}>- 위치 권한, 현재 위치, 커스텀 오버레이는 제외</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

function FallbackMessage(props: { title: string; description: string }) {
  return (
    <View style={styles.fallback}>
      <Text style={styles.fallbackTitle}>{props.title}</Text>
      <Text style={styles.fallbackDescription}>{props.description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f4f7fb',
  },
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
  header: {
    gap: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    fontSize: 14,
    color: '#4b5563',
  },
  metaCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    gap: 8,
  },
  metaLabel: {
    fontSize: 13,
    color: '#6b7280',
  },
  metaValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  metaHint: {
    fontSize: 13,
    lineHeight: 20,
    color: '#4b5563',
  },
  mapFrame: {
    flex: 1,
    minHeight: 320,
    overflow: 'hidden',
    borderRadius: 20,
    backgroundColor: '#dbeafe',
  },
  map: {
    flex: 1,
  },
  fallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 10,
  },
  fallbackTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
    textAlign: 'center',
  },
  fallbackDescription: {
    fontSize: 14,
    lineHeight: 22,
    color: '#475569',
    textAlign: 'center',
  },
  notes: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    gap: 6,
  },
  noteTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  noteItem: {
    fontSize: 13,
    color: '#4b5563',
  },
});
