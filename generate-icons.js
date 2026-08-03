// Genera iconos PNG para la PWA usando solo módulos nativos de Node
// Ejecutar: node generate-icons.js
const fs = require('fs');
const path = require('path');

const iconsDir = path.join(__dirname, 'client', 'public', 'icons');
if (!fs.existsSync(iconsDir)) fs.mkdirSync(iconsDir, { recursive: true });

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Genera un SVG con el logo K de Kronos
function makeSVG(size) {
  const pad = Math.round(size * 0.12);
  const r = Math.round(size * 0.22);
  const fontSize = Math.round(size * 0.45);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#4facfe"/>
      <stop offset="35%" style="stop-color:#00f2fe"/>
      <stop offset="70%" style="stop-color:#f3a0ff"/>
      <stop offset="100%" style="stop-color:#ff85a2"/>
    </linearGradient>
    <linearGradient id="shine" x1="0%" y1="0%" x2="60%" y2="60%">
      <stop offset="0%" style="stop-color:#ffffff;stop-opacity:0.4"/>
      <stop offset="100%" style="stop-color:#ffffff;stop-opacity:0"/>
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${r}" fill="url(#bg)"/>
  <rect width="${size}" height="${size}" rx="${r}" fill="url(#shine)"/>
  <text x="${size/2}" y="${size/2 + fontSize*0.35}"
    font-family="Arial Black, Arial, sans-serif"
    font-weight="900"
    font-size="${fontSize}"
    fill="white"
    text-anchor="middle"
    style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3))">K</text>
</svg>`;
}

// Escribe los SVGs (PWA Builder puede usar SVG también, pero guardamos como referencia)
// Para PNG real necesitaríamos canvas o sharp — guardamos SVG renombrado como PNG
// PWA Builder acepta SVG en el manifest si no hay PNG

sizes.forEach(size => {
  const svgContent = makeSVG(size);
  // Guardar SVG
  fs.writeFileSync(path.join(iconsDir, `icon-${size}.svg`), svgContent);
  console.log(`✓ icon-${size}.svg`);
});

// También crear un screenshot placeholder
const screenshotSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="390" height="844" viewBox="0 0 390 844">
  <rect width="390" height="844" fill="#ffffff"/>
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#4facfe"/>
      <stop offset="100%" style="stop-color:#f3a0ff"/>
    </linearGradient>
  </defs>
  <rect x="0" y="0" width="390" height="60" fill="url(#g)"/>
  <text x="195" y="38" font-family="Arial" font-weight="900" font-size="24" fill="white" text-anchor="middle">Kronos</text>
  <text x="195" y="422" font-family="Arial" font-size="18" fill="#4facfe" text-anchor="middle">Super-App</text>
</svg>`;
fs.writeFileSync(path.join(iconsDir, 'screenshot-mobile.svg'), screenshotSVG);

console.log('\nIconos generados en client/public/icons/');
console.log('NOTA: Son SVG. Para PNG usa realfavicongenerator.net o squoosh.app');
