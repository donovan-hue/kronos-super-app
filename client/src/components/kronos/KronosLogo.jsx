import React from 'react';

/**
 * KRONOSPACE · Logo oficial
 * Concepto "Órbita Crono" (tiempo × espacio) en plata metálica sobre negro.
 * Los gradientes metálicos (#ksV, #ksDiag, #ksSphere, #ksSphereSm) están
 * definidos globalmente en public/index.html.
 */

// Símbolo solo (la marca orbital)
export function KronosMark({ size = 96, style }) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      role="img"
      aria-label="KRONOSPACE"
      style={{
        display: 'block',
        overflow: 'visible',
        filter:
          'drop-shadow(0 2px 3px rgba(0,0,0,.6)) drop-shadow(0 0 7px rgba(186,198,212,.14))',
        ...style,
      }}
    >
      <ellipse cx="50" cy="50" rx="44" ry="20" fill="none" stroke="url(#ksDiag)" strokeWidth="1.6" transform="rotate(-26 50 50)" opacity=".85" />
      <circle cx="50" cy="50" r="36" fill="none" stroke="url(#ksV)" strokeWidth="2.4" />
      <path d="M28 24 A36 36 0 0 1 76 30" fill="none" stroke="#ffffff" strokeWidth="1.1" strokeLinecap="round" opacity=".55" />
      <circle cx="50" cy="50" r="30.5" fill="none" stroke="url(#ksV)" strokeWidth="4" strokeDasharray="1.5 14.46" />
      <line x1="50" y1="50" x2="50" y2="24" stroke="url(#ksV)" strokeWidth="3" strokeLinecap="round" />
      <line x1="50" y1="50" x2="66" y2="58" stroke="url(#ksV)" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="86" cy="38" r="6" fill="url(#ksSphere)" />
      <circle cx="50" cy="50" r="4.2" fill="url(#ksSphereSm)" />
    </svg>
  );
}

// Wordmark KRONO (fuerte) + SPACE (ligero) con relleno plata metálica
export function KronosWordmark({ fontSize = 30, style }) {
  return (
    <span
      className="metal-text"
      style={{
        fontFamily: "'Space Grotesk', sans-serif",
        fontSize,
        letterSpacing: '.02em',
        lineHeight: 1,
        display: 'inline-flex',
        alignItems: 'baseline',
        ...style,
      }}
    >
      <span style={{ fontWeight: 700 }}>KRONO</span>
      <span style={{ fontWeight: 300 }}>SPACE</span>
    </span>
  );
}

// Logo completo: marca + wordmark, en columna o fila
export default function KronosLogo({
  markSize = 96,
  fontSize = 34,
  direction = 'column',
  gap = 18,
  style,
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: direction,
        alignItems: 'center',
        gap,
        ...style,
      }}
    >
      <KronosMark size={markSize} />
      <KronosWordmark fontSize={fontSize} />
    </div>
  );
}
