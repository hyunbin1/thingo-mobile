import { NaverMapPocScreen } from '@/features/map/screens/naver-map-poc-screen';
import { Stack } from 'expo-router';

export default function MapRoute() {
  return (
    <>
      <Stack.Screen options={{ title: '네이버 지도 PoC' }} />
      <NaverMapPocScreen />
    </>
  );
}
