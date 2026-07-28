import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import PageContent from '@/models/PageContent';

/**
 * GET /api/pages/[slug]
 * Returns a single published page content record
 * Public endpoint (no auth required)
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    await connectDB();
    const page = await PageContent.findOne({
      slug,
      isPublished: true,
    }).lean();

    if (!page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, page });
  } catch (error: any) {
    console.error('Error fetching page:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
