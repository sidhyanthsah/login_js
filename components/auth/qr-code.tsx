'use client';

import { useEffect, useRef } from 'react';

interface QRCodeProps {
  value: string;
  size?: number;
}

export function QRCode({ value, size = 200 }: QRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Dynamically import QRious to avoid SSR issues
    import('qrious').then((QRious) => {
      if (canvasRef.current) {
        new QRious.default({
          element: canvasRef.current,
          value,
          size,
          backgroundAlpha: 0,
          foreground: '#000000',
          level: 'H', // High error correction
        });
      }
    });
  }, [value, size]);

  return (
    <div className="bg-white p-4 rounded-lg inline-block">
      <canvas ref={canvasRef} />
    </div>
  );
}