import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import connectDB from '@/lib/mongodb/connection';
import ContactInquiry from '@/models/ContactInquiry';
import { ADMIN_EMAIL } from '@/lib/constants';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = (body.name || '').trim();
    const phone = (body.phone || '').trim();
    const city = (body.city || '').trim();
    const message = (body.message || '').trim();

    if (!name || !phone) {
      return NextResponse.json(
        { error: 'Name and phone are required.' },
        { status: 400 }
      );
    }

    await connectDB();
    await ContactInquiry.create({ name, phone, city, message });

    // Best-effort admin notification — never fail the request on email error
    try {
      if (process.env.SMTP_USER && process.env.SMTP_PASS) {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST || 'smtp.gmail.com',
          port: parseInt(process.env.SMTP_PORT || '587'),
          secure: false,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });

        await transporter.sendMail({
          from: process.env.SMTP_FROM || process.env.SMTP_USER,
          to: ADMIN_EMAIL,
          subject: `New Contact Inquiry from ${name}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color:#B91C1C;">New Contact Inquiry</h2>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Phone:</strong> ${phone}</p>
              ${city ? `<p><strong>City:</strong> ${city}</p>` : ''}
              ${message ? `<p><strong>Message:</strong> ${message}</p>` : ''}
            </div>
          `,
        });
      }
    } catch (emailError) {
      console.error('Contact notification email failed:', emailError);
    }

    return NextResponse.json({
      success: true,
      message: "We'll get back to you within 24 hours",
    });
  } catch (error: any) {
    console.error('Contact inquiry failed:', error);
    return NextResponse.json(
      { error: 'Failed to submit inquiry. Please try again.' },
      { status: 500 }
    );
  }
}
