import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAccess } from '@/lib/auth-helpers';
import { connectDB } from '@/lib/mongodb';
import SiteSettings from '@/models/SiteSettings';
import AdminActivity from '@/models/AdminActivity';

/**
 * GET /api/admin/inventory/threshold
 * Get current low-stock threshold
 */
export async function GET() {
  try {
    const adminCheck = await verifyAdminAccess();
    if (adminCheck.error) return adminCheck.error;

    await connectDB();

    let settings = (await SiteSettings.findOne({ key: 'global' }).lean()) as any;

    if (!settings) {
      settings = await SiteSettings.create({
        key: 'global',
        inventory: { lowStockThreshold: 10 },
      });
    }

    const threshold = (settings?.inventory?.lowStockThreshold ?? 10) as number;

    return NextResponse.json({ threshold });
  } catch (error: any) {
    console.error('Error fetching threshold:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * PUT /api/admin/inventory/threshold
 * Update low-stock threshold (admin only)
 * Body: { threshold: number }
 */
export async function PUT(request: NextRequest) {
  try {
    const adminCheck = await verifyAdminAccess();
    if (adminCheck.error) return adminCheck.error;
    const session = adminCheck.session;

    await connectDB();

    const body = await request.json();
    const { threshold } = body;

    // Validate threshold
    if (threshold === undefined || threshold === null) {
      return NextResponse.json(
        { error: 'Threshold is required' },
        { status: 400 }
      );
    }

    const parsedThreshold = parseInt(String(threshold), 10);
    if (isNaN(parsedThreshold) || parsedThreshold < 0) {
      return NextResponse.json(
        { error: 'Threshold must be a non-negative integer' },
        { status: 400 }
      );
    }

    // Update settings
    const settings = (await SiteSettings.findOneAndUpdate(
      { key: 'global' },
      {
        $set: {
          'inventory.lowStockThreshold': parsedThreshold,
        },
      },
      { new: true, upsert: true }
    )) as any;

    // Log admin activity
    try {
      await AdminActivity.create({
        adminId: session.user.id,
        adminName: session.user.name || 'Unknown Admin',
        adminEmail: session.user.email,
        action: 'low_stock_threshold_updated',
        entityType: 'system',
        details: { threshold: parsedThreshold },
      });
    } catch (logError) {
      console.error('Error logging admin activity:', logError);
      // Don't fail the request if logging fails
    }

    return NextResponse.json({
      success: true,
      threshold: (settings?.inventory?.lowStockThreshold ?? parsedThreshold) as number,
    });
  } catch (error: any) {
    console.error('Error updating threshold:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
