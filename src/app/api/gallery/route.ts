import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import GalleryMedia from '@/models/GalleryMedia';

// GET - Public: fetch active gallery media, paginated
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1);
    const limit = Math.min(48, Math.max(1, parseInt(searchParams.get('limit') || '24', 10) || 24));
    const type = searchParams.get('type'); // 'image' | 'video'
    const category = searchParams.get('category');

    const filter: Record<string, unknown> = { isActive: true };
    if (type === 'image' || type === 'video') filter.type = type;
    if (category) filter.category = category;

    // Categories don't depend on page/limit — only fetch them on the first
    // page so scrolling/"load more" doesn't recompute the distinct query.
    const [items, total, categories] = await Promise.all([
      GalleryMedia.find(filter)
        .sort({ order: 1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .select('type url posterUrl width height title caption altText category order')
        .lean(),
      GalleryMedia.countDocuments(filter),
      page === 1 ? GalleryMedia.distinct('category', { isActive: true }) : Promise.resolve(undefined),
    ]);

    return NextResponse.json({
      items,
      page,
      limit,
      total,
      hasMore: page * limit < total,
      ...(categories !== undefined ? { categories } : {}),
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch gallery media' },
      { status: 500 }
    );
  }
}
