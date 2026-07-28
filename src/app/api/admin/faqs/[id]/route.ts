import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { verifyAdminAccess } from '@/lib/auth-helpers';
import { connectDB } from '@/lib/mongodb';
import Faq from '@/models/Faq';

/**
 * PATCH /api/admin/faqs/[id]
 * Update a FAQ
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminCheck = await verifyAdminAccess();
  if (adminCheck.error) return adminCheck.error;

  try {
    const { id } = await params;
    await connectDB();

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid FAQ ID' }, { status: 400 });
    }

    const body = await request.json();
    const updates: any = {};

    if (body.question !== undefined) updates.question = body.question.trim();
    if (body.answer !== undefined) updates.answer = body.answer.trim();
    if (body.category !== undefined) updates.category = body.category.trim();
    if (body.order !== undefined) updates.order = body.order;
    if (body.isActive !== undefined) updates.isActive = body.isActive;

    const faq = await Faq.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!faq) {
      return NextResponse.json({ error: 'FAQ not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, faq });
  } catch (error: any) {
    console.error('Error updating FAQ:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/faqs/[id]
 * Delete a FAQ
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminCheck = await verifyAdminAccess();
  if (adminCheck.error) return adminCheck.error;

  try {
    const { id } = await params;
    await connectDB();

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid FAQ ID' }, { status: 400 });
    }

    const faq = await Faq.findByIdAndDelete(id);

    if (!faq) {
      return NextResponse.json({ error: 'FAQ not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting FAQ:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
