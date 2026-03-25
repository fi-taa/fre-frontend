'use client';

import { useEffect, useMemo, useState } from 'react';

type CameraPermissionState = 'unknown' | 'prompt' | 'granted' | 'denied' | 'unsupported';

export interface CameraPermissionProps {
  onGranted?: () => void;
}

function stateLabel(state: CameraPermissionState): string {
  if (state === 'granted') return 'Allowed';
  if (state === 'denied') return 'Blocked';
  if (state === 'prompt') return 'Ask';
  if (state === 'unsupported') return 'Unsupported';
  return 'Unknown';
}

function badgeClasses(state: CameraPermissionState): string {
  if (state === 'granted') return 'bg-green-100 text-green-800';
  if (state === 'denied') return 'bg-red-100 text-red-800';
  if (state === 'prompt') return 'bg-bg-beige-light text-text-secondary';
  if (state === 'unsupported') return 'bg-bg-beige-light text-text-secondary';
  return 'bg-bg-beige-light text-text-secondary';
}

export function CameraPermission({ onGranted }: CameraPermissionProps) {
  const [state, setState] = useState<CameraPermissionState>('unknown');
  const [isRequesting, setIsRequesting] = useState(false);
  const [requestError, setRequestError] = useState<string | null>(null);

  const canQuery = useMemo(() => typeof navigator !== 'undefined' && 'permissions' in navigator, []);

  useEffect(() => {
    let isActive = true;
    if (!canQuery) {
      setState('unknown');
      return () => {};
    }

    async function run() {
      try {
        const name = 'camera' as PermissionName;
        const result = await navigator.permissions.query({ name });
        if (!isActive) return;
        setState(result.state as CameraPermissionState);
        result.onchange = () => {
          if (!isActive) return;
          setState(result.state as CameraPermissionState);
        };
      } catch {
        if (!isActive) return;
        setState('unsupported');
      }
    }

    run();
    return () => {
      isActive = false;
    };
  }, [canQuery]);

  async function requestAccess() {
    setRequestError(null);
    setIsRequesting(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach((t) => t.stop());
      setState('granted');
      onGranted?.();
    } catch (e: unknown) {
      setState('denied');
      const message = e && typeof e === 'object' && 'name' in e ? String((e as { name?: unknown }).name) : 'Permission denied';
      setRequestError(message);
    } finally {
      setIsRequesting(false);
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <div className="text-xs font-semibold text-text-secondary">Camera</div>
        <span className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full ${badgeClasses(state)}`}>
          {stateLabel(state)}
        </span>
      </div>

      <button
        type="button"
        onClick={requestAccess}
        disabled={isRequesting || state === 'granted'}
        className="w-full px-3 py-2 text-xs font-medium rounded-lg border border-border/40 hover:bg-bg-beige-light focus:outline-none focus:ring-2 focus:ring-link/30 text-text-primary disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {state === 'granted' ? 'Camera already allowed' : isRequesting ? 'Requesting camera access…' : 'Request camera access'}
      </button>

      {requestError && <div className="text-xs text-red-800 bg-red-50 rounded-lg px-3 py-2">{requestError}</div>}
    </div>
  );
}

