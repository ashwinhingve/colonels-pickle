import { v2 as cloudinary } from 'cloudinary'
import * as dotenv from 'dotenv'
import * as fs from 'fs'
import * as path from 'path'

dotenv.config({ path: '.env.local' })

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Folder of fresh 2026 jar shots (23 files).
const IMAGE_DIR = 'C:/Users/ashwi/Downloads/product'

// Exact source filename → Cloudinary public_id.
// Keys use straight apostrophes; matching is apostrophe/whitespace-insensitive (see norm()),
// so curly-vs-straight apostrophes in the real filenames won't break the lookup.
// New public_ids use a `-2026-N` suffix so they DON'T overwrite existing assets
// (`<slug>-1/-2/...`), which lets us keep the old images and just prepend these.
const FILE_MAP: Record<string, string> = {
  'Authentic Garlic Pickle Jar Product Shot.png': 'colonels-pickle/products/lehsun-ka-achar-2026-1',
  'Lehsun Achaar Jar on Rustic Surface.png':      'colonels-pickle/products/lehsun-ka-achar-2026-2',
  'Bharwa Bhajiya Pickle Jar.png':                'colonels-pickle/products/bharwa-bhajiya-2026-1',
  'Bharwa Bhajiya Pickle Jar Label.png':          'colonels-pickle/products/bharwa-bhajiya-2026-2',
  'Bharwa Lal Achar Jar Product Photo.png':       'colonels-pickle/products/bharwa-lal-mirch-2026-1',
  'Homemade Bharwa Lal Achar Jar.png':            'colonels-pickle/products/bharwa-lal-mirch-2026-2',
  'Chhuhara Adrak Pickle Jar Product Photo.png':  'colonels-pickle/products/chhuhara-adrak-2026-1',
  "Colonel's Chhuhara Adrak Pickle Jar.png":      'colonels-pickle/products/chhuhara-adrak-2026-2',
  'Homemade Nimbu Chatpata Pickle Jar.png':       'colonels-pickle/products/nimbu-chatpata-2026-1',
  "Cotonet's Nimbu Chatpata Pickle Jar.png":      'colonels-pickle/products/nimbu-chatpata-2026-2',
  'Dry Masala Aam Pickle Jar.png':                'colonels-pickle/products/dry-masala-aam-2026-1',
  'Maa Ka Pyaar Dry Masala Aam Pickle Jar.png':   'colonels-pickle/products/dry-masala-aam-2026-2',
  'Homemade Organic Gulkand Jar.png':             'colonels-pickle/products/organic-gulkand-2026-1',
  'Organic Gulkand Glass Jar.png':                'colonels-pickle/products/organic-gulkand-2026-2',
  'Organic Gulkand Jar with Rose Petals.png':     'colonels-pickle/products/organic-gulkand-2026-3',
  'Homemade Teekhi Mirchi Pickle Jar.png':        'colonels-pickle/products/tikhi-mirchi-2026-1',
  'Homemade Teekhi Mirchi Pickle Jar (1).png':    'colonels-pickle/products/tikhi-mirchi-2026-2',
  'Kair Ka Achaar Jar Product Shot.png':          'colonels-pickle/products/kair-ka-achar-2026-1',
  'Kair Pickle Jar Product Shot.png':             'colonels-pickle/products/kair-ka-achar-2026-2',
  'Khatta Meetha Nimbu Pickle Jar.png':           'colonels-pickle/products/khatta-meetha-nimbu-2026-1',
  'Khatta Meetha Nimbu Pickle Jar (1).png':       'colonels-pickle/products/khatta-meetha-nimbu-2026-2',
  'Mixed Chatpata Pickle Jar.png':                'colonels-pickle/products/mixed-chatpata-2026-1',
  'Mixed Chatpata Pickle Jar (1).png':            'colonels-pickle/products/mixed-chatpata-2026-2',
}

// Normalise filenames so curly/straight apostrophes & spacing don't block a match.
const norm = (s: string) =>
  s.normalize('NFC').replace(/[‘’ʼ′]/g, "'").replace(/\s+/g, ' ').trim().toLowerCase()

const NORM_MAP: Record<string, string> = {}
for (const [name, pid] of Object.entries(FILE_MAP)) NORM_MAP[norm(name)] = pid

interface UploadRecord {
  file: string
  publicId: string
  url: string
  width: number
  height: number
  format: string
}

async function uploadAll() {
  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    throw new Error('CLOUDINARY_CLOUD_NAME missing — is .env.local present and loaded?')
  }
  if (!fs.existsSync(IMAGE_DIR)) {
    throw new Error(`Image folder not found: ${IMAGE_DIR}`)
  }

  const files = fs.readdirSync(IMAGE_DIR).filter((f) => /\.(png|jpe?g|webp)$/i.test(f))
  const results: Record<string, UploadRecord> = {}
  const unmatched: string[] = []
  let i = 0

  for (const file of files) {
    const publicId = NORM_MAP[norm(file)]
    if (!publicId) {
      unmatched.push(file)
      console.log(`⚠ Skipping unmapped file: ${file}`)
      continue
    }
    i++
    const filePath = path.join(IMAGE_DIR, file)
    console.log(`Uploading ${i}: ${file} → ${publicId}`)
    try {
      const r = await cloudinary.uploader.upload(filePath, {
        public_id: publicId,
        overwrite: true,
        resource_type: 'image',
        transformation: [{ quality: 'auto', fetch_format: 'auto' }],
      })
      results[publicId] = {
        file,
        publicId,
        url: r.secure_url,
        width: r.width,
        height: r.height,
        format: r.format,
      }
      console.log(`  ✓ ${r.secure_url}`)
    } catch (err) {
      console.error(`  ✗ Failed: ${file}`, err)
    }
  }

  fs.writeFileSync('scripts/new-upload-results.json', JSON.stringify(results, null, 2))

  const expected = Object.keys(FILE_MAP).length
  const got = Object.keys(results).length
  console.log(`\nDone. ${got}/${expected} uploaded → scripts/new-upload-results.json`)
  if (unmatched.length) console.log(`Unmatched files (${unmatched.length}):`, unmatched)
  if (got !== expected) {
    console.warn(`\n⚠ Expected ${expected} uploads, got ${got}. Fix before running the link step.`)
    process.exitCode = 1
  }
}

uploadAll()
