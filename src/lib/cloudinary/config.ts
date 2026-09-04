import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Folder structure for uploads
export const CLOUDINARY_FOLDERS = {
  PRODUCTS: 'cp/products',
  CATEGORIES: 'cp/categories',
  USERS: 'cp/users',
  HERO_SLIDES: 'cp/hero-slides',
  TEAM: 'cp/team',
  REVIEWS: 'cp/reviews',
  GALLERY: 'cp/gallery',
};

// Upload configuration
export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_FORMATS: ['jpg', 'jpeg', 'png', 'webp'],
  MAX_IMAGES_PER_PRODUCT: 4,
};

// Image transformation presets
export const IMAGE_TRANSFORMATIONS = {
  PRODUCT_MAIN: {
    width: 1200,
    height: 1200,
    crop: 'limit',
    quality: 'auto',
    fetch_format: 'auto',
  },
  PRODUCT_THUMBNAIL: {
    width: 300,
    height: 300,
    crop: 'fill',
    quality: 'auto',
    fetch_format: 'auto',
  },
  PRODUCT_CARD: {
    width: 600,
    height: 600,
    crop: 'fill',
    quality: 'auto',
    fetch_format: 'auto',
  },
};

// Derive a poster/thumbnail frame from a Cloudinary video without a separate upload
export function getVideoPosterUrl(publicId: string): string {
  return cloudinary.url(publicId, {
    resource_type: 'video',
    format: 'jpg',
    start_offset: '1',
    width: 800,
    height: 800,
    crop: 'fill',
    quality: 'auto',
    secure: true,
  });
}

export default cloudinary;
