const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');

async function migrateDatabase() {
  console.log('Starting database migration...');
  
  const dbPath = path.join(process.cwd(), 'school_management.db');
  
  try {
    // Open the database
    const db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });

    // Check if the new columns exist
    const tableInfo = await db.all("PRAGMA table_info(schools)");
    const columnNames = tableInfo.map(col => col.name);
    
    console.log('Current columns:', columnNames);

    // Add new columns if they don't exist
    const newColumns = [
      'about',
      'academic_programs', 
      'facilities',
      'website',
      'established_year',
      'principal_name',
      'total_students',
      'board_affiliation'
    ];

    for (const column of newColumns) {
      if (!columnNames.includes(column)) {
        console.log(`Adding column: ${column}`);
        await db.run(`ALTER TABLE schools ADD COLUMN ${column} TEXT`);
      }
    }

    // Update existing records to have empty strings for new fields
    const existingSchools = await db.all('SELECT id FROM schools');
    
    for (const school of existingSchools) {
      await db.run(`
        UPDATE schools 
        SET about = COALESCE(about, ''),
            academic_programs = COALESCE(academic_programs, ''),
            facilities = COALESCE(facilities, ''),
            website = COALESCE(website, ''),
            established_year = COALESCE(established_year, ''),
            principal_name = COALESCE(principal_name, ''),
            total_students = COALESCE(total_students, ''),
            board_affiliation = COALESCE(board_affiliation, '')
        WHERE id = ?
      `, [school.id]);
    }

    console.log('Database migration completed successfully!');
    console.log(`Updated ${existingSchools.length} existing schools`);

    // Verify the migration
    const finalTableInfo = await db.all("PRAGMA table_info(schools)");
    console.log('Final table structure:');
    finalTableInfo.forEach(col => {
      console.log(`  - ${col.name} (${col.type})`);
    });

    await db.close();
    
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrateDatabase();
