import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import Otp from '../src/models/Otp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env.local') });

const EMAIL = 'ashwin.hingave123@gmail.com';
const CODE = '482913';

async function main() {
  await mongoose.connect(process.env.MONGODB_URI!);
  await Otp.deleteMany({ email: EMAIL });
  const hashed = await bcrypt.hash(CODE, 10);
  await Otp.create({
    email: EMAIL,
    otp: hashed,
    expiresAt: new Date(Date.now() + 15 * 60 * 1000),
    attempts: 0,
  });
  console.log(`OTP seeded for ${EMAIL}: ${CODE}`);
  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
