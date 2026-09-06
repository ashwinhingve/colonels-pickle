import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import mongoose from 'mongoose';
import GalleryMedia from '../src/models/GalleryMedia';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env.local') });

/**
 * ADDITIVE ONLY — uploads a curated set of royalty-free (Pexels/Pixabay, free
 * commercial-use license) ingredient/process photos to Cloudinary and inserts
 * new GalleryMedia docs flagged showInHero:true. Unlike seed-gallery-media.ts,
 * this script never deletes or touches existing GalleryMedia documents — it
 * only appends, continuing the `order`/`heroOrder` sequence after whatever is
 * already in the collection (5 real client photos as of writing).
 *
 * Usage: npx tsx scripts/add-hero-gallery-images.ts
 */

const SOURCE_DIR =
  'C:\\Users\\ashwi\\AppData\\Local\\Temp\\claude\\D--Do-Not-Open-pulse-achar-colonels-pickle\\271a9924-2530-4d2c-a488-b0a141f4dcfe\\scratchpad\\hero-images';

interface ImageSpec {
  file: string;
  title: string;
  altText: string;
}

const IMAGES: ImageSpec[] = [
  {
    file: 'hero-extra-01.jpg',
    title: 'Sun-Dried Red Chillies',
    altText: "Strands of sun-dried red chillies hanging to cure — Colonel's Pickle",
  },
  {
    file: 'hero-extra-03.jpg',
    title: 'Fresh Red Chillies Up Close',
    altText: 'Close-up of vibrant fresh red chillies, ready for pickling',
  },
  {
    file: 'hero-extra-04.jpg',
    title: 'Dried Red Chillies, Jaipur Market',
    altText: 'Rich dried red chillies from an authentic Jaipur spice market',
  },
  {
    file: 'hero-extra-05.jpg',
    title: 'Ginger & Lemon, Pickle Essentials',
    altText: 'Fresh ginger root and lemons — classic achar ingredients',
  },
  {
    file: 'hero-extra-07.jpg',
    title: 'Golden Turmeric Powder',
    altText: 'Freshly ground turmeric powder in a traditional bowl',
  },
  {
    file: 'hero-extra-08.jpg',
    title: 'Vibrant Turmeric Spice',
    altText: "A heap of bright turmeric powder, a Colonel's Pickle staple",
  },
  {
    file: 'hero-extra-10.jpg',
    title: 'Whole Spices & Masale',
    altText: 'An array of whole Indian spices — fenugreek, cumin, cardamom and more',
  },
  {
    file: 'hero-extra-11.jpg',
    title: 'Spice Market Stall',
    altText: 'Star anise, peppercorns and cardamom at an Indian spice market',
  },
  {
    file: 'hero-extra-13.jpg',
    title: 'Herbs, Salt & Whole Spices',
    altText: 'Rock salt, peppercorns and fresh herbs — natural achar ingredients',
  },
  {
    file: 'hero-extra-14.jpg',
    title: 'Fresh Mango, Cut & Ready',
    altText: 'Ripe mango sliced into cubes — the classic aam ka achar base',
  },
  {
    file: 'hero-extra-17.jpg',
    title: 'Garlic Cloves, Golden Light',
    altText: 'Fresh garlic bulb and cloves in warm evening light',
  },
  {
    file: 'hero-extra-19.jpg',
    title: 'Red Chillies & Chilli Powder',
    altText: 'Whole red chillies with chilli flakes and powder, side by side',
  },
  {
    file: 'hero-extra-20.jpg',
    title: 'Sliced Green Chillies',
    altText: 'Fresh green chillies sliced on a wooden board',
  },
  {
    file: 'hero-extra-21.jpg',
    title: 'Whole Spices, Laid Out',
    altText: 'Cumin, ginger, turmeric, cinnamon and star anise arranged for grinding',
  },
  {
    file: 'hero-extra-22.jpg',
    title: 'Fresh Harvest in a Basket',
    altText: 'A rustic basket brimming with freshly picked mangoes',
  },
];

async function run() {
  try {
    console.log('Adding curated hero images to Gallery (additive, non-destructive)...\n');

    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI environment variable is not set. Check .env.local');
    }
    if (!fs.existsSync(SOURCE_DIR)) {
      throw new Error(`Source folder not found: ${SOURCE_DIR}`);
    }

    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB\n');

    const { default: cloudinary, CLOUDINARY_FOLDERS } = await import(
      '../src/lib/cloudinary/config'
    );

    const [maxOrderDoc] = await GalleryMedia.find({}).sort({ order: -1 }).limit(1);
    const [maxHeroOrderDoc] = await GalleryMedia.find({ showInHero: true })
      .sort({ heroOrder: -1 })
      .limit(1);

    let order = (maxOrderDoc?.order ?? -1) + 1;
    let heroOrder = (maxHeroOrderDoc?.heroOrder ?? -1) + 1;

    let uploaded = 0;
    for (const img of IMAGES) {
      const filePath = join(SOURCE_DIR, img.file);
      if (!fs.existsSync(filePath)) {
        console.warn(`Skipping missing file: ${img.file}`);
        continue;
      }

      console.log(`Uploading ${img.file}...`);
      const result = await cloudinary.uploader.upload(filePath, {
        folder: CLOUDINARY_FOLDERS.GALLERY,
        resource_type: 'image',
      });

      await GalleryMedia.create({
        type: 'image',
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        title: img.title,
        caption: '',
        altText: img.altText,
        category: 'Ingredients',
        order,
        isActive: true,
        showInHero: true,
        heroOrder,
      });

      console.log(`   Saved as "${img.title}" (heroOrder ${heroOrder})`);
      order++;
      heroOrder++;
      uploaded++;
    }

    console.log(`\nDone — added ${uploaded}/${IMAGES.length} images to the hero pool.`);
  } catch (error) {
    console.error('Failed:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

run();
