import mongoose, { Schema } from 'mongoose';

const schema = new Schema({
  orderId: { type: Schema.Types.ObjectId, required: true },
  kind: { type: String, default: 'new_order' },
  payload: { orderNumber: String, customerName: String, totalAmount: Number, itemCount: Number, paymentMethod: String },
  status: { type: String, default: 'pending', enum: ['pending', 'sending', 'accepted', 'sent', 'delivered', 'read', 'failed'] },
  attempts: { type: Number, default: 0 },
  nextAttemptAt: { type: Date, default: Date.now },
  leaseUntil: Date,
  claimToken: String,
  messageId: String,
  errorCode: String,
  statusTimestamp: Number,
}, { timestamps: true });
schema.index({ orderId: 1, kind: 1 }, { unique: true });
schema.index({ status: 1, nextAttemptAt: 1 });
schema.index({ messageId: 1 }, { sparse: true });
export default mongoose.models.WhatsAppNotification || mongoose.model('WhatsAppNotification', schema);
