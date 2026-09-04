import mongoose, { Schema, Document } from 'mongoose';

export interface IGalleryMedia extends Document {
  type: 'image' | 'video';
  url: string; // Cloudinary secure_url
  publicId?: string; // Cloudinary public ID for deletion
  posterUrl?: string; // video poster/thumbnail (derived Cloudinary frame-grab)
  width?: number;
  height?: number;
  title: string;
  caption?: string;
  altText?: string;
  category: string;
  order: number;
  isActive: boolean;
  showInHero: boolean;
  heroOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const GalleryMediaSchema = new Schema<IGalleryMedia>(
  {
    type: {
      type: String,
      enum: ['image', 'video'],
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
    },
    posterUrl: {
      type: String,
    },
    width: {
      type: Number,
    },
    height: {
      type: Number,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    caption: {
      type: String,
      trim: true,
      default: '',
    },
    altText: {
      type: String,
      trim: true,
      default: '',
    },
    category: {
      type: String,
      trim: true,
      default: 'General',
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    showInHero: {
      type: Boolean,
      default: false,
    },
    heroOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

GalleryMediaSchema.index({ order: 1 });
GalleryMediaSchema.index({ isActive: 1 });
GalleryMediaSchema.index({ showInHero: 1, heroOrder: 1 });
GalleryMediaSchema.index({ category: 1 });

export default mongoose.models.GalleryMedia ||
  mongoose.model<IGalleryMedia>('GalleryMedia', GalleryMediaSchema);
