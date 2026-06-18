import React from 'react';

export default function IridescentDefs() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }}>
      <defs>
        <linearGradient id="iridescent-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#c9ced4" />
          <stop offset="30%" stopColor="#e9ecf0" />
          <stop offset="60%" stopColor="#e9ecf0" />
          <stop offset="100%" stopColor="#c9ced4" />
        </linearGradient>
        <linearGradient id="gloss-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
        </linearGradient>
        <filter id="3d-glass" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feComponentTransfer in="blur" result="glow">
            <feFuncA type="linear" slope="0.5" />
          </feComponentTransfer>
          <feSpecularLighting surfaceScale="3" specularConstant="1" specularExponent="20" lightingColor="#ffffff" in="blur" result="light">
            <feDistantLight azimuth="45" elevation="60" />
          </feSpecularLighting>
          <feComposite in="light" in2="SourceGraphic" operator="in" result="specular" />
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#9aa0a7" floodOpacity="0.3" />
        </filter>
      </defs>
    </svg>
  );
}
