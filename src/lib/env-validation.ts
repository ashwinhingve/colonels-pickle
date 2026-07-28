/**
 * Environment Variable Validation
 *
 * Validates all env vars at startup without throwing errors.
 * Returns a structured report of required/optional vars and warnings.
 *
 * REQUIRED (fatal-worthy): core only
 * - MONGODB_URI
 * - NEXTAUTH_SECRET
 * - NEXTAUTH_URL
 *
 * OPTIONAL (warn only): integration groups
 * - Cashfree: CASHFREE_APP_ID, CASHFREE_SECRET_KEY
 * - Cloudinary: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
 * - Delhivery/Shiprocket: DELHIVERY_API_KEY, SHIPROCKET_EMAIL, SHIPROCKET_PASSWORD
 * - Email (SMTP): SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS/SMTP_PASSWORD
 * - SMS (Fast2SMS): FAST2SMS_API_KEY
 * - Google OAuth: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
 * - ADMIN_EMAIL
 */

export interface EnvValidationResult {
  ok: boolean;
  missingRequired: string[];
  missingOptional: Record<string, string[]>;
  warnings: string[];
}

/**
 * Validate all environment variables
 * Pure function, no throwing
 */
export function validateEnv(): EnvValidationResult {
  const result: EnvValidationResult = {
    ok: true,
    missingRequired: [],
    missingOptional: {},
    warnings: [],
  };

  // ──────────────────────────────────────────────────────────────────────
  // REQUIRED: Core functionality
  // ──────────────────────────────────────────────────────────────────────
  const requiredCore = ['MONGODB_URI', 'NEXTAUTH_SECRET', 'NEXTAUTH_URL'];

  for (const key of requiredCore) {
    if (!process.env[key]) {
      result.missingRequired.push(key);
      result.ok = false;
    }
  }

  // ──────────────────────────────────────────────────────────────────────
  // OPTIONAL: Grouped by integration
  // ──────────────────────────────────────────────────────────────────────

  // Cashfree Payment Gateway
  const cashfreeKeys = ['CASHFREE_APP_ID', 'CASHFREE_SECRET_KEY'];
  const missingCashfree = cashfreeKeys.filter((k) => !process.env[k]);
  if (missingCashfree.length > 0) {
    result.missingOptional['Cashfree Payment'] = missingCashfree;
    if (missingCashfree.length === cashfreeKeys.length) {
      result.warnings.push(
        'Cashfree payment gateway not configured. Payment checkout will fail. Set CASHFREE_APP_ID and CASHFREE_SECRET_KEY.'
      );
    }
  }

  // Google OAuth
  const googleKeys = ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET'];
  const missingGoogle = googleKeys.filter((k) => !process.env[k]);
  if (missingGoogle.length > 0) {
    result.missingOptional['Google OAuth'] = missingGoogle;
    if (missingGoogle.length === googleKeys.length) {
      result.warnings.push(
        'Google OAuth not configured. Google sign-in will not work.'
      );
    }
  }

  // Cloudinary Media Hosting
  const cloudinaryKeys = [
    'CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET',
  ];
  const missingCloudinary = cloudinaryKeys.filter((k) => !process.env[k]);
  if (missingCloudinary.length > 0) {
    result.missingOptional['Cloudinary Media'] = missingCloudinary;
    if (missingCloudinary.length === cloudinaryKeys.length) {
      result.warnings.push(
        'Cloudinary not configured. Product images will not upload. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET.'
      );
    }
  }

  // Email (SMTP)
  const smtpKeys = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS'];
  const missingSmtp = smtpKeys.filter(
    (k) => !process.env[k] && k !== 'SMTP_PASS'
  ); // SMTP_PASS can be SMTP_PASSWORD
  if (!process.env.SMTP_PASS && !process.env.SMTP_PASSWORD) {
    missingSmtp.push('SMTP_PASS or SMTP_PASSWORD');
  }
  if (missingSmtp.length > 0) {
    result.missingOptional['Email (SMTP)'] = missingSmtp;
    if (missingSmtp.length > 2) {
      result.warnings.push(
        'SMTP email not configured. Order confirmations and OTP emails will not send. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS.'
      );
    }
  }

  // Delhivery Shipping
  const delhiveryKeys = ['DELHIVERY_API_KEY', 'DELHIVERY_RETURN_PINCODE'];
  const missingDelhivery = delhiveryKeys.filter((k) => !process.env[k]);
  if (missingDelhivery.length > 0) {
    result.missingOptional['Delhivery Shipping'] = missingDelhivery;
    if (missingDelhivery.length === delhiveryKeys.length) {
      result.warnings.push(
        'Delhivery shipping not configured. Shipment creation will fail. Set DELHIVERY_API_KEY and DELHIVERY_RETURN_PINCODE.'
      );
    }
  }

  // Shiprocket Shipping (optional, can use Delhivery alone)
  const shiprocketKeys = [
    'SHIPROCKET_EMAIL',
    'SHIPROCKET_PASSWORD',
    'SHIPROCKET_PICKUP_LOCATION',
  ];
  const missingShiprocket = shiprocketKeys.filter((k) => !process.env[k]);
  if (missingShiprocket.length > 0) {
    result.missingOptional['Shiprocket Shipping'] = missingShiprocket;
  }

  // Fast2SMS SMS Notifications
  if (!process.env.FAST2SMS_API_KEY) {
    result.missingOptional['Fast2SMS SMS'] = ['FAST2SMS_API_KEY'];
    result.warnings.push(
      'Fast2SMS not configured. Order/shipment SMS notifications will not send. Set FAST2SMS_API_KEY and ADMIN_PHONE.'
    );
  }

  // Admin Email
  if (!process.env.ADMIN_EMAIL) {
    result.missingOptional['Admin Configuration'] = ['ADMIN_EMAIL'];
    result.warnings.push(
      'ADMIN_EMAIL not set. No accounts will be granted admin role. Set ADMIN_EMAIL to a valid email address.'
    );
  }

  // NextAuth URL Validation
  if (process.env.NEXTAUTH_URL) {
    if (!process.env.NEXTAUTH_URL.startsWith('http')) {
      result.warnings.push(
        'NEXTAUTH_URL should start with http:// or https://. Current: ' +
          process.env.NEXTAUTH_URL
      );
    }
  }

  // Production environment checks
  if (process.env.NODE_ENV === 'production') {
    if (!process.env.NEXTAUTH_URL?.startsWith('https://')) {
      result.warnings.push(
        'In production, NEXTAUTH_URL must use https:// for security.'
      );
    }

    if (
      process.env.NEXTAUTH_SECRET &&
      process.env.NEXTAUTH_SECRET.length < 32
    ) {
      result.warnings.push(
        'NEXTAUTH_SECRET is too short. Use at least 32 random characters (openssl rand -base64 32).'
      );
    }
  }

  return result;
}

/**
 * Format validation result for logging
 */
export function formatValidationReport(result: EnvValidationResult): string {
  const lines: string[] = [];

  lines.push('┌─────────────────────────────────────────────────────────────┐');
  lines.push('│ Environment Variable Validation Report                     │');
  lines.push('└─────────────────────────────────────────────────────────────┘');
  lines.push('');

  // Status
  if (result.ok) {
    lines.push('✔ All required environment variables are configured');
  } else {
    lines.push('✗ Missing required environment variables:');
    for (const key of result.missingRequired) {
      lines.push(`  - ${key}`);
    }
  }

  lines.push('');

  // Optional by group
  if (Object.keys(result.missingOptional).length > 0) {
    lines.push('⚠ Optional integrations not configured:');
    for (const [group, keys] of Object.entries(result.missingOptional)) {
      lines.push(`  ${group}:`);
      for (const key of keys) {
        lines.push(`    - ${key}`);
      }
    }
    lines.push('');
  }

  // Warnings
  if (result.warnings.length > 0) {
    lines.push('⚠ Warnings:');
    for (const warning of result.warnings) {
      lines.push(`  • ${warning}`);
    }
    lines.push('');
  }

  return lines.join('\n');
}
