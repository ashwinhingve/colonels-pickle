import mongoose, { Schema, Document } from 'mongoose';

export interface IAnnouncement {
  text: string;
  emoji: string;
  isActive: boolean;
}

export interface IHeroSlide {
  _id?: mongoose.Types.ObjectId;
  image: string;
  imagePublicId: string;
  title: string;
  subtitle: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  ctaSecondaryText: string;
  ctaSecondaryLink: string;
  isActive: boolean;
  order: number;
}

export interface ISiteSettings extends Document {
  _id: mongoose.Types.ObjectId;
  key: string;
  announcementBanner: {
    enabled: boolean;
    announcements: IAnnouncement[];
  };
  heroSlider: {
    slides: IHeroSlide[];
  };
  inventory?: {
    lowStockThreshold: number;
  };
  invoiceCounter?: {
    fiscalYear: string;
    lastNumber: number;
  };
  paymentSettings?: {
    accountName: string;
    bankName: string;
    branch: string;
    accountNumber: string;
    ifsc: string;
    upiId: string;
  };
  businessProfile?: {
    gstin: string;
    fssai: string;
    pan?: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
  };
  updatedAt: Date;
  createdAt: Date;
}

const SiteSettingsSchema = new Schema<ISiteSettings>(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: 'global',
    },
    announcementBanner: {
      enabled: {
        type: Boolean,
        default: true,
      },
      announcements: [
        {
          text: { type: String, required: true },
          emoji: { type: String, default: '' },
          isActive: { type: Boolean, default: true },
        },
      ],
    },
    heroSlider: {
      slides: [
        {
          image: { type: String, default: '' },
          imagePublicId: { type: String, default: '' },
          title: { type: String, default: '' },
          subtitle: { type: String, default: '' },
          description: { type: String, default: '' },
          ctaText: { type: String, default: '' },
          ctaLink: { type: String, default: '/products' },
          ctaSecondaryText: { type: String, default: '' },
          ctaSecondaryLink: { type: String, default: '/products' },
          isActive: { type: Boolean, default: true },
          order: { type: Number, default: 0 },
        },
      ],
    },
    inventory: {
      lowStockThreshold: {
        type: Number,
        default: 10,
        min: 0,
      },
    },
    invoiceCounter: {
      fiscalYear: {
        type: String,
      },
      lastNumber: {
        type: Number,
      },
    },
    paymentSettings: {
      accountName: {
        type: String,
        default: 'RIDHWIKA AGRO ORGANICS',
      },
      bankName: {
        type: String,
        default: 'State Bank of India',
      },
      branch: {
        type: String,
        default: 'SBI Shivgyan Enclave, Nirman Nagar, Jaipur, Rajasthan – 302019',
      },
      accountNumber: {
        type: String,
        default: '42855337064',
      },
      ifsc: {
        type: String,
        default: 'SBIN0032054',
      },
      upiId: {
        type: String,
        default: '9717243306@ptsbi',
      },
    },
    businessProfile: {
      gstin: {
        type: String,
        default: '08BFKPD8446R1ZM',
      },
      fssai: {
        type: String,
        default: '12226026000060',
      },
      pan: {
        type: String,
      },
      addressLine1: {
        type: String,
        default: 'B-6/374, Vaishali Nagar',
      },
      addressLine2: {
        type: String,
      },
      city: {
        type: String,
        default: 'Jaipur',
      },
      state: {
        type: String,
        default: 'Rajasthan',
      },
      postalCode: {
        type: String,
        default: '302020',
      },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.SiteSettings ||
  mongoose.model<ISiteSettings>('SiteSettings', SiteSettingsSchema);
