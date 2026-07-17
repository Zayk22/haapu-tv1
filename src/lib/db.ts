import { neon } from '@neondatabase/serverless';

// Fallback placeholder prevents build-time crash.
// Neon only connects when a query actually runs — at runtime,
// the real DATABASE_URL is always present in Vercel's environment.
const sql = neon(process.env.DATABASE_URL ?? 'postgresql://placeholder:placeholder@placeholder/placeholder');

export { sql };