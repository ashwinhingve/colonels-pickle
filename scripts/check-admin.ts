import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import mongoose from 'mongoose';

// Load environment variables from .env.local
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env.local') });

/**
 * Read-only admin-access check.
 *
 * Prints, for a given email: whether a user document exists, its stored `role`,
 * and whether the email is in the ADMIN_EMAIL whitelist (the value that decides
 * the role on the *next* sign-in). Makes NO writes.
 *
 * Usage:
 *   npx tsx scripts/check-admin.ts                       # defaults to colonelspickle.ridhwika@gmail.com
 *   npx tsx scripts/check-admin.ts someone@example.com   # check any email
 *
 * NOTE: this reads MONGODB_URI + ADMIN_EMAIL from .env.local (local dev). To reflect
 * production, the whitelist must also be set in Vercel and the account re-signed-in there.
 */
async function checkAdmin() {
  const email = (process.argv[2] || 'colonelspickle.ridhwika@gmail.com').trim().toLowerCase();

  const whitelist = (process.env.ADMIN_EMAIL || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  console.log(`\nChecking admin access for: ${email}\n`);
  console.log(`ADMIN_EMAIL whitelist (${whitelist.length}):`);
  whitelist.forEach((e) => console.log(`  - ${e}`));
  const inWhitelist = whitelist.includes(email);
  console.log(`\nIn whitelist: ${inWhitelist ? 'YES ✓' : 'NO ✗'}`);

  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error('MONGODB_URI environment variable is not set');
  }

  await mongoose.connect(mongoUri);
  console.log('\nConnected to MongoDB');

  // Raw collection — read-only, bypasses Mongoose schema registration.
  const db = mongoose.connection.db!;
  const user = await db.collection('users').findOne({ email });

  if (!user) {
    console.log(`\nNo user document found for ${email}.`);
    console.log(
      inWhitelist
        ? '→ On first Google/email sign-in it will be created as ADMIN.'
        : '→ Add the email to ADMIN_EMAIL first, then sign in.'
    );
  } else {
    console.log(`\nUser found: role = "${user.role}", provider = "${user.provider ?? 'n/a'}"`);
    if (inWhitelist && user.role !== 'admin') {
      console.log('→ Whitelisted but not yet admin. A fresh sign-out + sign-in will promote it.');
    } else if (!inWhitelist && user.role === 'admin') {
      console.log('→ Currently admin but NOT whitelisted — next sign-in will DEMOTE it to client.');
    } else if (inWhitelist && user.role === 'admin') {
      console.log('→ Admin access is correctly set. ✓');
    } else {
      console.log('→ Client account, not whitelisted (as expected).');
    }
  }

  await mongoose.disconnect();
  console.log('\nDone.\n');
}

checkAdmin().catch((err) => {
  console.error('check-admin failed:', err);
  process.exit(1);
});
