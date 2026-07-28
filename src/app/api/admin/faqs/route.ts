import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAccess } from '@/lib/auth-helpers';
import { connectDB } from '@/lib/mongodb';
import Faq from '@/models/Faq';

/**
 * GET /api/admin/faqs
 * Returns all FAQs (admin view, includes inactive)
 */
export async function GET() {
  const adminCheck = await verifyAdminAccess();
  if (adminCheck.error) return adminCheck.error;

  try {
    await connectDB();
    const faqs = await Faq.find()
      .sort({ category: 1, order: 1 })
      .lean();
    return NextResponse.json({ success: true, faqs });
  } catch (error: any) {
    console.error('Error fetching FAQs:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * POST /api/admin/faqs
 * Create a new FAQ
 */
export async function POST(request: NextRequest) {
  const adminCheck = await verifyAdminAccess();
  if (adminCheck.error) return adminCheck.error;

  try {
    await connectDB();
    const body = await request.json();

    if (!body.question?.trim() || !body.answer?.trim() || !body.category?.trim()) {
      return NextResponse.json(
        { error: 'Question, answer, and category are required' },
        { status: 400 }
      );
    }

    // Get the highest order in the category
    const lastInCategory = await Faq.findOne({ category: body.category })
      .sort({ order: -1 })
      .lean() as any;
    const order = ((lastInCategory?.order as number) ?? -1) + 1;

    const faq = await Faq.create({
      question: body.question.trim(),
      answer: body.answer.trim(),
      category: body.category.trim(),
      order,
      isActive: body.isActive !== false,
    });

    return NextResponse.json({ success: true, faq }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating FAQ:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
