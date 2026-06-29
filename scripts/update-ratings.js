const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL);

// 👉 Replace these with the real ratings you want to show.
const ratings = {
  'african-rhapsody': 7.5,
  'turn-it-up-with-big-b': 7.0,
  'cbn-faith-nation': 8.0,
  'sinach': 8.5,
  'body-praise': 7.8,
  'don-moen': 8.2,
  'muyiwa-riversongz-live-o2': 8.0,
  'tpi-show': 7.0,
  'ccp': 5.0, // already set correctly
};

async function main() {
  for (const [slug, rating] of Object.entries(ratings)) {
    const result = await sql`
      UPDATE movies SET rating = ${rating} WHERE slug = ${slug}
      RETURNING title, rating
    `;
    if (result[0]) {
      console.log(`✅ ${result[0].title}: ${result[0].rating}`);
    } else {
      console.log(`⚠️  No movie found with slug "${slug}"`);
    }
  }
  console.log('\n🎉 Done.');
}

main().catch(console.error);