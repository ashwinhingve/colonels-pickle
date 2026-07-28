import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAccess } from '@/lib/auth-helpers';
import { connectDB } from '@/lib/mongodb';
import PageContent, { IPageContent } from '@/models/PageContent';

const VALID_SLUGS = [
  'privacy-policy',
  'terms-and-conditions',
  'refund-policy',
  'shipping-policy',
] as const;

/**
 * GET /api/admin/pages/[slug]
 * Returns a single page content record
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const adminCheck = await verifyAdminAccess();
  if (adminCheck.error) return adminCheck.error;

  try {
    const { slug } = await params;
    if (!VALID_SLUGS.includes(slug as any)) {
      return NextResponse.json({ error: 'Invalid page slug' }, { status: 400 });
    }

    await connectDB();
    const page = await PageContent.findOne({ slug: slug }).lean();

    if (!page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, page });
  } catch (error: any) {
    console.error('Error fetching page:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * PUT /api/admin/pages/[slug]
 * Create or update a page content record (upsert)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const adminCheck = await verifyAdminAccess();
  if (adminCheck.error) return adminCheck.error;

  try {
    const { slug } = await params;
    if (!VALID_SLUGS.includes(slug as any)) {
      return NextResponse.json({ error: 'Invalid page slug' }, { status: 400 });
    }

    await connectDB();
    const body = await request.json();

    if (!body.title?.trim()) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const page = await PageContent.findOneAndUpdate(
      { slug: slug },
      {
        title: body.title.trim(),
        subtitle: body.subtitle?.trim() || '',
        bodyHtml: body.bodyHtml || '',
        lastUpdated: body.lastUpdated || new Date().toISOString().split('T')[0],
        isPublished: body.isPublished === true,
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    );

    return NextResponse.json({ success: true, page });
  } catch (error: any) {
    console.error('Error updating page:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
