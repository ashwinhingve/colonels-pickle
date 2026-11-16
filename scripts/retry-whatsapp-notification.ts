import dotenv from 'dotenv';
dotenv.config({ path: '.env.local', quiet: true });
async function main() {
  const orderId = process.argv.find(arg => arg.startsWith('--order-id='))?.split('=')[1];
  if (!orderId || !/^[a-f0-9]{24}$/i.test(orderId) || !process.argv.includes('--retry')) {
    throw new Error('Usage: npx tsx scripts/retry-whatsapp-notification.ts --order-id=ORDER_MONGODB_ID --retry (may duplicate an uncertain delivery)');
  }
  // Import only after environment is loaded.
  const { default: connectDB } = await import('../src/lib/mongodb/connection');
  const { default: Job } = await import('../src/models/WhatsAppNotification');
  const { processWhatsAppJobs } = await import('../src/lib/notifications/whatsappJobs');
  await connectDB();
  const result = await Job.updateOne({ orderId, status: 'failed' }, {
    $set: { status: 'pending', attempts: 0, nextAttemptAt: new Date() },
    $unset: { messageId: 1, errorCode: 1, leaseUntil: 1, claimToken: 1, statusTimestamp: 1 },
  });
  if (!result.modifiedCount) throw new Error('No failed alert found for this order');
  console.log(await processWhatsAppJobs(orderId));
}
main().catch((error: Error) => { console.error(error.message); process.exitCode = 1; }).finally(async () => {
  const { default: mongoose } = await import('mongoose');
  await mongoose.disconnect();
});
