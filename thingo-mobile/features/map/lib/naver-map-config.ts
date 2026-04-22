import Constants from 'expo-constants';

const PLACEHOLDER_CLIENT_ID = '__NAVER_MAP_CLIENT_ID__';

export function getNaverMapClientId() {
  const clientId = Constants.expoConfig?.extra?.naverMapClientId;

  if (typeof clientId !== 'string' || clientId.length === 0) {
    return null;
  }

  if (clientId === PLACEHOLDER_CLIENT_ID) {
    return null;
  }

  return clientId;
}

export function isNaverMapClientIdConfigured() {
  return getNaverMapClientId() !== null;
}
