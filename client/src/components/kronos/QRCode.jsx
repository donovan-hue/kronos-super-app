import React, { useEffect, useRef } from 'react';

// Lightweight QR using the browser's canvas API via qrcode library
// Install: npm install qrcode
let QRLib = null;
try { QRLib = require('qrcode'); } catch {}

export default function QRCode({ value, size = 180, className = '' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!QRLib || !canvasRef.current) return;
    QRLib.toCanvas(canvasRef.current, value, {
      width: size,
      margin: 2,
      color: { dark: '#ffffff', light: '#0f0f1a' },
    });
  }, [value, size]);

  if (!QRLib) {
    return (
      <div
        className={`flex items-center justify-center bg-white/10 rounded-xl ${className}`}
        style={{ width: size, height: size }}
      >
        <span className="text-xs text-white/40">QR no disponible</span>
      </div>
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className={`rounded-xl ${className}`}
      width={size}
      height={size}
    />
  );
}
