import React from 'react';

/* Gradientes SVG plateados compartidos (#ksV, #ksDiag, #ksSph).
   Debe renderizarse una vez en la pantalla para que los iconos .ks-ico hereden el metal. */
export function KsDefs() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
      <defs>
        <linearGradient id="ksV" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" /><stop offset="16%" stopColor="#e9edf1" />
          <stop offset="44%" stopColor="#a4aab1" /><stop offset="51%" stopColor="#74787f" />
          <stop offset="58%" stopColor="#bcc1c8" /><stop offset="84%" stopColor="#eef0f3" />
          <stop offset="100%" stopColor="#c9ced4" />
        </linearGradient>
        <linearGradient id="ksDiag" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fdfefe" /><stop offset="30%" stopColor="#c2c7ce" />
          <stop offset="50%" stopColor="#7a7e85" /><stop offset="70%" stopColor="#c8cdd3" />
          <stop offset="100%" stopColor="#f2f4f6" />
        </linearGradient>
        <radialGradient id="ksSph" cx="34%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#ffffff" /><stop offset="40%" stopColor="#c4c9cf" />
          <stop offset="100%" stopColor="#46494f" />
        </radialGradient>
      </defs>
    </svg>
  );
}

/* Trazos de iconos de línea (estética KRONOSPACE) */
const PATHS = {
  key: <><circle cx="8" cy="12" r="4" /><path d="M11.6 12H20M17.2 12v3M20 12v2.4" /></>,
  lock: <><rect x="5" y="10.5" width="14" height="9.5" rx="2.5" /><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" /><circle cx="12" cy="15" r="1.2" /></>,
  mail: <><rect x="3.5" y="5.5" width="17" height="13" rx="2.5" /><path d="M4.5 7.2 12 12.5 19.5 7.2" /></>,
  check: <path d="M5 12.5l4.2 4.2L19 7" />,
  shieldCheck: <><path d="M12 3l7 3v5c0 4.4-3 8-7 10-4-2-7-5.6-7-10V6Z" /><path d="M9.2 12l2 2 3.6-4" /></>,
  back: <path d="M14.5 5.5l-6.5 6.5 6.5 6.5" />,
  alert: <><path d="M12 4 21 19H3Z" /><path d="M12 10v4" /><circle cx="12" cy="16.4" r="0.6" /></>,
};

export function Icon({ name, size = 22, className = '' }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={`ks-ico ${className}`.trim()}>
      {PATHS[name]}
    </svg>
  );
}

/* Wordmark KRONO·SPACE metálico */
export function Wordmark({ size = 18 }) {
  return (
    <span className="wm metal-text" style={{ fontSize: size }}>
      <span className="k">KRONO</span><span className="s">SPACE</span>
    </span>
  );
}
