/**
 * GET /api/health
 *
 * Health check endpoint for monitoring and deployment verification.
 * Reports DB connectivity and environment configuration status.
 * Never throws — catches all errors and returns appropriate status.
 *
 * Usage:
 * - Monitoring/alerting: poll regularly to detect outages
 * - Post-deploy: verify DB connection and env vars are correct
 * - Load balancer: use as liveness/readiness probe
 */

import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb/connection';
import { validateEnv } from '@/lib/env-validation';

export const dynamic = 'force-dynamic'; // Always fresh, never cached

interface HealthResponse {
  status: 'ok' | 'degraded' | 'error';
  db: 'connected' | 'disconnected';
  env: {
    required: boolean;
    optionalConfigured: string[];
  };
  time: string;
  uptime?: number;
}

export async function GET(): Promise<NextResponse<HealthResponse>> {
  const startTime = Date.now();

  try {
    // Validate environment at request time (catches runtime issues)
    const envValidation = validateEnv();

    // Attempt database connection (non-blocking; catches errors gracefully)
    let dbConnected = false;
    try {
      await connectDB();
      dbConnected = true;
    } catch (dbError) {
      console.error('Health check: DB connection failed', dbError);
      dbConnected = false;
    }

    // Determine optional integrations configured
    const optionalConfigured: string[] = [];

    if (process.env.CASHFREE_APP_ID && process.env.CASHFREE_SECRET_KEY) {
      optionalConfigured.push('cashfree');
    }
    if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
      optionalConfigured.push('google-oauth');
    }
    if (
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY
    ) {
      optionalConfigured.push('cloudinary');
    }
    if (process.env.DELHIVERY_API_KEY) {
      optionalConfigured.push('delhivery');
    }
    if (process.env.FAST2SMS_API_KEY) {
      optionalConfigured.push('fast2sms');
    }
    if (process.env.SMTP_HOST && process.env.SMTP_USER) {
      optionalConfigured.push('smtp-email');
    }

    // Determine overall status
    let status: 'ok' | 'degraded' | 'error' = 'ok';
    let httpStatus = 200;

    if (!envValidation.ok) {
      status = 'error';
      httpStatus = 503; // Service Unavailable
    } else if (!dbConnected) {
      status = 'degraded';
      httpStatus = 200; // Still 200 but status='degraded' for monitoring
    }

    const response: HealthResponse = {
      status,
      db: dbConnected ? 'connected' : 'disconnected',
      env: {
        required: envValidation.ok,
        optionalConfigured,
      },
      time: new Date().toISOString(),
      uptime: process.uptime(),
    };

    return NextResponse.json(response, { status: httpStatus });
  } catch (error) {
    // Catch-all: never crash the health endpoint
    console.error('Health check error:', error);

    const response: HealthResponse = {
      status: 'error',
      db: 'disconnected',
      env: {
        required: false,
        optionalConfigured: [],
      },
      time: new Date().toISOString(),
    };

    return NextResponse.json(response, { status: 503 });
  }
}
