/**
 * fix-sync-tables.js
 *
 * Root-cause fix for the Continue Watching / Watchlist 500 errors.
 *
 * Your /api/watch-history and /api/watchlist routes use:
 *   ON CONFLICT (user_id, movie_id) DO UPDATE ...
 *
 * Postgres REQUIRES a UNIQUE or EXCLUSION constraint on exactly those
 * columns for ON CONFLICT to work. There is no migration anywhere in
 * this repo that creates that constraint (only scripts/setup-db.js
 * exists, and it only touches the `movies` table) — which means on a
 * fresh / real production database, every POST to these routes throws:
 *
 *   error: there is no unique or exclusion constraint matching the
 *   ON CONFLICT specification
 *
 * ...which your catch block turns into a generic 500. This script is
 * SAFE to run against your existing production DB: it creates the
 * tables only if they don't exist, and adds the constraint only if
 * it's missing. It will NOT touch or delete any existing rows.
 *
 * Run with:  node scripts/fix-sync-tables.js
 * (uses DATABASE_URL from .env.local, same as your other scripts)
 */

const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL);

async function main() {
  console.log('🔎 Checking watch_history / watchlist schema...\n');

  // ---- watch_history ----------------------------------------------------
  await sql`
    CREATE TABLE IF NOT EXISTS watch_history (
      id SERIAL PRIMARY KEY,
      user_id TEXT NOT NULL,
      movie_id TEXT NOT NULL,
      movie_slug TEXT NOT NULL,
      movie_title TEXT NOT NULL,
      poster_url TEXT,
      progress NUMERIC DEFAULT 0,
      duration NUMERIC,
      last_watched TIMESTAMP DEFAULT NOW()
    )
  `;
  console.log('✅ watch_history table exists (created if it was missing)');

  const whConstraint = await sql`
    SELECT 1 FROM pg_constraint WHERE conname = 'watch_history_user_movie_unique'
  `;
  if (whConstraint.length === 0) {
    await sql`
      ALTER TABLE watch_history
      ADD CONSTRAINT watch_history_user_movie_unique UNIQUE (user_id, movie_id)
    `;
    console.log('✅ Added missing UNIQUE(user_id, movie_id) constraint to watch_history');
  } else {
    console.log('✅ watch_history already has the unique constraint');
  }

  // ---- watchlist ----------------------------------------------------------
  await sql`
    CREATE TABLE IF NOT EXISTS watchlist (
      id SERIAL PRIMARY KEY,
      user_id TEXT NOT NULL,
      movie_id TEXT NOT NULL,
      movie_slug TEXT NOT NULL,
      movie_title TEXT NOT NULL,
      poster_url TEXT,
      added_at TIMESTAMP DEFAULT NOW()
    )
  `;
  console.log('✅ watchlist table exists (created if it was missing)');

  const wlConstraint = await sql`
    SELECT 1 FROM pg_constraint WHERE conname = 'watchlist_user_movie_unique'
  `;
  if (wlConstraint.length === 0) {
    await sql`
      ALTER TABLE watchlist
      ADD CONSTRAINT watchlist_user_movie_unique UNIQUE (user_id, movie_id)
    `;
    console.log('✅ Added missing UNIQUE(user_id, movie_id) constraint to watchlist');
  } else {
    console.log('✅ watchlist already has the unique constraint');
  }

  // ---- sanity check -------------------------------------------------------
  const whCount = await sql`SELECT COUNT(*) FROM watch_history`;
  const wlCount = await sql`SELECT COUNT(*) FROM watchlist`;
  console.log(`\n📊 watch_history rows: ${whCount[0].count}`);
  console.log(`📊 watchlist rows: ${wlCount[0].count}`);
  console.log('\n🎉 Done. Your existing /api/watch-history and /api/watchlist routes');
  console.log('   should now return 200 instead of 500 — no code changes needed there.');
}

main().catch((err) => {
  console.error('❌ Migration failed:', err);
  process.exit(1);
});