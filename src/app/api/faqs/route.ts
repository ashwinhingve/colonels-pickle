import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Faq from '@/models/Faq';

/**
 * GET /api/faqs
 * Returns all active FAQs, sorted by category and order
 * Public endpoint (no auth required)
 */
export async function GET() {
  try {
    await connectDB();
    const faqs = await Faq.find({ isActive: true })
      .sort({ category: 1, order: 1 })
      .lean();
    return NextResponse.json({ success: true, faqs });
  } catch (error: any) {
    console.error('Error fetching FAQs:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
