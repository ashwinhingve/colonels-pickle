import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import GalleryMedia from '@/models/GalleryMedia';
import { verifyAdminAccess } from '@/lib/auth-helpers';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// PATCH - Update a gallery media item (fields, isActive, showInHero, etc.)
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const adminCheck = await verifyAdminAccess();
    if (adminCheck.error) return adminCheck.error;

    await connectDB();
    const { id } = await params;
    const body = await request.json();

    const item = await GalleryMedia.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!item) {
      return NextResponse.json({ error: 'Media item not found' }, { status: 404 });
    }

    return NextResponse.json({ item });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update gallery media' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a gallery media item (and its Cloudinary asset)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const adminCheck = await verifyAdminAccess();
    if (adminCheck.error) return adminCheck.error;

    await connectDB();
    const { id } = await params;

    const item = await GalleryMedia.findByIdAndDelete(id);

    if (!item) {
      return NextResponse.json({ error: 'Media item not found' }, { status: 404 });
    }

    if (item.publicId) {
      try {
        const cloudinary = (await import('@/lib/cloudinary/config')).default;
        await cloudinary.uploader.destroy(item.publicId, {
          resource_type: item.type === 'video' ? 'video' : 'image',
        });
      } catch (err) {
        console.error('Failed to delete from Cloudinary:', err);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete gallery media' },
      { status: 500 }
    );
  }
}
