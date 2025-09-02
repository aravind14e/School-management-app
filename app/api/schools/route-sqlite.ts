import { NextRequest, NextResponse } from 'next/server';
import getDatabase from '@/lib/db-sqlite';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

// GET - Fetch all schools
export async function GET() {
  try {
    const db = await getDatabase();
    const schools = await db.all('SELECT * FROM schools ORDER BY created_at DESC');
    
    return NextResponse.json(schools);
  } catch (error) {
    console.error('Error fetching schools:', error);
    return NextResponse.json(
      { error: 'Failed to fetch schools' },
      { status: 500 }
    );
  }
}

// POST - Add new school
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const name = formData.get('name') as string;
    const address = formData.get('address') as string;
    const city = formData.get('city') as string;
    const state = formData.get('state') as string;
    const contact = formData.get('contact') as string;
    const email_id = formData.get('email_id') as string;
    const imageFile = formData.get('image') as File;

    // Validate required fields
    if (!name || !address || !city || !state || !contact || !email_id || !imageFile) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!emailRegex.test(email_id)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate contact number (10 digits)
    const contactRegex = /^\d{10}$/;
    if (!contactRegex.test(contact)) {
      return NextResponse.json(
        { error: 'Contact number must be exactly 10 digits' },
        { status: 400 }
      );
    }

    // Handle image upload
    let imagePath = '';
    if (imageFile) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // Create directory if it doesn't exist
      const uploadDir = join(process.cwd(), 'public', 'schoolImages');
      if (!existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true });
      }
      
      // Generate unique filename
      const timestamp = Date.now();
      const fileExtension = imageFile.name.split('.').pop();
      const fileName = `school_${timestamp}.${fileExtension}`;
      const filePath = join(uploadDir, fileName);
      
      // Save file
      await writeFile(filePath, buffer);
      imagePath = `/schoolImages/${fileName}`;
    }

    // Insert into database
    const db = await getDatabase();
    const result = await db.run(
      'INSERT INTO schools (name, address, city, state, contact, image, email_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, address, city, state, contact, imagePath, email_id]
    );

    return NextResponse.json(
      { 
        message: 'School added successfully',
        id: result.lastID 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error adding school:', error);
    return NextResponse.json(
      { error: 'Failed to add school' },
      { status: 500 }
    );
  }
}
