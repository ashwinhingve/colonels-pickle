import { randomUUID } from 'node:crypto';
import connectDB from '@/lib/mongodb/connection';
import Job from '@/models/WhatsAppNotification';
import Order from '@/models/Order';
import OrderItem from '@/models/OrderItem';
import { sendWhatsAppOrder, WhatsAppError, type WhatsAppOrder } from './whatsapp';

// Index creation must finish before concurrent upserts can rely on uniqueness.
async function ready() { await connectDB(); await Job.init(); }

export async function enqueueWhatsAppOrder(orderId: string, payload: WhatsAppOrder) {
  await ready();
  const start = new Date(process.env.WHATSAPP_START_AT || '');
  if (!Number.isFinite(start.getTime())) throw new Error('WHATSAPP_START_AT must be configured');
  const eligible = await Order.exists({ _id: orderId, createdAt: { $gte: start },
    orderStatus: { $in: ['confirmed', 'processing', 'shipped', 'delivered'] },
    $or: [{ paymentStatus: 'paid' }, { paymentMethod: 'cod' }] });
  if (!eligible) return;
  try {
    await Job.updateOne({ orderId, kind: 'new_order' }, { $setOnInsert: { payload } }, { upsert: true });
  } catch (error) {
    if ((error as { code?: number }).code !== 11000) throw error;
  }
}

export async function processWhatsAppJobs(orderId?: string) {
  await ready();
  const deadline = Date.now() + 20000;
  let processed = 0;
  while (processed < (orderId ? 1 : 5) && Date.now() < deadline) {
    const now = new Date();
    const claimToken = randomUUID();
    const job = await Job.findOneAndUpdate({
      ...(orderId ? { orderId } : {}), attempts: { $lt: 5 },
      $or: [ { status: 'pending', nextAttemptAt: { $lte: now } }, { status: 'sending', leaseUntil: { $lte: now } } ],
    }, { $set: { status: 'sending', leaseUntil: new Date(Date.now() + 60000), claimToken }, $inc: { attempts: 1 } },
    { new: true, sort: { nextAttemptAt: 1 } });
    if (!job) break;
    processed++;
    try {
      const messageId = await sendWhatsAppOrder(job.payload, String(job._id));
      await Job.updateOne({ _id: job._id, claimToken, status: 'sending' }, {
        $set: { status: 'accepted', messageId }, $unset: { leaseUntil: 1, claimToken: 1, errorCode: 1 },
      });
    } catch (error) {
      const failure = error instanceof WhatsAppError ? error : new WhatsAppError('internal_send_error', true);
      const retry = failure.retryable && job.attempts < 5;
      await Job.updateOne({ _id: job._id, claimToken, status: 'sending' }, {
        $set: { status: retry ? 'pending' : 'failed', errorCode: failure.code,
          nextAttemptAt: new Date(Date.now() + Math.min(60, 5 * 2 ** (job.attempts - 1)) * 60000) },
        $unset: { leaseUntil: 1, claimToken: 1 },
      });
      console.error('WhatsApp order alert failed', { jobId: String(job._id), code: failure.code });
    }
  }
  // Last-attempt crashes must not leave permanently leased jobs.
  await Job.updateMany({ status: 'sending', leaseUntil: { $lte: new Date() }, attempts: { $gte: 5 } },
    { $set: { status: 'failed', errorCode: 'lease_expired_delivery_uncertain' }, $unset: { leaseUntil: 1, claimToken: 1 } });
  return { processed, failed: await Job.countDocuments({ status: 'failed' }), pending: await Job.countDocuments({ status: 'pending' }) };
}

/** Recover a confirmation saved just before a request crashed, with an explicit rollout boundary. */
export async function reconcileWhatsAppOrders() {
  const start = new Date(process.env.WHATSAPP_START_AT || '');
  if (!Number.isFinite(start.getTime())) throw new Error('WHATSAPP_START_AT must be an ISO rollout timestamp');
  await ready();
  const orders = await Order.aggregate([
    { $match: { createdAt: { $gte: start }, orderStatus: { $in: ['confirmed', 'processing', 'shipped', 'delivered'] },
      $or: [{ paymentStatus: 'paid' }, { paymentMethod: 'cod' }] } },
    { $lookup: { from: Job.collection.name, localField: '_id', foreignField: 'orderId', as: 'alerts' } },
    { $match: { 'alerts.0': { $exists: false } } }, { $sort: { createdAt: 1 } }, { $limit: 10 },
  ]);
  for (const order of orders) {
    const populated = await Order.findById(order._id).populate('userId');
    const items = await OrderItem.find({ orderId: order._id });
    await enqueueWhatsAppOrder(String(order._id), { orderNumber: order.orderNumber,
      customerName: populated?.userId?.name || 'Customer', totalAmount: order.totalAmount,
      itemCount: items.reduce((sum, item) => sum + item.quantity, 0), paymentMethod: order.paymentMethod });
  }
  return orders.length;
}
