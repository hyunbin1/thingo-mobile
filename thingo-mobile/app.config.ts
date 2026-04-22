import type { ExpoConfig } from 'expo/config';

const naverMapClientId =
  process.env.EXPO_PUBLIC_NAVER_MAP_CLIENT_ID ??
  process.env.NAVER_MAP_CLIENT_ID ??
  '__NAVER_MAP_CLIENT_ID__';

const config: ExpoConfig = {
  name: 'thingo-mobile',
  slug: 'thingo-mobile',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'thingo-mobile',
  userInterfaceStyle: 'automatic',
  splash: {
    image: './assets/images/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.thingo_mju.thingomobile',
  },
  android: {
    package: 'com.thingo_mju.thingomobile',
    adaptiveIcon: {
      foregroundImage: './assets/images/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
  },
  web: {
    bundler: 'metro',
    output: 'static',
    favicon: './assets/images/favicon.png',
  },
  plugins: [
    'expo-router',
    'expo-dev-client',
    [
      '@mj-studio/react-native-naver-map',
      {
        client_id: naverMapClientId,
      },
    ],
    [
      'expo-build-properties',
      {
        android: {
          extraMavenRepos: ['https://repository.map.naver.com/archive/maven'],
        },
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    naverMapClientId,
  },
};

export default config;