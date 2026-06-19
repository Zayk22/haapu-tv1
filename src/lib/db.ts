import { neon } from '@neondatabase/serverless';

// Get database URL from environment
const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;

if (!databaseUrl) {
  console.error('❌ No database URL found');
  console.error('Available URL env vars:', Object.keys(process.env).filter(k => k.includes('URL') || k.includes('POSTGRES')));
  throw new Error('Database URL not set');
}

// Remove any quotes if present
const cleanUrl = databaseUrl.replace(/^"|"$/g, '');

console.log('✅ Database URL found (length:', cleanUrl.length, 'characters)');

// Create the SQL client
const sql = neon(cleanUrl);

export { sql };