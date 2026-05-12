/**
 * Women portrait sources → grayscale AVIF in /public/creators/.
 * Run: node scripts/build-creator-avifs.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, '../public/creators');

/** Unsplash portraits — women only */
const SOURCES = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&h=1000&fit=crop&auto=format&q=86',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&h=1000&fit=crop&auto=format&q=86',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&h=1000&fit=crop&auto=format&q=86',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&h=1000&fit=crop&auto=format&q=86',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&h=1000&fit=crop&auto=format&q=86',
  'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&h=1000&fit=crop&auto=format&q=86',
  'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&h=1000&fit=crop&auto=format&q=86',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&h=1000&fit=crop&auto=format&q=86',
  'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=800&h=1000&fit=crop&auto=format&q=86',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=1000&fit=crop&auto=format&q=86',
];

fs.mkdirSync(outDir, { recursive: true });

for (let i = 0; i < SOURCES.length; i++) {
  const url = SOURCES[i];
  const name = `creator-${String(i + 1).padStart(2, '0')}.avif`;
  const dest = path.join(outDir, name);
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Fetch failed ${i + 1} ${res.status} ${url}`);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  await sharp(buf)
    .resize(480, 600, { fit: 'cover', position: sharp.strategy.attention })
    .grayscale()
    .avif({ quality: 50, effort: 5 })
    .toFile(dest);
  console.log('Wrote', path.relative(process.cwd(), dest));
}

console.log('Done:', SOURCES.length, 'AVIF files');
