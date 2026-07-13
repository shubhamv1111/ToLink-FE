const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

/** Render free tier sleeps after ~15 min; ping every 10 min while the tab is open. */
export const KEEPALIVE_INTERVAL_MS = 10 * 60 * 1000;

/** Cold starts on Render can take up to ~90s. */
export const WAKEUP_TIMEOUT_MS = 90 * 1000;

export function shouldKeepBackendAlive(): boolean {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? '';
  return (
    apiUrl.length > 0 &&
    !apiUrl.includes('localhost') &&
    !apiUrl.includes('127.0.0.1')
  );
}

export function getHealthCheckUrl(): string {
  return `${API_BASE_URL}/v1/health`;
}

async function fetchWithTimeout(
  url: string,
  timeoutMs: number,
  signal?: AbortSignal,
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  const onAbort = () => controller.abort();
  signal?.addEventListener('abort', onAbort);

  try {
    return await fetch(url, {
      method: 'GET',
      cache: 'no-store',
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeoutId);
    signal?.removeEventListener('abort', onAbort);
  }
}

export type BackendPingResult =
  | { ok: true; latencyMs: number }
  | { ok: false; reason: 'timeout' | 'http' | 'network' };

export async function pingBackend(options?: {
  timeoutMs?: number;
  signal?: AbortSignal;
}): Promise<BackendPingResult> {
  const startedAt = Date.now();
  const timeoutMs = options?.timeoutMs ?? WAKEUP_TIMEOUT_MS;

  try {
    const response = await fetchWithTimeout(
      getHealthCheckUrl(),
      timeoutMs,
      options?.signal,
    );

    if (!response.ok) {
      return { ok: false, reason: 'http' };
    }

    return { ok: true, latencyMs: Date.now() - startedAt };
  } catch (error) {
    if (options?.signal?.aborted) {
      return { ok: false, reason: 'network' };
    }
    if (error instanceof DOMException && error.name === 'AbortError') {
      return { ok: false, reason: 'timeout' };
    }
    return { ok: false, reason: 'network' };
  }
}
