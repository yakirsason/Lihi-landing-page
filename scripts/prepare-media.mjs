import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

// Optimize supplied originals without changing or overwriting them.
// Before/after images use lossless encoding: no retouching, filtering or resizing.
const files = [
  { source: 'תמונת פתיחה ראשית.png', target: 'hero/hero-portrait.webp', width: 1200 },
  { source: 'תמונת פתיחה ראשית.png', target: 'hero/hero-mobile.webp', width: 900 },
  { source: 'תמונה מקצועית של התעודה.png', target: 'about/certification.webp', lossless: true },
  { source: 'הקלינקה.png', target: 'clinic/interior.webp', width: 1100 },
  { source: 'לפני.png', target: 'results/result-01-before.webp', lossless: true },
  { source: 'אחרי.png', target: 'results/result-01-after.webp', lossless: true },
];

for (const file of files) {
  const output = new URL(`../public/media/${file.target}`, import.meta.url);
  await mkdir(new URL('./', output), { recursive: true });
  let image = sharp(fileURLToPath(new URL(`../${file.source}`, import.meta.url)));
  if (file.width) image = image.resize({ width: file.width, withoutEnlargement: true });
  const info = await image.webp(file.lossless ? { lossless: true, effort: 6 } : { quality: 90, effort: 6 }).toFile(fileURLToPath(output));
  console.log(`${file.target}: ${info.width} × ${info.height}, ${(info.size / 1024).toFixed(0)} KB`);
}
