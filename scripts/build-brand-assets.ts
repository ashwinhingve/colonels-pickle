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
  // colonels-pickle-logo-plain.jpeg is the red "Colonel's Home Made Pickle"
  // wordmark on white. Key the white out and trim so it sits on any background.
  const keyed = await whiteToTransparent(
    P('public/images/brand/colonels-pickle-logo-plain.jpeg'),
    246
  );
  const out = P('public/images/brand/colonels-pickle-wordmark.png');
  await sharp(keyed)
    .trim({ threshold: 12 })
    .resize({ width: 900, withoutEnlargement: true })
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

  // Olive gradient + gold rule + tagline (Latin text → Georgia, no Devanagari font risk).
  const bg = Buffer.from(
    `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#3A4A1F"/>
          <stop offset="0.55" stop-color="#4B5D2A"/>
          <stop offset="1" stop-color="#232B14"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#g)"/>
      <circle cx="285" cy="300" r="185" fill="#FDF8F0"/>
      <circle cx="285" cy="300" r="185" fill="none" stroke="#D4A017" stroke-width="4"/>
      <rect x="470" y="452" width="600" height="3" rx="1.5" fill="#D4A017"/>
      <text x="472" y="512" font-family="Georgia,'Times New Roman',serif" font-size="34" font-style="italic" fill="#F5EBDA">Maa Ka Pyaar, Ghar Ka Achar</text>
      <text x="474" y="556" font-family="Georgia,serif" font-size="21" letter-spacing="1" fill="#E9C86A">No Preservatives · No Vinegar · FSSAI Licensed · Jaipur</text>
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
  const hero = await buildHeroBanner();
  if (hero) console.log('  hero       →', hero);
  console.log('Done.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
