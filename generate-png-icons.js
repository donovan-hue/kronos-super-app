// Genera PNGs reales sin dependencias externas usando el formato PNG manualmente
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const iconsDir = path.join(__dirname, 'client', 'public', 'icons');
if (!fs.existsSync(iconsDir)) fs.mkdirSync(iconsDir, { recursive: true });

function crc32(buf) {
  let crc = 0xFFFFFFFF;
  const table = [];
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    table[i] = c;
  }
  for (let i = 0; i < buf.length; i++) crc = table[(crc ^ buf[i]) & 0xFF] ^ (crc >>> 8);
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

function writeUint32BE(val) {
  return Buffer.from([(val >>> 24) & 0xFF, (val >>> 16) & 0xFF, (val >>> 8) & 0xFF, val & 0xFF]);
}

function chunk(type, data) {
  const typeBytes = Buffer.from(type, 'ascii');
  const lenBuf = writeUint32BE(data.length);
  const crcInput = Buffer.concat([typeBytes, data]);
  const crcBuf = writeUint32BE(crc32(crcInput));
  return Buffer.concat([lenBuf, typeBytes, data, crcBuf]);
}

function makePNG(size) {
  // Genera un gradiente tornasol simple: azul→cyan→rosa
  const pixels = [];
  for (let y = 0; y < size; y++) {
    pixels.push(0); // filter byte = None
    for (let x = 0; x < size; x++) {
      // Fondo con gradiente diagonal
      const t = (x + y) / (size * 2);
      // Gradiente: #4facfe → #f3a0ff
      const r = Math.round(79 + (243 - 79) * t);
      const g = Math.round(172 + (160 - 172) * t);
      const b = Math.round(254 + (255 - 254) * t);
      const a = 255;

      // Borde redondeado (radio = size*0.2)
      const cx = x - size / 2, cy = y - size / 2;
      const rad = size * 0.22;
      const dx = Math.max(0, Math.abs(cx) - (size / 2 - rad));
      const dy = Math.max(0, Math.abs(cy) - (size / 2 - rad));
      if (dx * dx + dy * dy > rad * rad) {
        pixels.push(0, 0, 0, 0); // transparent
        continue;
      }

      // Letra K simple en el centro
      const kx = (x / size - 0.5) * 2; // -1 to 1
      const ky = (y / size - 0.5) * 2; // -1 to 1

      // Trazo vertical de la K
      const inVertical = kx >= -0.28 && kx <= -0.04 && ky >= -0.52 && ky <= 0.52;
      // Trazo superior diagonal de la K
      const inTopDiag = !inVertical && kx >= -0.04 && kx <= 0.36 && ky >= -0.52 && ky <= 0.04 &&
        (ky <= -2.0 * kx + 0.04 - 0.08) && (ky >= -2.0 * kx + 0.04 - 0.38);
      // Trazo inferior diagonal de la K
      const inBotDiag = !inVertical && kx >= -0.04 && kx <= 0.36 && ky >= -0.04 && ky <= 0.52 &&
        (ky >= 2.0 * kx - 0.08) && (ky <= 2.0 * kx + 0.24);

      if (inVertical || inTopDiag || inBotDiag) {
        pixels.push(255, 255, 255, 240); // blanco
      } else {
        pixels.push(r, g, b, a);
      }
    }
  }

  const rawData = Buffer.from(pixels);
  const compressed = zlib.deflateSync(rawData, { level: 9 });

  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = chunk('IHDR', Buffer.concat([
    writeUint32BE(size), writeUint32BE(size),
    Buffer.from([8, 6, 0, 0, 0]) // 8-bit RGBA
  ]));
  const idat = chunk('IDAT', compressed);
  const iend = chunk('IEND', Buffer.alloc(0));

  return Buffer.concat([sig, ihdr, idat, iend]);
}

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
sizes.forEach(size => {
  const png = makePNG(size);
  fs.writeFileSync(path.join(iconsDir, `icon-${size}.png`), png);
  console.log(`✓ icon-${size}.png (${png.length} bytes)`);
});

// Screenshot placeholder 390x844
const ss = makePNG(390); // solo por tener algo
fs.writeFileSync(path.join(iconsDir, 'screenshot-mobile.png'), ss);
console.log('✓ screenshot-mobile.png');
console.log('\nIconos PNG generados correctamente.');
