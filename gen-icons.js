const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const dir = 'D:\\bisheng-youyang\\frontend\\dist\\assets\\images';

const icons = [
  { name: 'tab-home', color: '#999999' },
  { name: 'tab-home-active', color: '#EAA78B' },
  { name: 'tab-category', color: '#999999' },
  { name: 'tab-category-active', color: '#EAA78B' },
  { name: 'tab-cart', color: '#999999' },
  { name: 'tab-cart-active', color: '#EAA78B' },
  { name: 'tab-checkin', color: '#999999' },
  { name: 'tab-checkin-active', color: '#EAA78B' },
  { name: 'tab-user', color: '#999999' },
  { name: 'tab-user-active', color: '#EAA78B' },
];

const PNG_HEADER = Buffer.from([137,80,78,71,13,10,26,10]);

function crc32(buf) {
  let crc = 0xFFFFFFFF;
  const table = new Int32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    table[i] = c;
  }
  for (let i = 0; i < buf.length; i++) crc = table[(crc ^ buf[i]) & 0xFF] ^ (crc >>> 8);
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

function createChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const typeData = Buffer.concat([Buffer.from(type), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(typeData));
  return Buffer.concat([len, typeData, crc]);
}

const W = 81, H = 81;

for (const icon of icons) {
  const hex = icon.color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // RGBA for transparency support
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(W, 0);
  ihdr.writeUInt32BE(H, 4);
  ihdr[8] = 8;  // bit depth
  ihdr[9] = 6;  // color type RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const rawData = Buffer.alloc(H * (1 + W * 4));
  for (let y = 0; y < H; y++) {
    const offset = y * (1 + W * 4);
    rawData[offset] = 0;
    for (let x = 0; x < W; x++) {
      const px = offset + 1 + x * 4;
      const cx = W / 2, cy = H / 2, radius = 26;
      const dx = x - cx, dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist <= radius && dist >= radius - 8) {
        // Ring shape
        rawData[px] = r;
        rawData[px + 1] = g;
        rawData[px + 2] = b;
        rawData[px + 3] = 255;
      } else {
        rawData[px] = 0;
        rawData[px + 1] = 0;
        rawData[px + 2] = 0;
        rawData[px + 3] = 0; // transparent
      }
    }
  }

  const compressed = zlib.deflateSync(rawData);
  const png = Buffer.concat([
    PNG_HEADER,
    createChunk('IHDR', ihdr),
    createChunk('IDAT', compressed),
    createChunk('IEND', Buffer.alloc(0))
  ]);

  fs.writeFileSync(path.join(dir, icon.name + '.png'), png);
  console.log('Created: ' + icon.name + '.png (' + png.length + ' bytes)');
}
