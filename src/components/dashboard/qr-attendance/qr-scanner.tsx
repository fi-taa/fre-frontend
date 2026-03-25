'use client';

import { useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

export interface QrScannerProps {
  onScanSuccess: (decodedText: string) => void;
}

export function QrScanner({ onScanSuccess }: QrScannerProps) {
  const readerId = 'qr-attendance-reader';
  const callbackRef = useRef(onScanSuccess);

  const scannerInstanceRef = useRef<InstanceType<typeof Html5QrcodeScanner> | null>(null);

  useEffect(() => {
    callbackRef.current = onScanSuccess;
  }, [onScanSuccess]);

  useEffect(() => {
    if (scannerInstanceRef.current) return;

    const scanner = new Html5QrcodeScanner(
      readerId,
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false
    );

    scannerInstanceRef.current = scanner;

    scanner.render(
      (decodedText: string) => {
        callbackRef.current(decodedText);
      },
      () => {}
    );

    return () => {
      const instance = scannerInstanceRef.current;
      scannerInstanceRef.current = null;
      instance?.clear().catch(() => {});
    };
  }, []);

  return <div id={readerId} className="w-full min-h-[320px]" />;
}

