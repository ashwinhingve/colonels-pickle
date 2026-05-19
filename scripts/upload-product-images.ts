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

const IMAGE_DIR = '/mnt/c/Users/ashwi/Downloads/achar/product_Image'

// Explicit filename → Cloudinary public_id mapping
const FILE_MAP: Record<string, string> = {
  'Aam_Ka_Achar_Ja.jpeg':                    'colonels-pickle/products/aam-ka-achar-1',
  'Aam_Ka_Achar_Jar.jpeg':                   'colonels-pickle/products/aam-ka-achar-2',
  'Adrak_Haldi_Nimbu_Achar_Jar.jpeg':        'colonels-pickle/products/adrak-haldi-nimbu-1',
  'Adrak_Haldi_Nimbu_Achar.jpeg':            'colonels-pickle/products/adrak-haldi-nimbu-2',
  'Amla_Ka_Achar.jpeg':                      'colonels-pickle/products/amla-ka-achar-1',
  'Bharwa_Lal_Achar_Jar.jpeg':               'colonels-pickle/products/bharwa-lal-mirch-1',
  'Bharwa_Lal_Achar.jpeg':                   'colonels-pickle/products/bharwa-lal-mirch-2',
  'Chhuhara_Adrak_Achar_j.jpeg':             'colonels-pickle/products/chhuhara-adrak-1',
  'Chhuhara_Adrak_Achar_Jar.jpeg':           'colonels-pickle/products/chhuhara-adrak-2',
  'Chhuhara_Adrak_Achar_Poster.jpeg':        'colonels-pickle/products/chhuhara-adrak-3',
  'Dry_Masala_Aam_Achar_Jar.jpeg':           'colonels-pickle/products/dry-masala-aam-1',
  'Homemade_Organic_Gulk.jpeg':              'colonels-pickle/products/organic-gulkand-1',
  'Homemade_Organic_Gulkand_Styled.jpeg':    'colonels-pickle/products/organic-gulkand-2',
  'Homemade_Organic_Gulkand.jpeg':           'colonels-pickle/products/organic-gulkand-3',
  'Kaccha_Mango_Pickle_Jar.jpeg':            'colonels-pickle/products/aam-ka-achar-3',
  'Kaccha_Mango_Pickle.jpeg':                'colonels-pickle/products/aam-ka-achar-4',
  'Kair_Pickle_Jar.jpeg':                    'colonels-pickle/products/lasoda-achar-1',
  'Lehsun_Ka_Achar_Jar.jpeg':                'colonels-pickle/products/lehsun-ka-achar-1',
  'Mixed_Chatpata_Achar_Jar.jpeg':           'colonels-pickle/products/mixed-chatpata-1',
  'Nimbu_Chatpata_Achar_Jar.jpeg':           'colonels-pickle/products/nimbu-chatpata-1',
  'Organic_Rice_Chips_Achari_Mango.jpeg':    'colonels-pickle/products/organic-rice-chips-1',
  'Organic_Rice_Chips_Cream_And_Onion.jpeg': 'colonels-pickle/products/organic-rice-chips-2',
  'Tikhi_Mirchi_Achar_Poster.jpeg':          'colonels-pickle/products/tikhi-mirchi-1',
}

async function uploadAll() {
  const files = fs.readdirSync(IMAGE_DIR).filter(f => f.endsWith('.jpeg') || f.endsWith('.jpg') || f.endsWith('.png'))

  const results: Record<string, string> = {}
  let i = 0

  for (const file of files) {
    const publicId = FILE_MAP[file]
    if (!publicId) {
      console.log(`⚠ Skipping unmapped file: ${file}`)
      continue
    }

    i++
    const filePath = path.join(IMAGE_DIR, file)
    console.log(`Uploading ${i}/${files.length}: ${file}...`)

    try {
      const result = await cloudinary.uploader.upload(filePath, {
        public_id: publicId,
        overwrite: true,
        resource_type: 'image',
        transformation: [{ quality: 'auto', fetch_format: 'auto' }],
      })
      results[file] = result.secure_url
      console.log(`  ✓ ${result.secure_url}`)
    } catch (err) {
      console.error(`  ✗ Failed: ${file}`, err)
    }
  }

  fs.writeFileSync('scripts/upload-results.json', JSON.stringify(results, null, 2))
  console.log(`\nDone. ${Object.keys(results).length} images uploaded.`)
  console.log('Results saved to scripts/upload-results.json')
}

uploadAll()
