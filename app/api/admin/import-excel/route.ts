import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import * as XLSX from 'xlsx';
import slugify from 'slugify';
import { ObjectId } from 'bson';

const prisma = new PrismaClient();

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ message: 'No file uploaded' }, { status: 400 });
    }

    // ✅ Read Excel directly from memory (no temp files)
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const rows = XLSX.utils.sheet_to_json<any>(workbook.Sheets[sheetName]);

    const imported: string[] = [];

    for (const row of rows) {
      // -------------------------------
      // 1️⃣ Organizer
      // -------------------------------
      const organizer = await prisma.user.upsert({
        where: { email: row.organizerEmail },
        update: {},
        create: {
          id: new ObjectId().toString(),
          email: row.organizerEmail,
          firstName: row.organizerName || 'Organizer',
          lastName: row.organizerLastName || '',
          role: 'ORGANIZER',
          isVerified: true,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      // -------------------------------
      // 2️⃣ Event
      // -------------------------------
      const startDate = new Date(row.startDate);
      const endDate = new Date(row.endDate);

      const event = await prisma.event.create({
        data: {
          id: new ObjectId().toString(),
          title: row.eventTitle,
          description: row.eventDescription || '',
          slug: slugify(row.eventTitle || `event-${Date.now()}`, { lower: true }),
          startDate,
          endDate,
          registrationStart: startDate,
          registrationEnd: endDate,
          category: row.category ? [row.category] : [],
          tags: row.tags ? row.tags.split(',').map((t: string) => t.trim()) : [],
          organizerId: organizer.id,
          timezone: 'UTC',
          status: 'PUBLISHED',
          images: [],
          videos: [],
          brochure: null,
          layoutPlan: null,
          documents: [],
          isFeatured: false,
          isVIP: false,
          isPublic: true,
          requiresApproval: false,
          allowWaitlist: false,
          averageRating: 0,
          totalReviews: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      // -------------------------------
      // 3️⃣ Speaker
      // -------------------------------
      if (row.speakerEmail) {
        await prisma.user.upsert({
          where: { email: row.speakerEmail },
          update: {},
          create: {
            id: new ObjectId().toString(),
            email: row.speakerEmail,
            firstName: row.speakerName || 'Speaker',
            lastName: '',
            role: 'SPEAKER',
            isVerified: true,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });
      }

      // -------------------------------
      // 4️⃣ Exhibitor
      // -------------------------------
      if (row.exhibitorEmail) {
        await prisma.user.upsert({
          where: { email: row.exhibitorEmail },
          update: {},
          create: {
            id: new ObjectId().toString(),
            email: row.exhibitorEmail,
            firstName: row.exhibitorName || 'Exhibitor',
            lastName: '',
            role: 'EXHIBITOR',
            isVerified: true,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });
      }

      // -------------------------------
      // 5️⃣ Venue
      // -------------------------------
      if (row.venueEmail) {
        await prisma.user.upsert({
          where: { email: row.venueEmail },
          update: {
            venueCity: row.venueCity,
            venueCountry: row.venueCountry,
          },
          create: {
            id: new ObjectId().toString(),
            email: row.venueEmail,
            firstName: row.venueName || 'Venue',
            lastName: '',
            role: 'VENUE_MANAGER',
            isVerified: true,
            isActive: true,
            venueCity: row.venueCity,
            venueCountry: row.venueCountry,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });
      }

      imported.push(event.title);
    }

    return NextResponse.json({
      message: `✅ Successfully imported ${imported.length} events`,
      imported,
    });
  } catch (error: any) {
    console.error('Import Error:', error);
    return NextResponse.json(
      { message: 'Import failed', error: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
