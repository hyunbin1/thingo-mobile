import { Text } from '@/components/ui/text';
import { getNaverMapClientId } from '@/features/map/lib/naver-map-config';
import { slidesTheme } from '@/features/slides/lib/slides-theme';
import { campusMapSpots } from '@/features/slides/model/slide-mock-data';
import * as React from 'react';
import { Platform, StyleSheet, View } from 'react-native';

const SAMPLE_CAMERA = {
  latitude: 37.5807,
  longitude: 126.9238,
  zoom: 15,
};

let NativeMapView: null | React.ComponentType<React.ComponentProps<any>> = null;
let NativeMarkerOverlay: null | React.ComponentType<React.ComponentProps<any>> = null;

if (Platform.OS !== 'web') {
  try {
    const naverMap = require('@mj-studio/react-native-naver-map');
    NativeMapView = naverMap.NaverMapView;
    NativeMarkerOverlay = naverMap.NaverMapMarkerOverlay;
  } catch {
    NativeMapView = null;
    NativeMarkerOverlay = null;
  }
}

export function SlidesCampusMapPanel() {
  const hasNativeMap = Platform.OS !== 'web' && NativeMapView && NativeMarkerOverlay;
  const hasClientId = Boolean(getNaverMapClientId());

  return (
    <View style={styles.wrapper}>
      <View style={styles.mapCard}>
        {hasNativeMap && hasClientId ? (
          <MapCanvas />
        ) : (
          <View style={styles.fallback}>
            <Text style={styles.fallbackTitle}>명지대 인문캠퍼스</Text>
            <Text style={styles.fallbackDescription}>
              네이버 지도 연결 전까지는 인문캠퍼스 기준 명지도 레이아웃을 유지합니다.
            </Text>
          </View>
        )}
      </View>

      <View style={styles.tags}>
        {campusMapSpots.map((spot) => (
          <View key={spot} style={styles.tag}>
            <Text style={styles.tagText}>{spot}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function MapCanvas() {
  const MapView = NativeMapView as React.ComponentType<any>;
  const MarkerOverlay = NativeMarkerOverlay as React.ComponentType<any>;

  return (
    <MapView style={{ height: 360, width: '100%' }} initialCamera={SAMPLE_CAMERA}>
      <MarkerOverlay
        latitude={SAMPLE_CAMERA.latitude}
        longitude={SAMPLE_CAMERA.longitude}
        caption={{ text: '명지대학교 인문캠퍼스' }}
      />
    </MapView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 16,
  },
  mapCard: {
    overflow: 'hidden',
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: slidesTheme.colors.border,
  },
  fallback: {
    height: 360,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#E5EEF9',
  },
  fallbackTitle: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  fallbackDescription: {
    fontSize: 14,
    lineHeight: 22,
    color: '#4B5563',
    textAlign: 'center',
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: slidesTheme.colors.border,
  },
  tagText: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    color: '#374151',
  },
});
