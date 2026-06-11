import type { ContentItem, ContentType } from "@/types/content";

// ============================================
// REAL HAPPU TV CONTENT DATA
// ============================================

const PLACEHOLDER_CONTENT: ContentItem[] = [
  {
    id: "1", slug: "african-rhapsody", title: "African Rhapsody", type: "movie",
    description: "African Rhapsody is a compelling drama that explores love, ambition, and cultural identity...",
    posterUrl: "/images/african-rhapsody.jpg",
    backdropUrl: "/images/african-rhapsody.jpg",
    duration: "2 h : 45 min", language: ["English (US)"], genres: ["Drama", "African"], accessType: "free",
    videoEmbedUrl: "https://fast.wistia.net/embed/iframe/71muabo3j3", rating: 0,
  },
  {
    id: "2", slug: "turn-it-up-with-big-b", title: "Turn it up with BIG B", type: "movie",
    description: "Turn It Up with BIG B is an energetic music-driven experience...",
    posterUrl: "/images/turn-it-up-with-big-b.jpg",
    backdropUrl: "/images/turn-it-up-with-big-b.jpg",
    duration: "1 h : 50 min", language: ["English (US)"], genres: ["Music", "Entertainment"], accessType: "free",
    videoEmbedUrl: "https://fast.wistia.net/embed/iframe/88da3r24gf", rating: 0,
  },
  {
    id: "3", slug: "cbn-faith-nation", title: "CBN Faith Nation", type: "movie",
    description: "CBN Faith Nation is an inspiring faith-based program...",
    posterUrl: "/images/cbn-faith-nation.jpg",
    backdropUrl: "/images/cbn-faith-nation.jpg",
    duration: "3 h : 33 min", language: ["English (US)"], genres: ["Faith", "Inspirational"], accessType: "free",
    videoEmbedUrl: "https://fast.wistia.net/embed/iframe/ymn8l14bf8", rating: 0,
  },
  {
    id: "4", slug: "sinach", title: "SINACH", type: "movie",
    description: "SINACH is a globally recognized gospel artist...",
    posterUrl: "/images/sinach.jpg",
    backdropUrl: "/images/sinach.jpg",
    duration: "1 h : 45 min", language: ["English (US)"], genres: ["Gospel", "Music"], accessType: "free",
    videoEmbedUrl: "https://fast.wistia.net/embed/iframe/a7wg42zv43", rating: 0,
  },
  {
    id: "5", slug: "body-praise", title: "BODY PRAISE", type: "movie",
    description: "Body Praise is an uplifting and energetic gospel experience...",
    posterUrl: "/images/body-praise.jpg",
    backdropUrl: "/images/body-praise.jpg",
    duration: "2 h : 35 min", language: ["English (US)"], genres: ["Gospel", "Music"], accessType: "free",
    videoEmbedUrl: "https://fast.wistia.net/embed/iframe/m5s04uxyna", rating: 0,
  },
  {
    id: "6", slug: "don-moen", title: "Don Moen", type: "movie",
    description: "Don Moen is a globally celebrated worship leader...",
    posterUrl: "/images/don-moen.jpg",
    backdropUrl: "/images/don-moen.jpg",
    duration: "2 h : 15 min", language: ["English (US)"], genres: ["Gospel", "Music"], accessType: "free",
    videoEmbedUrl: "https://fast.wistia.net/embed/iframe/4kvvngejl9", rating: 0,
  },
  {
    id: "7", slug: "muyiwa-riversongz-live-o2", title: "Muyiwa & Riversongz Live @ O2", type: "movie",
    description: "Muyiwa & Riversongz Live @ O2 captures an electrifying night of worship...",
    posterUrl: "/images/muyiwa-riversongz-live-o2.jpg",
    backdropUrl: "/images/muyiwa-riversongz-live-o2.jpg",
    duration: "1 h : 45 min", language: ["English (US)"], genres: ["Gospel", "Live Music"], accessType: "free",
    videoEmbedUrl: "https://fast.wistia.net/embed/iframe/phkuz8unol", rating: 0,
  },
  {
    id: "8", slug: "tpi-show", title: "TPi Show", type: "movie",
    description: "The TPi Show delivers engaging conversations...",
    posterUrl: "/images/tpi-show.jpg",
    backdropUrl: "/images/tpi-show.jpg",
    duration: "50 min", language: ["English (US)"], genres: ["Talk Show", "Entertainment"], accessType: "free",
    videoEmbedUrl: "https://fast.wistia.net/embed/iframe/uwetefphjm", rating: 0,
  },
  {
    id: "9", slug: "ccp", title: "Captain Crazy Praise", type: "movie",
    description: "Captain Crazy Praise is a vibrant and energetic gospel celebration...",
    posterUrl: "/images/ccp.jpg",
    backdropUrl: "/images/ccp.jpg",
    duration: "2 h : 15 min", language: ["English (UK)"], genres: ["Gospel", "Music"], accessType: "free",
    videoEmbedUrl: "https://www.youtube.com/embed/nOqaxC2y2Fs", rating: 5.0,
  },
];

// ============================================
// DATA ACCESS FUNCTIONS - MAKE SURE THESE ARE EXPORTED CORRECTLY
// ============================================

export async function getContent(type?: ContentType): Promise<ContentItem[]> {
  let items = PLACEHOLDER_CONTENT;
  if (type) {
    items = items.filter((item) => item.type === type);
  }
  return items;
}

export async function getContentBySlug(slug: string): Promise<ContentItem | null> {
  return PLACEHOLDER_CONTENT.find((item) => item.slug === slug) || null;
}

export async function getContentByGenre(genre: string): Promise<ContentItem[]> {
  return PLACEHOLDER_CONTENT.filter((item) =>
    item.genres.map((g) => g.toLowerCase()).includes(genre.toLowerCase())
  );
}

export async function searchContent(query: string): Promise<ContentItem[]> {
  const q = query.toLowerCase();
  return PLACEHOLDER_CONTENT.filter(
    (item) =>
      item.title.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q)
  );
}

export async function getGenres(): Promise<string[]> {
  const genres = new Set<string>();
  PLACEHOLDER_CONTENT.forEach((item) => {
    item.genres.forEach((g) => genres.add(g));
  });
  return Array.from(genres).sort();
}