import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import mongoose from 'mongoose';
import User from '../src/models/User';
import Address from '../src/models/Address';
import Order from '../src/models/Order';
import OrderItem from '../src/models/OrderItem';
import Product from '../src/models/Product';
import StockMovement from '../src/models/StockMovement';
import AdminActivity from '../src/models/AdminActivity';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env.local') });

async function main() {
  await mongoose.connect(process.env.MONGODB_URI!);

  const users = await User.find({ name: /^ZZTEST/ });
  const userIds = users.map((u) => u._id);
  console.log('Found ZZTEST users:', users.map((u) => `${u.name} (${u.phoneNumber})`));

  const orders = await Order.find({ userId: { $in: userIds } });
  console.log('Found ZZTEST orders:', orders.map((o) => `${o.orderNumber} / ${o.invoiceNumber}`));

  for (const order of orders) {
    const items = await OrderItem.find({ orderId: order._id });
    for (const item of items) {
      if (item.variantId) {
        await Product.findOneAndUpdate(
          { _id: item.productId, 'variants.id': item.variantId },
          { $inc: { 'variants.$.stock': item.quantity, stock: item.quantity } }
        );
      } else {
        await Product.findOneAndUpdate({ _id: item.productId }, { $inc: { stock: item.quantity } });
      }
      console.log('Restored stock for', item.productName, 'qty', item.quantity);
    }
    await OrderItem.deleteMany({ orderId: order._id });
    await StockMovement.deleteMany({ reference: order.orderNumber });
    await AdminActivity.deleteMany({ entityId: order._id });
    await Order.deleteOne({ _id: order._id });
  }

  await Address.deleteMany({ userId: { $in: userIds } });
  await User.deleteMany({ _id: { $in: userIds } });

  console.log('Cleanup complete.');
  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
