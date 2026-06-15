import { sql } from "@/lib/db";
import MovieTableClient from "./MovieTableClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminMoviesPage() {
  const movies = await sql`
    SELECT 
      id::text, 
      slug, 
      title, 
      poster_url as "posterUrl", 
      backdrop_url as "backdropUrl",
      description,
      duration,
      genres,
      rating,
      is_featured,
      is_trending,
      is_recommended
    FROM movies 
    ORDER BY id
  `;
  
  const formattedMovies = movies.map(movie => ({
    id: movie.id,
    slug: movie.slug,
    title: movie.title,
    posterUrl: movie.posterUrl,
    backdropUrl: movie.backdropUrl,
    description: movie.description,
    duration: movie.duration,
    genres: movie.genres,
    rating: movie.rating,
    is_featured: movie.is_featured ?? false,
    is_trending: movie.is_trending ?? false,
    is_recommended: movie.is_recommended ?? false,
  }));

  return <MovieTableClient movies={formattedMovies} />;
}