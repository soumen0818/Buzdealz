import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config();

/**
 * Database Migration Script
 * Run this to apply all pending migrations to your database
 * Command: npm run db:migrate
 */

async function runMigration() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set in environment variables');
  }

  console.log('🚀 Starting database migration...');
  
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const db = drizzle(pool);

  try {
    // Run migrations from the migrations folder
    await migrate(db, {
      migrationsFolder: path.join(__dirname, './migrations'),
    });

    console.log('✅ Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runMigration();
