// scripts/generate-favicon.ts
//
// Génère un vrai favicon.ico multi-résolution (16/32/48) depuis src/app/icon.png.
// Le fichier est placé dans src/app/favicon.ico — Next.js App Router le sert
// automatiquement avec le bon content-type (image/x-icon) sur GET /favicon.ico.
//
// Avant ce fix, GET /favicon.ico renvoyait du HTML (la homepage matchée par
// le catch-all [ville]/page.tsx), ce qui faisait que Google ne pouvait pas
// afficher le logo Bativio dans les SERPs et utilisait le fallback "globe".
//
// Usage : npx tsx scripts/generate-favicon.ts

import sharp from "sharp";
import fs from "fs";
import path from "path";

const SRC = path.resolve(__dirname, "..", "src", "app", "icon.png");
const DST = path.resolve(__dirname, "..", "src", "app", "favicon.ico");

const SIZES = [16, 32, 48];

async function main() {
  if (!fs.existsSync(SRC)) {
    console.error(`❌ Source PNG introuvable : ${SRC}`);
    process.exit(1);
  }

  // Generate PNG buffers at each size
  const buffers = await Promise.all(
    SIZES.map((s) => sharp(SRC).resize(s, s).png().toBuffer())
  );

  // Build ICO header
  const headerSize = 6 + 16 * SIZES.length;
  const totalDataSize = buffers.reduce((sum, b) => sum + b.length, 0);
  const ico = Buffer.alloc(headerSize + totalDataSize);

  // ICONDIR header
  ico.writeUInt16LE(0, 0); // Reserved, must be 0
  ico.writeUInt16LE(1, 2); // Type, 1 = icon
  ico.writeUInt16LE(SIZES.length, 4); // Count

  // ICONDIRENTRY for each image
  let dataOffset = headerSize;
  for (let i = 0; i < SIZES.length; i++) {
    const offset = 6 + 16 * i;
    const size = SIZES[i];

    // Width (0 means 256)
    ico.writeUInt8(size >= 256 ? 0 : size, offset);
    // Height
    ico.writeUInt8(size >= 256 ? 0 : size, offset + 1);
    // Color count (0 = no palette)
    ico.writeUInt8(0, offset + 2);
    // Reserved
    ico.writeUInt8(0, offset + 3);
    // Color planes
    ico.writeUInt16LE(1, offset + 4);
    // Bits per pixel
    ico.writeUInt16LE(32, offset + 6);
    // Image data size in bytes
    ico.writeUInt32LE(buffers[i].length, offset + 8);
    // Image data offset
    ico.writeUInt32LE(dataOffset, offset + 12);

    dataOffset += buffers[i].length;
  }

  // Write PNG data
  let pos = headerSize;
  for (const buf of buffers) {
    buf.copy(ico, pos);
    pos += buf.length;
  }

  fs.writeFileSync(DST, ico);
  const stats = fs.statSync(DST);
  console.log(`✅ Favicon généré : ${DST}`);
  console.log(`   Tailles : ${SIZES.join(", ")} px`);
  console.log(`   Taille fichier : ${stats.size} bytes`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
