import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import GalleryMedia from '@/models/GalleryMedia';

// GET - Public: fetch the ordered Hero Pool for the homepage's staggered panels
export async function GET() {
  try {
    await connectDB();
    const items = await GalleryMedia.find({ isActive: true, showInHero: true })
      .sort({ heroOrder: 1 })
      .select('type url posterUrl title altText')
      .lean();

    return NextResponse.json({ items });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch hero gallery' },
      { status: 500 }
    );
  }
}
