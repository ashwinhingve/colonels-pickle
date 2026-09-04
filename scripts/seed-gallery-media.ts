import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join, extname, basename } from 'path';
import fs from 'fs';
import mongoose from 'mongoose';
import GalleryMedia from '../src/models/GalleryMedia';

// Load environment variables from .env.local
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env.local') });

/**
 * Seed the Gallery with the client's real production/process media.
 *
 * Source folder: the client dropped raw WhatsApp exports into
 * `Downloads\achar` on the operator's machine — this script uploads them to
 * Cloudinary and creates a GalleryMedia doc per file. It is a one-time local
 * content-loading utility (like scripts/seed-products.ts), not part of the
 * build — it only runs on a machine that actually has that folder.
 *
 * Usage: npx tsx scripts/seed-gallery-media.ts
 */

const SOURCE_DIR = 'C:\\Users\\ashwi\\Downloads\\achar';

// Not client product/process media — an unrelated cartoon that happens to share
// the WhatsApp export naming pattern. Never seed this file.
const EXCLUDED_FILES = new Set(['WhatsApp Image 2026-08-25 at 9.56.40 PM.jpeg']);

const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp']);
const VIDEO_EXTS = new Set(['.mp4', '.mov', '.webm']);

const TITLES = [
  'Hand-Sorted Green Chillies',
  'Fresh Harvest, Ready for Pickling',
  'Traditional Sorting Process',
  'Quality Check — Every Chilli Counts',
  'From Farm to Jar',
  'Behind the Scenes at Colonel’s Pickle',
];

const HERO_POOL_SIZE = 5;

async function run() {
  try {
    console.log('🚀 Seeding Gallery media from client-provided files...\n');

    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI environment variable is not set. Check .env.local');
    }
    if (!fs.existsSync(SOURCE_DIR)) {
      throw new Error(`Source folder not found: ${SOURCE_DIR}`);
    }

    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB\n');

    // Import Cloudinary AFTER dotenv has populated process.env, since its
    // client is configured at module import time.
    const { default: cloudinary, CLOUDINARY_FOLDERS, getVideoPosterUrl } = await import(
      '../src/lib/cloudinary/config'
    );

    await GalleryMedia.deleteMany({});
    console.log('🧹 Cleared existing gallery media\n');

    const allFiles = fs
      .readdirSync(SOURCE_DIR)
      .filter((f) => !EXCLUDED_FILES.has(f))
      .filter((f) => IMAGE_EXTS.has(extname(f).toLowerCase()) || VIDEO_EXTS.has(extname(f).toLowerCase()))
      .sort();

    // Skip byte-identical duplicates (WhatsApp sometimes re-saves the same
    // media with a " (1)" suffix in the filename).
    const seenSizes = new Set<number>();
    const files = allFiles.filter((f) => {
      const size = fs.statSync(join(SOURCE_DIR, f)).size;
      if (seenSizes.has(size)) {
        console.log(`⏭️  Skipping likely duplicate: ${f}`);
        return false;
      }
      seenSizes.add(size);
      return true;
    });

    let order = 0;
    let heroOrder = 0;
    let uploaded = 0;

    for (const filename of files) {
      const filePath = join(SOURCE_DIR, filename);
      const ext = extname(filename).toLowerCase();
      const type: 'image' | 'video' = VIDEO_EXTS.has(ext) ? 'video' : 'image';
      const title = TITLES[order % TITLES.length];

      try {
        console.log(`⬆️  Uploading ${basename(filename)} (${type})...`);

        const result = await cloudinary.uploader.upload(filePath, {
          folder: type === 'video' ? `${CLOUDINARY_FOLDERS.GALLERY}/videos` : CLOUDINARY_FOLDERS.GALLERY,
          resource_type: type,
          ...(type === 'video' ? { eager: [{ format: 'mp4', video_codec: 'h264' }] } : {}),
        });

        const showInHero = order < HERO_POOL_SIZE;

        await GalleryMedia.create({
          type,
          url: result.secure_url,
          publicId: result.public_id,
          posterUrl: type === 'video' ? getVideoPosterUrl(result.public_id) : undefined,
          width: result.width,
          height: result.height,
          title,
          caption: '',
          altText: title,
          category: 'Our Process',
          order,
          isActive: true,
          showInHero,
          heroOrder: showInHero ? heroOrder : 0,
        });

        if (showInHero) heroOrder++;
        order++;
        uploaded++;
        console.log(`   ✅ Saved as "${title}"`);
      } catch (err: any) {
        console.error(`   ❌ Failed to upload ${filename}:`, err.message || err);
      }
    }

    console.log(`\n🎉 Done — uploaded ${uploaded}/${files.length} media items.`);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

run();
