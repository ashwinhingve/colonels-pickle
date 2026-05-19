import * as dotenv from 'dotenv'
import mongoose from 'mongoose'

dotenv.config({ path: '.env.local' })

// Slug → array of Cloudinary public_ids (first = primary)
const SLUG_IMAGE_MAP: Record<string, string[]> = {
  'aam-ka-achar':       ['colonels-pickle/products/aam-ka-achar-1', 'colonels-pickle/products/aam-ka-achar-2', 'colonels-pickle/products/aam-ka-achar-3', 'colonels-pickle/products/aam-ka-achar-4'],
  'adrak-haldi-nimbu':  ['colonels-pickle/products/adrak-haldi-nimbu-1', 'colonels-pickle/products/adrak-haldi-nimbu-2'],
  'amla-ka-achar':      ['colonels-pickle/products/amla-ka-achar-1'],
  'bharwa-lal-mirch':   ['colonels-pickle/products/bharwa-lal-mirch-1', 'colonels-pickle/products/bharwa-lal-mirch-2'],
  'chhuhara-adrak':     ['colonels-pickle/products/chhuhara-adrak-1', 'colonels-pickle/products/chhuhara-adrak-2', 'colonels-pickle/products/chhuhara-adrak-3'],
  'dry-masala-aam':     ['colonels-pickle/products/dry-masala-aam-1'],
  'organic-gulkand':    ['colonels-pickle/products/organic-gulkand-1', 'colonels-pickle/products/organic-gulkand-2', 'colonels-pickle/products/organic-gulkand-3'],
  'lasoda-achar':       ['colonels-pickle/products/lasoda-achar-1'],
  'lehsun-ka-achar':    ['colonels-pickle/products/lehsun-ka-achar-1'],
  'mixed-chatpata':     ['colonels-pickle/products/mixed-chatpata-1'],
  'nimbu-chatpata':     ['colonels-pickle/products/nimbu-chatpata-1'],
  'organic-rice-chips': ['colonels-pickle/products/organic-rice-chips-1', 'colonels-pickle/products/organic-rice-chips-2'],
  'tikhi-mirchi':       ['colonels-pickle/products/tikhi-mirchi-1'],
}

const CLOUDINARY_BASE = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`

async function linkImages() {
  await mongoose.connect(process.env.MONGODB_URI!)
  const Product = mongoose.model('Product', new mongoose.Schema({}, { strict: false }))

  let matched = 0
  let unmatched: string[] = []

  for (const [slug, publicIds] of Object.entries(SLUG_IMAGE_MAP)) {
    const product = await Product.findOne({ slug })
    if (!product) {
      console.log(`✗ Product not found in DB: ${slug}`)
      unmatched.push(slug)
      continue
    }

    // Shape matches IProductImage in src/models/Product.ts:
    // { url, publicId, width?, height?, format?, order } — index 0 = primary
    const images = publicIds.map((publicId, index) => ({
      url: `${CLOUDINARY_BASE}/q_auto,f_auto/${publicId}`,
      publicId,
      order: index,
    }))

    await Product.updateOne({ slug }, { $set: { images } })
    console.log(`✓ ${slug} → ${publicIds.length} image(s) linked`)
    matched++
  }

  console.log(`\nSummary: ${matched} products linked, ${unmatched.length} unmatched`)
  if (unmatched.length) console.log('Unmatched:', unmatched)

  await mongoose.disconnect()
}

linkImages()
