// One-off build script: generate AVIF/WebP responsive variants for the hero,
// gallery and barber portraits, plus a favicon set. Run with:
//   node scripts/build-images.mjs
// Originals are never touched or deleted.
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const imgDir = path.join(root, 'img');

async function heroVariants() {
  const src = path.join(imgDir, 'hero-1.jpg');
  const widths = [480, 768, 1280, 1920];
  for (const w of widths) {
    const base = sharp(src).resize({ width: w, withoutEnlargement: true });
    await base.clone().avif({ quality: 50 }).toFile(path.join(imgDir, `hero-1-${w}.avif`));
    await base.clone().webp({ quality: 78 }).toFile(path.join(imgDir, `hero-1-${w}.webp`));
  }
  console.log('hero variants done');
}

async function galleryAndPortraits() {
  const files = fs.readdirSync(imgDir).filter(f =>
    (f.startsWith('gallery-vk-') || f.startsWith('barber-')) && f.endsWith('.jpg')
  );
  for (const f of files) {
    const src = path.join(imgDir, f);
    const name = f.replace(/\.jpg$/, '');
    const meta = await sharp(src).metadata();
    const targetW = Math.min(1200, meta.width);
    const base = sharp(src).resize({ width: targetW, withoutEnlargement: true });
    await base.clone().webp({ quality: 78 }).toFile(path.join(imgDir, `${name}.webp`));
    const st = fs.statSync(path.join(imgDir, `${name}.webp`));
    console.log(name, 'webp', Math.round(st.size / 1024) + 'KB');
  }
}

async function favicons() {
  const svgMark = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" fill="#15110E"/>
  <text x="32" y="44" font-family="Oswald, sans-serif" font-size="40" font-weight="700"
    text-anchor="middle" fill="#C9A96E">Л</text>
</svg>`;
  fs.writeFileSync(path.join(imgDir, 'favicon.svg'), svgMark);
  await sharp(Buffer.from(svgMark)).resize(32, 32).png().toFile(path.join(imgDir, 'favicon-32.png'));
  await sharp(Buffer.from(svgMark)).resize(180, 180).png().toFile(path.join(imgDir, 'apple-touch-icon.png'));
  console.log('favicons done');
}

await heroVariants();
await galleryAndPortraits();
await favicons();
console.log('all image variants generated');
