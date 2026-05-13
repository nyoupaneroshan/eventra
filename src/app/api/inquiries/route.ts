import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, email, eventType, eventDate, message } = body;

    // Validate required fields
    if (!name || !phone || !email || !eventType || !eventDate) {
      return NextResponse.json(
        { error: 'Missing required fields. Please fill in all required fields.' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    // Create inquiry in database
    const inquiry = await db.inquiry.create({
      data: {
        name,
        phone,
        email,
        eventType,
        eventDate,
        message: message || null,
      },
    });

    return NextResponse.json(
      {
        message: 'Inquiry submitted successfully! We will get back to you within 24 hours.',
        inquiry: {
          id: inquiry.id,
          name: inquiry.name,
          eventType: inquiry.eventType,
          eventDate: inquiry.eventDate,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating inquiry:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again later.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const inquiries = await db.inquiry.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    return NextResponse.json({ inquiries });
  } catch (error) {
    console.error('Error fetching inquiries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch inquiries.' },
      { status: 500 }
    );
  }
}
