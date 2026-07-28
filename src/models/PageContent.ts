import mongoose, { Schema, Document } from 'mongoose';

export interface IPageContent extends Document {
  _id: mongoose.Types.ObjectId;
  slug: 'privacy-policy' | 'terms-and-conditions' | 'refund-policy' | 'shipping-policy';
  title: string;
  subtitle: string;
  bodyHtml: string;
  lastUpdated: string;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PageContentSchema = new Schema<IPageContent>(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      enum: ['privacy-policy', 'terms-and-conditions', 'refund-policy', 'shipping-policy'],
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    subtitle: {
      type: String,
      default: '',
      trim: true,
    },
    bodyHtml: {
      type: String,
      default: '',
    },
    lastUpdated: {
      type: String,
      default: '',
    },
    isPublished: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.PageContent ||
  mongoose.model<IPageContent>('PageContent', PageContentSchema);
