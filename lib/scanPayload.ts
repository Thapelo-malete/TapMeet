import { getPublicProfileUrl } from '@/lib/appLinks';

export function makeMyQrPayload(userId: string) {
  // Prefer a public link so it works for people without the app/network.
  // Our scanner supports both this URL and the legacy scheme payload.
  return getPublicProfileUrl(userId);
}

export function parseScannedUserId(data: string): string | null {
  const raw = data.trim();
  if (!raw) return null;

  // 1) Our custom scheme payload
  const m = /^tapmeet:user:([0-9a-fA-F-]{36})$/.exec(raw);
  if (m) return m[1];

  // 2) Raw UUID
  if (/^[0-9a-fA-F-]{36}$/.test(raw)) return raw;

  // 3) URL formats: .../u/<uuid> or ?u=<uuid>
  try {
    const u = new URL(raw);
    const qp = u.searchParams.get('u') || u.searchParams.get('user');
    if (qp && /^[0-9a-fA-F-]{36}$/.test(qp)) return qp;
    const parts = u.pathname.split('/').filter(Boolean);
    const last = parts[parts.length - 1];
    if (last && /^[0-9a-fA-F-]{36}$/.test(last)) return last;
  } catch {
    // ignore
  }

  return null;
}

