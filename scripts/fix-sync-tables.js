 const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL);

async function fixSyncTables() {
  console.log('🔧 Fixing watch_history and watchlist tables...');

  // 1. Fix watch_history
  console.log('📦 Checking watch_history...');
  await sql`
    CREATE TABLE IF NOT EXISTS watch_history (
      id SERIAL PRIMARY KEY,
      user_id TEXT NOT NULL,
      movie_id TEXT NOT NULL,
      movie_slug TEXT,
      movie_title TEXT,
      poster_url TEXT,
      progress INTEGER DEFAULT 0,
      duration TEXT,
      last_watched TIMESTAMP DEFAULT NOW()
    )
  `;

  // Add unique constraint if missing
  await sql`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'watch_history_user_id_movie_id_key'
      ) THEN
        ALTER TABLE watch_history ADD CONSTRAINT watch_history_user_id_movie_id_key UNIQUE (user_id, movie_id);
      END IF;
    END
    $$;
  `;
  console.log('✅ watch_history ready');

  // 2. Fix watchlist
  console.log('📦 Checking watchlist...');
  await sql`
    CREATE TABLE IF NOT EXISTS watchlist (
      id SERIAL PRIMARY KEY,
      user_id TEXT NOT NULL,
      movie_id TEXT NOT NULL,
      movie_slug TEXT,
      movie_title TEXT,
      poster_url TEXT,
      added_at TIMESTAMP DEFAULT NOW()
    )
  `;

  // Add unique constraint if missing
  await sql`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'watchlist_user_id_movie_id_key'
      ) THEN
        ALTER TABLE watchlist ADD CONSTRAINT watchlist_user_id_movie_id_key UNIQUE (user_id, movie_id);
      END IF;
    END
    $$;
  `;
  console.log('✅ watchlist ready');

  console.log('🎉 All sync tables fixed!');
}

fixSyncTables().catch(console.error);
