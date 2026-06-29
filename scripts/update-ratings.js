 const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL);

// Replace with your real ratings
const ratings = [
  { slug: 'african-rhapsody', rating: 4.5 },
  { slug: 'turn-it-up-with-big-b', rating: 4.0 },
  { slug: 'cbn-faith-nation', rating: 4.8 },
  { slug: 'sinach', rating: 5.0 },
  { slug: 'body-praise', rating: 4.2 },
  { slug: 'don-moen', rating: 4.9 },
  { slug: 'muyiwa-riversongz-live-o2', rating: 4.7 },
  { slug: 'tpi-show', rating: 3.8 },
  { slug: 'ccp', rating: 5.0 },
];

async function updateRatings() {
  for (const { slug, rating } of ratings) {
    await sql`UPDATE movies SET rating = ${rating} WHERE slug = ${slug}`;
    console.log(`✅ ${slug}: ${rating}`);
  }
  console.log('🎉 All ratings updated!');
}

updateRatings().catch(console.error);
