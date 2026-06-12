const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL);

const movies = [
  {
    slug: "african-rhapsody",
    title: "African Rhapsody",
    description: "African Rhapsody is a compelling drama that explores love, ambition, and cultural identity against the vibrant backdrop of Africa...",
    poster_url: "/images/african-rhapsody.jpg",
    backdrop_url: "/images/african-rhapsody.jpg",
    video_embed_url: "https://fast.wistia.net/embed/iframe/71muabo3j3",
    duration: "2 h : 45 min",
    genres: ["Drama", "African"],
    rating: 0,
    access_type: "free"
  },
  {
    slug: "turn-it-up-with-big-b",
    title: "Turn it up with BIG B",
    description: "Turn It Up with BIG B is an energetic music-driven experience that celebrates rhythm, culture, and vibrant African sound.",
    poster_url: "/images/turn-it-up-with-big-b.jpg",
    backdrop_url: "/images/turn-it-up-with-big-b.jpg",
    video_embed_url: "https://fast.wistia.net/embed/iframe/88da3r24gf",
    duration: "1 h : 50 min",
    genres: ["Music", "Entertainment"],
    rating: 0,
    access_type: "free"
  },
  {
    slug: "cbn-faith-nation",
    title: "CBN Faith Nation",
    description: "CBN Faith Nation is an inspiring faith-based program delivering uplifting messages, powerful testimonies, and engaging discussions.",
    poster_url: "/images/cbn-faith-nation.jpg",
    backdrop_url: "/images/cbn-faith-nation.jpg",
    video_embed_url: "https://fast.wistia.net/embed/iframe/ymn8l14bf8",
    duration: "3 h : 33 min",
    genres: ["Faith", "Inspirational"],
    rating: 0,
    access_type: "free"
  },
  {
    slug: "sinach",
    title: "SINACH",
    description: "SINACH is a globally recognized gospel artist known for her powerful worship music and inspirational performances.",
    poster_url: "/images/sinach.jpg",
    backdrop_url: "/images/sinach.jpg",
    video_embed_url: "https://fast.wistia.net/embed/iframe/a7wg42zv43",
    duration: "1 h : 45 min",
    genres: ["Gospel", "Music"],
    rating: 0,
    access_type: "free"
  },
  {
    slug: "body-praise",
    title: "BODY PRAISE",
    description: "Body Praise is an uplifting and energetic gospel experience that blends music, movement, and spiritual expression.",
    poster_url: "/images/body-praise.jpg",
    backdrop_url: "/images/body-praise.jpg",
    video_embed_url: "https://fast.wistia.net/embed/iframe/m5s04uxyna",
    duration: "2 h : 35 min",
    genres: ["Gospel", "Music"],
    rating: 0,
    access_type: "free"
  },
  {
    slug: "don-moen",
    title: "Don Moen",
    description: "Don Moen is a globally celebrated worship leader known for his timeless gospel music and inspiring ministry.",
    poster_url: "/images/don-moen.jpg",
    backdrop_url: "/images/don-moen.jpg",
    video_embed_url: "https://fast.wistia.net/embed/iframe/4kvvngejl9",
    duration: "2 h : 15 min",
    genres: ["Gospel", "Music"],
    rating: 0,
    access_type: "free"
  },
  {
    slug: "muyiwa-riversongz-live-o2",
    title: "Muyiwa & Riversongz Live @ O2",
    description: "Muyiwa & Riversongz Live @ O2 captures an electrifying night of worship and gospel celebration at one of the world's most iconic venues.",
    poster_url: "/images/muyiwa-riversongz-live-o2.jpg",
    backdrop_url: "/images/muyiwa-riversongz-live-o2.jpg",
    video_embed_url: "https://fast.wistia.net/embed/iframe/phkuz8unol",
    duration: "1 h : 45 min",
    genres: ["Gospel", "Live Music"],
    rating: 0,
    access_type: "free"
  },
  {
    slug: "tpi-show",
    title: "TPi Show",
    description: "The TPi Show delivers engaging conversations, dynamic performances, and insightful discussions.",
    poster_url: "/images/tpi-show.jpg",
    backdrop_url: "/images/tpi-show.jpg",
    video_embed_url: "https://fast.wistia.net/embed/iframe/uwetefphjm",
    duration: "50 min",
    genres: ["Talk Show", "Entertainment"],
    rating: 0,
    access_type: "free"
  },
  {
    slug: "ccp",
    title: "Captain Crazy Praise",
    description: "Captain Crazy Praise is a vibrant and energetic gospel celebration that brings music, praise, and spiritual joy together.",
    poster_url: "/images/ccp.jpg",
    backdrop_url: "/images/ccp.jpg",
    video_embed_url: "https://www.youtube.com/embed/nOqaxC2y2Fs",
    duration: "2 h : 15 min",
    genres: ["Gospel", "Music"],
    rating: 5.0,
    access_type: "free"
  }
];

async function importMovies() {
  console.log('📝 Starting import...');
  
  for (const movie of movies) {
    await sql`
      INSERT INTO movies (slug, title, description, poster_url, backdrop_url, video_embed_url, duration, genres, rating, access_type)
      VALUES (${movie.slug}, ${movie.title}, ${movie.description}, ${movie.poster_url}, ${movie.backdrop_url}, ${movie.video_embed_url}, ${movie.duration}, ${movie.genres}, ${movie.rating}, ${movie.access_type})
      ON CONFLICT (slug) DO NOTHING
    `;
    console.log(`✅ Imported: ${movie.title}`);
  }
  
  const result = await sql`SELECT COUNT(*) FROM movies`;
  console.log(`🎉 Done! Total movies in database: ${result[0].count}`);
}

importMovies().catch(console.error);