import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const P = (...s: string[]) => join(ROOT, ...s);

/**
 * Generates the brand + hero image assets for the "logo = crest only, trademark
 * = Colonel's Pickle wordmark" identity split. Idempotent — safe to re-run.
 *
 *   npx tsx scripts/build-brand-assets.ts
 *
 * Outputs:
 *   public/images/brand/ridhwika-crest.png        — crest emblem, NO text (the logo)
 *   public/images/brand/colonels-pickle-wordmark.png — red trademark wordmark (transparent)
 *   public/og-image.jpg                            — 1200x630 social share banner
 *   src/app/icon.png / src/app/apple-icon.png      — favicon (crest)
 *   src/app/favicon.ico                            — classic /favicon.ico (crest, 16/32/48)
 *   public/hero/hero-banner-1.jpg                  — optimized homepage hero banner
 */

/** Knock out near-white pixels to transparent (chroma-key on white background). */
async function whiteToTransparent(
  input: string | Buffer,
  threshold = 240
): Promise<Buffer> {
  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const out = Buffer.from(data);
  for (let i = 0; i < out.length; i += channels) {
    if (out[i] >= threshold && out[i + 1] >= threshold && out[i + 2] >= threshold) {
      out[i + 3] = 0;
    }
  }
  return sharp(out, { raw: { width, height, channels } }).png().toBuffer();
}

const TRANSPARENT = { r: 0, g: 0, b: 0, alpha: 0 };

async function buildCrest(): Promise<string> {
  // ridhwika-agro-logo.png is 500x500: the laurel-wreath crest occupies the top
  // ~58%; the "Ridhwika / Agro Organics" wordmark is the bottom ~42% — crop it off.
  const CREST_H = 292;
  const cropped = await sharp(P('public/images/brand/ridhwika-agro-logo.png'))
    .extract({ left: 0, top: 0, width: 500, height: CREST_H })
    .png()
    .toBuffer();
  const keyed = await whiteToTransparent(cropped, 242);
  const out = P('public/images/brand/ridhwika-crest.png');
  await sharp(keyed)
    .trim({ threshold: 12 })
    .resize(512, 512, { fit: 'contain', background: TRANSPARENT })
    .png()
    .toFile(out);
  return out;
}

async function buildWordmark(): Promise<string> {
  // Client-supplied official trademark artwork (transparent AVIF, 691×382) —
  // the registered red "Colonel's Home Made Pickle" script with its white
  // sticker-outline. This is the canonical mark; we only transcode it to PNG
  // (no re-keying) so the exact artwork is preserved. It sits on a light plaque
  // wherever it appears on a dark/flat surface (navbar, footer, hero badge).
  const out = P('public/images/brand/colonels-pickle-wordmark.png');
  await sharp(P('public/images/brand/colonels-pickle-wordmark-source.avif'))
    .png()
    .toFile(out);
  return out;
}

async function buildOgImage(): Promise<string> {
  const W = 1200;
  const H = 630;

  const crest = await sharp(P('public/images/brand/ridhwika-crest.png'))
    .resize(300, 300, { fit: 'contain', background: TRANSPARENT })
    .png()
    .toBuffer();

  const wordmark = await sharp(P('public/images/brand/colonels-pickle-wordmark.png'))
    .resize({ width: 620, withoutEnlargement: false })
    .png()
    .toBuffer();
  const wmMeta = await sharp(wordmark).metadata();
  const wmH = wmMeta.height ?? 300;

  // Cream gradient + gold rule + tagline (Latin text → Georgia, no Devanagari font risk).
  const bg = Buffer.from(
    `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#FDF8F0"/>
          <stop offset="0.55" stop-color="#FAF1E1"/>
          <stop offset="1" stop-color="#F5ECD8"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#g)"/>
      <circle cx="285" cy="300" r="185" fill="#FFFFFF"/>
      <circle cx="285" cy="300" r="185" fill="none" stroke="#D4A017" stroke-width="4"/>
      <rect x="470" y="452" width="600" height="3" rx="1.5" fill="#D4A017"/>
      <text x="472" y="512" font-family="Georgia,'Times New Roman',serif" font-size="34" font-style="italic" fill="#7F1D1D">Maa Ka Pyaar, Ghar Ka Achaar</text>
      <text x="474" y="556" font-family="Georgia,serif" font-size="21" letter-spacing="1" fill="#78350F">No Preservatives · No Vinegar · FSSAI Licensed · Jaipur</text>
    </svg>`
  );

  const out = P('public/og-image.jpg');
  await sharp(bg)
    .composite([
      { input: crest, left: 285 - 150, top: 300 - 150 },
      { input: wordmark, left: 472, top: Math.round(300 - wmH / 2 - 60) },
    ])
    .jpeg({ quality: 90, mozjpeg: true })
    .toFile(out);
  return out;
}

async function buildFavicons(): Promise<string[]> {
  // Both favicons sit the crest on a solid WHITE square so the browser tab /
  // PWA install icon reads as a finished mark, not a logo floating on whatever
  // background the OS or tab strip happens to apply.
  const WHITE = '#FFFFFF';

  const crest440 = await sharp(P('public/images/brand/ridhwika-crest.png'))
    .resize(440, 440, { fit: 'contain', background: TRANSPARENT })
    .png()
    .toBuffer();
  const icon = P('src/app/icon.png');
  await sharp({
    create: { width: 512, height: 512, channels: 4, background: WHITE },
  })
    .composite([{ input: crest440, gravity: 'center' }])
    .png()
    .toFile(icon);

  const crest150 = await sharp(P('public/images/brand/ridhwika-crest.png'))
    .resize(154, 154, { fit: 'contain', background: TRANSPARENT })
    .png()
    .toBuffer();
  const apple = P('src/app/apple-icon.png');
  await sharp({
    create: { width: 180, height: 180, channels: 4, background: WHITE },
  })
    .composite([{ input: crest150, gravity: 'center' }])
    .png()
    .toFile(apple);
  return [icon, apple];
}

/**
 * Emit a classic multi-size /favicon.ico (16/32/48, PNG-encoded entries). Google
 * fetches /favicon.ico first when choosing the icon it shows beside a search
 * result, so having a real .ico here — not only icon.png — is what lets the crest
 * replace the default globe. PNG-in-ICO is valid for Googlebot + all modern browsers.
 */
async function buildFaviconIco(): Promise<string> {
  const WHITE = '#FFFFFF';
  const sizes = [16, 32, 48];
  const pngs: Buffer[] = [];
  for (const s of sizes) {
    const inner = Math.round(s * 0.86);
    const crest = await sharp(P('public/images/brand/ridhwika-crest.png'))
      .resize(inner, inner, { fit: 'contain', background: TRANSPARENT })
      .png()
      .toBuffer();
    const png = await sharp({
      create: { width: s, height: s, channels: 4, background: WHITE },
    })
      .composite([{ input: crest, gravity: 'center' }])
      .png()
      .toBuffer();
    pngs.push(png);
  }

  const count = sizes.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: 1 = icon
  header.writeUInt16LE(count, 4);

  const entries = Buffer.alloc(16 * count);
  let offset = 6 + 16 * count;
  for (let i = 0; i < count; i++) {
    const s = sizes[i];
    const png = pngs[i];
    const e = i * 16;
    entries.writeUInt8(s >= 256 ? 0 : s, e + 0); // width (0 = 256)
    entries.writeUInt8(s >= 256 ? 0 : s, e + 1); // height
    entries.writeUInt8(0, e + 2); // palette colors
    entries.writeUInt8(0, e + 3); // reserved
    entries.writeUInt16LE(1, e + 4); // color planes
    entries.writeUInt16LE(32, e + 6); // bits per pixel
    entries.writeUInt32LE(png.length, e + 8); // bytes in resource
    entries.writeUInt32LE(offset, e + 12); // offset from file start
    offset += png.length;
  }

  const out = P('src/app/favicon.ico');
  fs.writeFileSync(out, Buffer.concat([header, entries, ...pngs]));
  return out;
}

async function buildHeroBanner(): Promise<string | null> {
  const src = 'C:/Users/ashwi/Downloads/hero section 1.png';
  if (!fs.existsSync(src)) {
    console.warn('  hero banner source not found, skipping:', src);
    return null;
  }
  const out = P('public/hero/hero-banner-1.jpg');
  await sharp(src).jpeg({ quality: 88, mozjpeg: true }).toFile(out);
  return out;
}

async function main() {
  console.log('Building brand assets…');
  console.log('  crest      →', await buildCrest());
  console.log('  wordmark   →', await buildWordmark());
  console.log('  og-image   →', await buildOgImage());
  console.log('  favicons   →', (await buildFavicons()).join(', '));
  console.log('  favicon.ico→', await buildFaviconIco());
  const hero = await buildHeroBanner();
  if (hero) console.log('  hero       →', hero);
  console.log('Done.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
