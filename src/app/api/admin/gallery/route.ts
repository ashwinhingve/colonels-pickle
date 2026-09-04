import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import GalleryMedia from '@/models/GalleryMedia';
import { verifyAdminAccess } from '@/lib/auth-helpers';

// GET - List all gallery media (any status), admin only
export async function GET() {
  try {
    const adminCheck = await verifyAdminAccess();
    if (adminCheck.error) return adminCheck.error;

    await connectDB();
    const items = await GalleryMedia.find().sort({ order: 1 }).lean();
    return NextResponse.json({ items });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch gallery media' },
      { status: 500 }
    );
  }
}

// POST - Create a new gallery media item
export async function POST(request: NextRequest) {
  try {
    const adminCheck = await verifyAdminAccess();
    if (adminCheck.error) return adminCheck.error;

    await connectDB();
    const body = await request.json();
    const {
      type,
      url,
      publicId,
      posterUrl,
      width,
      height,
      title,
      caption,
      altText,
      category,
      isActive,
    } = body;

    if (!type || !url || !title) {
      return NextResponse.json(
        { error: 'type, url, and title are required' },
        { status: 400 }
      );
    }

    const maxOrder = await GalleryMedia.findOne().sort({ order: -1 }).select('order').lean();
    const order = (maxOrder as any)?.order != null ? (maxOrder as any).order + 1 : 0;

    const item = await GalleryMedia.create({
      type,
      url,
      publicId,
      posterUrl,
      width,
      height,
      title,
      caption,
      altText,
      category: category || 'General',
      order,
      isActive: isActive !== false,
    });

    return NextResponse.json({ item }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create gallery media' },
      { status: 500 }
    );
  }
}

// PATCH - Bulk reorder: reassigns either `order` (main gallery) or `heroOrder` (Hero Pool)
export async function PATCH(request: NextRequest) {
  try {
    const adminCheck = await verifyAdminAccess();
    if (adminCheck.error) return adminCheck.error;

    await connectDB();
    const body = await request.json();
    const { ids, field } = body as { ids: string[]; field?: 'order' | 'heroOrder' };

    if (!Array.isArray(ids)) {
      return NextResponse.json({ error: 'ids array is required' }, { status: 400 });
    }
    const sortField = field === 'heroOrder' ? 'heroOrder' : 'order';
    const uniqueIds = [...new Set(ids)];

    const updates = uniqueIds.map((id: string, index: number) =>
      GalleryMedia.findByIdAndUpdate(id, { [sortField]: index })
    );
    await Promise.all(updates);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to reorder gallery media' },
      { status: 500 }
    );
  }
}
