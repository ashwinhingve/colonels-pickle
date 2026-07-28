import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAccess } from '@/lib/auth-helpers';
import { connectDB } from '@/lib/mongodb';
import PageContent from '@/models/PageContent';

/**
 * GET /api/admin/pages
 * Returns all page content records (admin view)
 */
export async function GET() {
  const adminCheck = await verifyAdminAccess();
  if (adminCheck.error) return adminCheck.error;

  try {
    await connectDB();
    const pages = await PageContent.find().sort({ slug: 1 }).lean();
    return NextResponse.json({ success: true, pages });
  } catch (error: any) {
    console.error('Error fetching pages:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
