import { sql } from './db';
import type { ContentItem, ContentType } from '@/types/content';

// Convert database movie to ContentItem format
function toContentItem(movie: any): ContentItem {
  return {
    id: movie.id.toString(),
    slug: movie.slug,
    title: movie.title,
    type: 'movie',
    description: movie.description || '',
    posterUrl: movie.poster_url || '',
    backdropUrl: movie.backdrop_url || '',
    videoEmbedUrl: movie.video_embed_url || '',
    duration: movie.duration || '',
    genres: movie.genres || [],
    rating: movie.rating || 0,
    accessType: movie.access_type || 'free',
    releaseDate: movie.release_date || null,
    language: movie.language || ['English'],
  };
}

export async function getContent(type?: ContentType): Promise<ContentItem[]> {
  let movies;
  
  if (type) {
    // Use tagged template with parameter
    movies = await sql`SELECT * FROM movies WHERE type = ${type}`;
  } else {
    movies = await sql`SELECT * FROM movies`;
  }
  
  return movies.map(toContentItem);
}

export async function getContentBySlug(slug: string): Promise<ContentItem | null> {
  const movies = await sql`SELECT * FROM movies WHERE slug = ${slug}`;
  if (movies.length === 0) return null;
  return toContentItem(movies[0]);
}

export async function getContentByGenre(genre: string): Promise<ContentItem[]> {
  const movies = await sql`SELECT * FROM movies WHERE ${genre} = ANY(genres)`;
  return movies.map(toContentItem);
}

export async function searchContent(query: string): Promise<ContentItem[]> {
  const searchTerm = `%${query}%`;
  const movies = await sql`
    SELECT * FROM movies 
    WHERE title ILIKE ${searchTerm} 
    OR description ILIKE ${searchTerm}
  `;
  return movies.map(toContentItem);
}

export async function getGenres(): Promise<string[]> {
  const movies = await sql`SELECT DISTINCT UNNEST(genres) as genre FROM movies`;
  return movies.map((row: any) => row.genre).filter(Boolean);
}