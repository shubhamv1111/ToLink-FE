'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  KEEPALIVE_INTERVAL_MS,
  pingBackend,
  shouldKeepBackendAlive,
  WAKEUP_TIMEOUT_MS,
} from '@/lib/backend-keepalive';

type BackendStatus = 'idle' | 'waking' | 'ready' | 'unreachable';

interface BackendStatusContextType {
  status: BackendStatus;
  isReady: boolean;
  isWaking: boolean;
  lastLatencyMs: number | null;
  wakeBackend: () => Promise<boolean>;
}

const BackendStatusContext = createContext<BackendStatusContextType | undefined>(
  undefined,
);

export const useBackendStatus = () => {
  const context = useContext(BackendStatusContext);
  if (context === undefined) {
    throw new Error('useBackendStatus must be used within a BackendStatusProvider');
  }
  return context;
};

export const BackendStatusProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [status, setStatus] = useState<BackendStatus>(
    shouldKeepBackendAlive() ? 'idle' : 'ready',
  );
  const [lastLatencyMs, setLastLatencyMs] = useState<number | null>(null);
  const pingInFlightRef = useRef(false);
  const isReadyRef = useRef(!shouldKeepBackendAlive());

  const wakeBackend = useCallback(async (): Promise<boolean> => {
    if (!shouldKeepBackendAlive()) {
      isReadyRef.current = true;
      setStatus('ready');
      return true;
    }

    if (pingInFlightRef.current) {
      return isReadyRef.current;
    }

    pingInFlightRef.current = true;
    setStatus((current) => (current === 'ready' ? 'ready' : 'waking'));

    const result = await pingBackend({ timeoutMs: WAKEUP_TIMEOUT_MS });

    pingInFlightRef.current = false;

    if (result.ok) {
      isReadyRef.current = true;
      setStatus('ready');
      setLastLatencyMs(result.latencyMs);
      return true;
    }

    isReadyRef.current = false;
    setStatus('unreachable');
    return false;
  }, []);

  useEffect(() => {
    if (!shouldKeepBackendAlive()) {
      return;
    }

    void wakeBackend();

    const intervalId = setInterval(() => {
      if (document.visibilityState === 'visible') {
        void wakeBackend();
      }
    }, KEEPALIVE_INTERVAL_MS);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        void wakeBackend();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [wakeBackend]);

  const value: BackendStatusContextType = {
    status,
    isReady: status === 'ready' || !shouldKeepBackendAlive(),
    isWaking: status === 'waking',
    lastLatencyMs,
    wakeBackend,
  };

  return (
    <BackendStatusContext.Provider value={value}>
      {children}
    </BackendStatusContext.Provider>
  );
};
