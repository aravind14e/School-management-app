import { NextRequest, NextResponse } from 'next/server';
import getDatabase from '@/lib/db-sqlite';
import { unlink } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const schoolId = parseInt(params.id);
    
    if (isNaN(schoolId)) {
      return NextResponse.json(
        { error: 'Invalid school ID' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    
    // Get school details first to delete the image file
    const school = await db.get('SELECT * FROM schools WHERE id = ?', [schoolId]);
    
    if (!school) {
      return NextResponse.json(
        { error: 'School not found' },
        { status: 404 }
      );
    }

    // Delete the image file if it exists
    if (school.image) {
      try {
        const imagePath = join(process.cwd(), 'public', school.image);
        if (existsSync(imagePath)) {
          await unlink(imagePath);
        }
      } catch (error) {
        console.error('Error deleting image file:', error);
        // Continue with deletion even if image deletion fails
      }
    }

    // Delete from database
    await db.run('DELETE FROM schools WHERE id = ?', [schoolId]);

    return NextResponse.json(
      { message: 'School deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting school:', error);
    return NextResponse.json(
      { error: 'Failed to delete school' },
      { status: 500 }
    );
  }
}
