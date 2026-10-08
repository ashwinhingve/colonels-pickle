import * as dotenv from 'dotenv'
import * as fs from 'fs'
import mongoose from 'mongoose'

dotenv.config({ path: '.env.local' })

const CLOUDINARY_BASE = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`

// slug → ordered list of NEW public_ids (first = primary).
// These are PREPENDED to the front of product.images[] so they lead everywhere
// (ProductCard.tsx reads images[0]/[1] by array position). Old images are kept,
// shifted to later positions, and `order` is renumbered 0..n to match array order.
const PREPEND_MAP: Record<string, string[]> = {
  'lehsun-ka-achar':     ['colonels-pickle/products/lehsun-ka-achar-2026-1', 'colonels-pickle/products/lehsun-ka-achar-2026-2'],
  'bharwa-bhajiya':      ['colonels-pickle/products/bharwa-bhajiya-2026-1', 'colonels-pickle/products/bharwa-bhajiya-2026-2'],
  'bharwa-lal-mirch':    ['colonels-pickle/products/bharwa-lal-mirch-2026-1', 'colonels-pickle/products/bharwa-lal-mirch-2026-2'],
  'chhuhara-adrak':      ['colonels-pickle/products/chhuhara-adrak-2026-1', 'colonels-pickle/products/chhuhara-adrak-2026-2'],
  'nimbu-chatpata':      ['colonels-pickle/products/nimbu-chatpata-2026-1', 'colonels-pickle/products/nimbu-chatpata-2026-2'],
  'dry-masala-aam':      ['colonels-pickle/products/dry-masala-aam-2026-1', 'colonels-pickle/products/dry-masala-aam-2026-2'],
  'organic-gulkand':     ['colonels-pickle/products/organic-gulkand-2026-1', 'colonels-pickle/products/organic-gulkand-2026-2', 'colonels-pickle/products/organic-gulkand-2026-3'],
  'tikhi-mirchi':        ['colonels-pickle/products/tikhi-mirchi-2026-1', 'colonels-pickle/products/tikhi-mirchi-2026-2'],
  'kair-ka-achar':       ['colonels-pickle/products/kair-ka-achar-2026-1', 'colonels-pickle/products/kair-ka-achar-2026-2'],
  'khatta-meetha-nimbu': ['colonels-pickle/products/khatta-meetha-nimbu-2026-1', 'colonels-pickle/products/khatta-meetha-nimbu-2026-2'],
  'mixed-chatpata':      ['colonels-pickle/products/mixed-chatpata-2026-1', 'colonels-pickle/products/mixed-chatpata-2026-2'],
}

// Products to also flip to publicly visible (approved: Kair was isActive:false).
const ACTIVATE_SLUGS = new Set(['kair-ka-achar'])

interface UploadRecord {
  file: string
  publicId: string
  url: string
  width: number
  height: number
  format: string
}

async function run() {
  const resultsPath = 'scripts/new-upload-results.json'
  if (!fs.existsSync(resultsPath)) {
    throw new Error(`${resultsPath} not found — run scripts/upload-new-product-images.ts first.`)
  }
  const uploads: Record<string, UploadRecord> = JSON.parse(fs.readFileSync(resultsPath, 'utf8'))

  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI missing — is .env.local loaded?')
  await mongoose.connect(process.env.MONGODB_URI)
  const Product = mongoose.model('Product', new mongoose.Schema({}, { strict: false }))

  const slugs = Object.keys(PREPEND_MAP)

  // ── Backup current images[] + isActive for every touched product (rollback safety) ──
  const backup: Record<string, unknown> = {}
  for (const slug of slugs) {
    const p = await Product.findOne({ slug }).lean<{ images?: unknown; isActive?: boolean }>()
    backup[slug] = p ? { images: p.images ?? [], isActive: p.isActive } : null
  }
  const ts = new Date().toISOString().replace(/[:.]/g, '-')
  const backupPath = `scripts/backup-product-images-${ts}.json`
  fs.writeFileSync(backupPath, JSON.stringify(backup, null, 2))
  console.log(`Backup written → ${backupPath}\n`)

  let matched = 0
  const missing: string[] = []

  for (const [slug, publicIds] of Object.entries(PREPEND_MAP)) {
    const product = await Product.findOne({ slug })
    if (!product) {
      console.log(`✗ Product not found: ${slug}`)
      missing.push(slug)
      continue
    }

    // Build the new (prepended) image entries from the Cloudinary upload results.
    const newEntries = publicIds.map((publicId) => {
      const rec = uploads[publicId]
      if (!rec) throw new Error(`No upload record for ${publicId} — did the upload step succeed?`)
      return {
        url: `${CLOUDINARY_BASE}/q_auto,f_auto/${publicId}`,
        publicId,
        ...(rec.width != null ? { width: rec.width } : {}),
        ...(rec.height != null ? { height: rec.height } : {}),
        ...(rec.format ? { format: rec.format } : {}),
      }
    })

    // Keep existing images, but drop any prior copies of these new public_ids
    // so re-running the script doesn't create duplicates (idempotent).
    const newIds = new Set(publicIds)
    const plain = product.toObject() as { images?: Array<Record<string, unknown>> }
    const existing = (Array.isArray(plain.images) ? plain.images : [])
      .filter((img) => typeof img?.publicId === 'string' && !newIds.has(img.publicId as string))
      .map((img) => ({
        url: img.url,
        publicId: img.publicId,
        ...(img.width != null ? { width: img.width } : {}),
        ...(img.height != null ? { height: img.height } : {}),
        ...(img.format ? { format: img.format } : {}),
      }))

    // New first, old after; renumber order to match array position.
    const merged = [...newEntries, ...existing].map((img, index) => ({ ...img, order: index }))

    const update: Record<string, unknown> = { images: merged }
    if (ACTIVATE_SLUGS.has(slug)) update.isActive = true

    await Product.updateOne({ slug }, { $set: update })
    console.log(
      `✓ ${slug} → ${newEntries.length} new prepended, ${merged.length} total` +
        (ACTIVATE_SLUGS.has(slug) ? ' (activated)' : '')
    )
    matched++
  }

  console.log(`\nSummary: ${matched}/${slugs.length} products updated.`)
  if (missing.length) console.log('Missing slugs:', missing)

  await mongoose.disconnect()
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
