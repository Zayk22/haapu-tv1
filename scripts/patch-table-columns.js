/**
 * patch-table-columns.js
 *
 * Your watchlist/watch_history tables already existed in production with
 * an incomplete schema — missing columns that your actual API routes
 * (src/app/api/watchlist/route.ts, src/app/api/watch-history/route.ts)
 * already reference, like movie_slug. ADD COLUMN IF NOT EXISTS is safe:
 * it only adds a column if it's missing, never touches existing data,
 * and never errors if the column is already there.
 */

const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL);

async function main() {
  console.log('🔧 Patching watchlist columns...');
  await sql`ALTER TABLE watchlist ADD COLUMN IF NOT EXISTS movie_slug TEXT`;
  await sql`ALTER TABLE watchlist ADD COLUMN IF NOT EXISTS movie_title TEXT`;
  await sql`ALTER TABLE watchlist ADD COLUMN IF NOT EXISTS poster_url TEXT`;
  await sql`ALTER TABLE watchlist ADD COLUMN IF NOT EXISTS added_at TIMESTAMP DEFAULT NOW()`;
  console.log('✅ watchlist patched');

  console.log('🔧 Patching watch_history columns...');
  await sql`ALTER TABLE watch_history ADD COLUMN IF NOT EXISTS movie_slug TEXT`;
  await sql`ALTER TABLE watch_history ADD COLUMN IF NOT EXISTS movie_title TEXT`;
  await sql`ALTER TABLE watch_history ADD COLUMN IF NOT EXISTS poster_url TEXT`;
  await sql`ALTER TABLE watch_history ADD COLUMN IF NOT EXISTS progress NUMERIC DEFAULT 0`;
  await sql`ALTER TABLE watch_history ADD COLUMN IF NOT EXISTS duration NUMERIC`;
  await sql`ALTER TABLE watch_history ADD COLUMN IF NOT EXISTS last_watched TIMESTAMP DEFAULT NOW()`;
  console.log('✅ watch_history patched');

  // Show the real current schema so we can both see exactly what's there now
  const wlCols = await sql`
    SELECT column_name, data_type FROM information_schema.columns
    WHERE table_name = 'watchlist' ORDER BY ordinal_position
  `;
  const whCols = await sql`
    SELECT column_name, data_type FROM information_schema.columns
    WHERE table_name = 'watch_history' ORDER BY ordinal_position
  `;
  console.log('\n📋 watchlist columns:', wlCols.map(c => c.column_name).join(', '));
  console.log('📋 watch_history columns:', whCols.map(c => c.column_name).join(', '));
  console.log('\n🎉 Done.');
}

main().catch((err) => {
  console.error('❌ Patch failed:', err);
  process.exit(1);
});