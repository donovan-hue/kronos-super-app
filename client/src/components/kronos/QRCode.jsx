import React, { useEffect, useState } from 'react';
import QRCodeGenerator from 'qrcode';

export default function QRCode({ value, size = 180, className = '' }) {
  const [dataUrl, setDataUrl] = useState('');

  useEffect(() => {
    let active = true;
    const content = String(value || '');

    if (!content) {
      setDataUrl('');
      return () => { active = false; };
    }

    QRCodeGenerator.toDataURL(content, {
      width: Math.max(128, size * 2),
      margin: 1,
      errorCorrectionLevel: 'M',
      color: { dark: '#0a0a14', light: '#ffffff' },
    })
      .then((url) => { if (active) setDataUrl(url); })
      .catch(() => { if (active) setDataUrl(''); });

    return () => { active = false; };
  }, [size, value]);

  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        background: '#ffffff',
        borderRadius: 12,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        border: '3px solid #0a0a14',
        position: 'relative',
        padding: 8,
        boxSizing: 'border-box',
      }}
    >
      {dataUrl ? (
        <img
          src={dataUrl}
          alt="Código QR"
          width={size - 16}
          height={size - 16}
          style={{ width: '100%', height: '100%', objectFit: 'contain', imageRendering: 'pixelated' }}
        />
      ) : (
        <span style={{ color: '#0a0a14', fontSize: 12, textAlign: 'center' }}>Generando QR…</span>
      )}
      <div style={{
        fontSize: Math.max(8, size * 0.06),
        color: '#c9ced4',
        marginTop: 6,
        textAlign: 'center',
        maxWidth: size - 20,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        fontFamily: 'monospace',
      }}>
        {value?.slice(0, 16)}
      </div>
    </div>
  );
}
