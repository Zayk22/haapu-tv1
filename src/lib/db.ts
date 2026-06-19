import { neon } from '@neondatabase/serverless';

// Get the database URL from environment variables
const databaseUrl = process.env.DATABASE_URL;

// If the URL is missing, log a clear error message
if (!databaseUrl) {
  console.error('❌ DATABASE_URL is not set in environment variables');
  throw new Error('DATABASE_URL is not set');
}

console.log('✅ Database URL found, connecting...');

// Create the SQL client
const sql = neon(databaseUrl);

export { sql };