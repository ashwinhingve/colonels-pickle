/**
 * Next.js Instrumentation Hook
 *
 * Runs once at server startup (both dev and production).
 * Validates environment variables and logs a clear summary.
 *
 * Next 16 enables instrumentation.ts by default. This file is NOT
 * bundled with the client and runs only on the server.
 *
 * Safe-by-design: never throws, only logs warnings/errors.
 * In production, missing REQUIRED vars are logged as prominent errors
 * but do NOT prevent server startup (only app initialization would fail).
 */

export async function register() {
  // Guard: only run on Node.js runtime (not edge runtime)
  if (process.env.NEXT_RUNTIME === 'edge') {
    return;
  } 

  // Dynamic import to avoid bundling env-validation in client
  const { validateEnv, formatValidationReport } = await import(
    '@/lib/env-validation'
  );

  try {
    const result = validateEnv();
    const report = formatValidationReport(result);

    // Always log the validation report
    console.log('\n' + report);

    // In production, log prominent error if required vars are missing
    if (process.env.NODE_ENV === 'production' && !result.ok) {
      console.error(
        '\n❌ CRITICAL: Required environment variables are missing in production.'
      );
      console.error(
        'This may cause runtime errors when those features are accessed.'
      );
      console.error('Missing required vars:');
      for (const key of result.missingRequired) {
        console.error(`  - ${key}`);
      }
      console.error(
        '\nEnsure all required vars are set before deploying to production.\n'
      );
    }

    // Log warnings
    if (result.warnings.length > 0) {
      console.warn('\nStartup warnings detected. Some features may not work.');
      console.warn(
        'Refer to .env.local.example for required configuration.\n'
      );
    }
  } catch (error) {
    // Should never happen, but log if it does
    console.error('Error during env validation:', error);
    console.error(
      'Falling back to manual environment setup. Check .env.local.example.'
    );
  }
}
