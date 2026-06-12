const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL);

async function setupDatabase() {
  console.log('📦 Creating movies table...');
  
  await sql`
    CREATE TABLE IF NOT EXISTS movies (
      id SERIAL PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      poster_url TEXT,
      backdrop_url TEXT,
      video_embed_url TEXT,
      duration TEXT,
      genres TEXT[] DEFAULT '{}',
      rating DECIMAL(3,1) DEFAULT 0,
      featured BOOLEAN DEFAULT false,
      access_type TEXT DEFAULT 'free',
      release_date DATE,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `;
  
  console.log('✅ Movies table created!');
  
  // Check existing movies
  const result = await sql`SELECT COUNT(*) FROM movies`;
  console.log(`📊 Current movie count: ${result[0].count}`);
}

setupDatabase().catch(console.error);