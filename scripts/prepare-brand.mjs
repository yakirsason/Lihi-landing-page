import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const source = fileURLToPath(new URL('../LIHI Skin Studio Logo.png', import.meta.url));
const directory = new URL('../public/brand/', import.meta.url);
await mkdir(directory, { recursive: true });

// Preserve original RGBA pixels. Crop empty margins only, with a safety margin
// around the complete lettering and its original antialiased edges.
const full = await sharp(source).extract({ left: 444, top: 139, width: 1278, height: 523 }).png().toBuffer();
const wordmark = await sharp(source).extract({ left: 444, top: 139, width: 1278, height: 406 }).png().toBuffer();
await sharp(full).toFile(fileURLToPath(new URL('lihi-skin-studio.png', directory)));
await sharp(wordmark).toFile(fileURLToPath(new URL('lihi-wordmark.png', directory)));

// Use the supplied wordmark, without redrawing or recoloring it, for app icons.
for (const size of [32, 64, 180]) {
  await sharp(wordmark).resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png()
    .toFile(fileURLToPath(new URL(`favicon-${size}.png`, directory)));
}

const shareLogo = await sharp(full).resize({ width: 900 }).png().toBuffer();
await sharp({ create: { width: 1200, height: 630, channels: 4, background: '#f7f5f1' } })
  .composite([{ input: shareLogo, gravity: 'centre' }]).png()
  .toFile(fileURLToPath(new URL('social-share.png', directory)));
console.log('Prepared approved logo, compact wordmark, favicons and sharing image. Original logo unchanged.');
