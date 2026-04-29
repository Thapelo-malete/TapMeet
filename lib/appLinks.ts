const DEFAULT_APP_URL = 'https://tapmeet.app';

export function getAppBaseUrl() {
  return (process.env.EXPO_PUBLIC_APP_URL || DEFAULT_APP_URL).replace(/\/+$/, '');
}

export function getPublicProfileUrl(userId: string) {
  return `${getAppBaseUrl()}/u/${encodeURIComponent(userId)}`;
}

