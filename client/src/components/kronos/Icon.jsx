import React from 'react';

/**
 * Iconos de línea KRONOSPACE — un solo trazo plata (gradiente #ksV definido en index.html).
 * Reemplazan a los emojis de color en toda la app.
 *
 *   <Icon name="send" size={20} />
 *
 * Para color sólido en vez del gradiente metálico, pasa `stroke="currentColor"`.
 */
const PATHS = {
  send: <><path d="M22 3L11 14" /><path d="M22 3l-7 18-4-8-8-4z" /></>,
  receive: <><path d="M12 4v11M8 11l4 4 4-4" /><path d="M5 20h14" /></>,
  up: <path d="M12 19V5M6 11l6-6 6 6" />,
  down: <path d="M12 5v14M6 13l6 6 6-6" />,
  arrowRight: <path d="M5 12h14M13 6l6 6-6 6" />,
  refund: <path d="M9 7L4 12l5 5M4 12h10a5 5 0 0 1 0 10" />,
  card: <><rect x="3" y="6" width="18" height="12" rx="2.2" /><path d="M3 10h18" /></>,
  chart: <path d="M5 20V11M12 20V5M19 20v-6M4 20h16" />,
  star: <path d="M12 4l2.3 5 5.4.5-4.1 3.6 1.3 5.3L12 20.6 7.1 18.4l1.3-5.3L4.3 9.5 9.7 9z" />,
  coin: <><circle cx="12" cy="12" r="8" /><path d="M12 8v8M9.6 10h3.1a1.6 1.6 0 0 1 0 3.2H9.6" /></>,
  bag: <><path d="M6 8h12l-1 12H7L6 8z" /><path d="M9 8a3 3 0 0 1 6 0" /></>,
  lock: <><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></>,
  unlock: <><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 7.5-2" /></>,
  check: <path d="M5 12l4 4 10-10" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  eye: <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" /><circle cx="12" cy="12" r="3" /></>,
  eyeOff: <><path d="M3 3l18 18" /><path d="M10.6 6.1A10 10 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3.2 3.8M6.5 6.6A16 16 0 0 0 2 12s3.5 7 10 7a10 10 0 0 0 3.3-.6" /></>,
  gift: <><rect x="4" y="9" width="16" height="11" rx="1.5" /><path d="M4 13h16M12 9v11" /><path d="M12 9C10.5 9 8.5 8.6 8.5 6.8S11 4.5 12 9zM12 9c1.5 0 3.5-.4 3.5-2.2S13 4.5 12 9z" /></>,
  fire: <path d="M13 3c.5 3-1.5 4.5-2.7 6C9 10.7 8 11.8 8 14a4 4 0 0 0 8 0c0-2-1-3.3-1-5 1 .5 1.5 1.3 1.7 2.3C18 9 16 5 13 3z" />,
  sparkle: <path d="M12 4l1.6 4.4L18 10l-4.4 1.6L12 16l-1.6-4.4L6 10l4.4-1.6z" />,
  money: <><rect x="3" y="7" width="18" height="10" rx="2" /><circle cx="12" cy="12" r="2.4" /><path d="M6 9v6M18 9v6" /></>,
  bell: <><path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6z" /><path d="M10 20a2 2 0 0 0 4 0" /></>,
  user: <><circle cx="12" cy="8" r="3.4" /><path d="M5 20a7 7 0 0 1 14 0" /></>,
  users: <><circle cx="8" cy="9" r="2.6" /><circle cx="16" cy="9" r="2.6" /><path d="M3 19a5 5 0 0 1 10 0M13 19a5 5 0 0 1 8 0" /></>,
  search: <><circle cx="11" cy="11" r="6" /><path d="M20 20l-4-4" /></>,
  settings: <><circle cx="12" cy="12" r="3" /><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" /></>,
  heart: <path d="M12 20s-7-4.3-7-9a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 4.7-7 9-7 9z" />,
  calendar: <><rect x="4" y="6" width="16" height="14" rx="2" /><path d="M4 10h16M8 4v4M16 4v4" /></>,
  ticket: <><path d="M4 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2 2 2 0 0 0 0 4 2 2 0 0 1-2 2v2H6v-2a2 2 0 0 1 0-4 2 2 0 0 0-2-2z" /></>,
  trophy: <><path d="M7 4h10v4a5 5 0 0 1-10 0V4z" /><path d="M7 6H4v1a3 3 0 0 0 3 3M17 6h3v1a3 3 0 0 1-3 3M10 16h4v3h-4zM8 21h8" /></>,
  bolt: <path d="M13 3L5 13h6l-1 8 8-11h-6z" />,
  trending: <path d="M4 16l5-5 4 4 7-8M16 7h4v4" />,
  pin: <><path d="M12 21s7-6.3 7-12a7 7 0 0 0-14 0c0 5.7 7 12 7 12z" /><circle cx="12" cy="9" r="2.5" /></>,
  clock: <><circle cx="12" cy="12" r="8.5" /><path d="M12 7v5l3 2" /></>,
  plus: <path d="M12 5v14M5 12h14" />,
  image: <><rect x="4" y="5" width="16" height="14" rx="2" /><circle cx="9" cy="10" r="1.6" /><path d="M5 17l4.5-4.5L13 16l2.5-2.5L19 17" /></>,
  video: <><rect x="3" y="6" width="13" height="12" rx="2" /><path d="M16 10l5-3v10l-5-3" /></>,
  shield: <><path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" /><path d="M9 12l2 2 4-4" /></>,
  wallet: <><rect x="3" y="6" width="18" height="13" rx="2.5" /><path d="M16 12h2" /></>,
  flame: <path d="M13 3c.5 3-1.5 4.5-2.7 6C9 10.7 8 11.8 8 14a4 4 0 0 0 8 0c0-2-1-3.3-1-5 1 .5 1.5 1.3 1.7 2.3C18 9 16 5 13 3z" />,
  footsteps: <><path d="M7 4c1.5 0 2.5 1.6 2.5 3.6S8.5 12 7 12s-2.5-1.6-2.5-4.4S5.5 4 7 4z" /><path d="M5 14c1.6-.4 3.6.6 3.6 2.6 0 1.6-1 2.4-2.4 2.4S4 18 4 16.6c0-1 .4-2.2 1-2.6z" /><path d="M17 8c1.5 0 2.5 1.6 2.5 3.6S18.5 16 17 16s-2.5-1.6-2.5-4.4S15.5 8 17 8z" /></>,
  drop: <path d="M12 3c3 4 6 7 6 10.5A6 6 0 0 1 6 13.5C6 10 9 7 12 3z" />,
  message: <><path d="M4 5h16v11H8l-4 4z" /><path d="M8 9h8M8 12h5" /></>,
  laptop: <><rect x="4" y="5" width="16" height="11" rx="1.5" /><path d="M2 20h20" /></>,
  link: <><path d="M9 15l6-6" /><path d="M11 6l1-1a4 4 0 0 1 6 6l-1 1M13 18l-1 1a4 4 0 0 1-6-6l1-1" /></>,
  save: <><path d="M5 4h11l3 3v13H5z" /><path d="M8 4v5h7V4M8 20v-6h8v6" /></>,
  qr: <><rect x="4" y="4" width="6" height="6" rx="1" /><rect x="14" y="4" width="6" height="6" rx="1" /><rect x="4" y="14" width="6" height="6" rx="1" /><path d="M14 14h3v3M20 14v6M14 20h3" /></>,
  copy: <><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15V5a2 2 0 0 1 2-2h8" /></>,
  globe: <><circle cx="12" cy="12" r="8.5" /><path d="M3.5 12h17M12 3.5c2.5 2.4 2.5 14.6 0 17M12 3.5c-2.5 2.4-2.5 14.6 0 17" /></>,
  smileGreat: <><circle cx="12" cy="12" r="9" /><path d="M8 14a4 4 0 0 0 8 0z" /><path d="M8.5 9.5h.01M15.5 9.5h.01" /></>,
  smileGood: <><circle cx="12" cy="12" r="9" /><path d="M8.5 14a4.5 4.5 0 0 0 7 0" /><path d="M8.5 9.5h.01M15.5 9.5h.01" /></>,
  smileOkay: <><circle cx="12" cy="12" r="9" /><path d="M8.5 14.5h7" /><path d="M8.5 9.5h.01M15.5 9.5h.01" /></>,
  smileBad: <><circle cx="12" cy="12" r="9" /><path d="M8.5 15a4.5 4.5 0 0 1 7 0" /><path d="M8.5 9.5h.01M15.5 9.5h.01" /></>,
  smileTerrible: <><circle cx="12" cy="12" r="9" /><path d="M8 16a4 4 0 0 1 8 0z" /><path d="M8 10l1.5-1M16 10l-1.5-1" /></>,
  mic: <><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M6 11a6 6 0 0 0 12 0M12 17v4M9 21h6" /></>,
  micOff: <><path d="M9 5a3 3 0 0 1 6 0v5M15 13a3 3 0 0 1-4.6 1.5" /><path d="M6 11a6 6 0 0 0 9.2 5M12 17v4M9 21h6" /><path d="M4 4l16 16" /></>,
  camOff: <><path d="M16 10l5-3v10l-3-1.8" /><path d="M3 6h11v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" opacity="0" /><path d="M3 8v9a1 1 0 0 0 1 1h10M14 8H7" /><path d="M4 4l16 16" /></>,
  phone: <path d="M6 3c1 0 1.6.4 2 1.5l1 2.6c.3.8.1 1.4-.5 1.9l-1 .8a11 11 0 0 0 4.2 4.2l.8-1c.5-.6 1.1-.8 1.9-.5l2.6 1c1.1.4 1.5 1 1.5 2v2c0 1.3-.9 2.2-2.3 2C9.7 21.2 2.8 14.3 4 6.3 4.2 5 5 4 6 4z" />,
  phoneEnd: <><path d="M3 11c5-3.5 13-3.5 18 0v3l-4-1v-2c-3-1.5-7-1.5-10 0v2l-4 1z" /><path d="M3 11l18 0" opacity="0" /></>,
  broadcast: <><circle cx="12" cy="12" r="2.2" /><path d="M7.5 7.5a6 6 0 0 0 0 9M16.5 16.5a6 6 0 0 0 0-9M4.5 4.5a10 10 0 0 0 0 15M19.5 19.5a10 10 0 0 0 0-15" /></>,
  tv: <><rect x="3" y="6" width="18" height="13" rx="2" /><path d="M8 3l4 3 4-3" /></>,
  play: <path d="M7 4l13 8-13 8z" />,
  music: <><circle cx="7" cy="17" r="2.5" /><circle cx="17" cy="15" r="2.5" /><path d="M9.5 17V6l10-2v11" /></>,
  back: <path d="M19 12H5M11 6l-6 6 6 6" />,
  stop: <rect x="6" y="6" width="12" height="12" rx="2.5" />,
  square: <rect x="4" y="4" width="16" height="16" rx="3" />,
  checkSquare: <><rect x="4" y="4" width="16" height="16" rx="3" /><path d="M8 12l3 3 5-6" /></>,
  thumbsUp: <><path d="M7 11v9H4v-9z" /><path d="M7 11l4-7c1.3 0 2 .9 2 2v3h5a2 2 0 0 1 2 2.3l-1.2 6A2 2 0 0 1 16.8 20H7" /></>,
  share: <><circle cx="18" cy="5" r="2.5" /><circle cx="6" cy="12" r="2.5" /><circle cx="18" cy="19" r="2.5" /><path d="M8.2 10.8l7.6-4.4M8.2 13.2l7.6 4.4" /></>,
  edit: <><path d="M4 20h4L19 9l-4-4L4 16z" /><path d="M14 6l4 4" /></>,
  bookmark: <path d="M6 4h12v16l-6-4-6 4z" />,
  note: <><rect x="5" y="3" width="14" height="18" rx="2" /><path d="M9 8h6M9 12h6M9 16h3" /></>,
  home: <><path d="M3 11l9-7 9 7" /><path d="M5 10v9h5v-6h4v6h5v-9" /></>,
  book: <><path d="M12 6C10 4.5 6.5 4.5 4 5v13c2.5-.5 6-.5 8 1 2-1.5 5.5-1.5 8-1V5c-2.5-.5-6-.5-8 1z" /><path d="M12 6v14" /></>,
  trash: <><path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M6 7l1 13h10l1-13" /><path d="M10 11v6M14 11v6" /></>,
  gem: <><path d="M3 9l4-5h10l4 5-9 12z" /><path d="M3 9h18M8 4L7 9l5 12 5-12-1-5" /></>,
  food: <><path d="M4 13a8 8 0 0 1 16 0" /><path d="M3 13h18M12 4v1.2" /></>,
  cart: <><circle cx="9" cy="20" r="1.4" /><circle cx="17" cy="20" r="1.4" /><path d="M3 4h2l2.4 11a1.5 1.5 0 0 0 1.5 1.2h7.6a1.5 1.5 0 0 0 1.5-1.2L20 8H6" /></>,
  box: <><path d="M3 8l9-5 9 5v8l-9 5-9-5z" /><path d="M3 8l9 5 9-5M12 13v8" /></>,
  briefcase: <><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18" /></>,
};

export default function Icon({ name, size = 20, stroke = 'url(#ksV)', strokeWidth = 1.7, style, ...rest }) {
  const d = PATHS[name];
  if (!d) return null;
  return (
    <svg viewBox="0 0 24 24" width={size} height={size}
      style={{ fill: 'none', stroke, strokeWidth, strokeLinecap: 'round', strokeLinejoin: 'round', flex: 'none', ...style }}
      {...rest}
    >
      {d}
    </svg>
  );
}

export const ICON_NAMES = Object.keys(PATHS);
