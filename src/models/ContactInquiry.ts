import mongoose, { Schema } from 'mongoose';

const contactInquirySchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    city: { type: String, trim: true, default: '' },
    message: { type: String, trim: true, default: '' },
  },
  { timestamps: true }
);

const ContactInquiry =
  mongoose.models.ContactInquiry ||
  mongoose.model('ContactInquiry', contactInquirySchema);

export default ContactInquiry;
