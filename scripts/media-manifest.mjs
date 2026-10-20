import { writeFile, mkdir } from 'node:fs/promises';
// The manifest stays importable in Node while browser asset discovery is Vite-specific.
const source = await import('node:fs/promises').then(fs => fs.readFile(new URL('../src/media.js', import.meta.url), 'utf8'));
const configOnly = source.split('export const mediaById')[0];
const { mediaManifest } = await import(`data:text/javascript,${encodeURIComponent(configOnly)}`);
await mkdir(new URL('../docs/', import.meta.url), { recursive: true });
await writeFile(new URL('../docs/media-manifest.json', import.meta.url), JSON.stringify(mediaManifest, null, 2) + '\n');
console.log(`Media manifest: ${mediaManifest.length} asset destinations documented.`);
