import { sql } from "@/lib/db";
import AuthGate from "@/components/home/AuthGate";
import ContinueWatchingRow from "@/components/home/ContinueWatchingRow";
import Hero from "@/components/home/Hero";
import MovieRow from "@/components/home/MovieRow";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function toMovie(movie: any) {
  return {
    id: movie.id,
    slug: movie.slug,
    title: movie.title,
    posterUrl: movie.poster_url,
    backdropUrl: movie.backdrop_url,
    rating: movie.rating,
    year: new Date().getFullYear(),
    duration: movie.duration,
    genres: movie.genres,
    description: movie.description,
    quality: "HD" as const,
    type: "movie" as const,
  };
}

export default async function Home() {
  // Get ALL movies
  const allMovies = await sql`SELECT * FROM movies ORDER BY id`;
  
  // Get ALL featured movies (NO LIMIT!)
  const featuredMovies = await sql`
    SELECT * FROM movies 
    WHERE is_featured = true 
    ORDER BY hero_order ASC
  `;
  
  // Get trending movies
  const trendingMovies = await sql`
    SELECT * FROM movies 
    WHERE is_trending = true
  `;
  
  // Get recommended movies
  const recommendedMovies = await sql`
    SELECT * FROM movies 
    WHERE is_recommended = true
  `;

  // DEBUG LOGS - NOW INSIDE THE COMPONENT
  console.log("=== HOMEPAGE DEBUG ===");
  console.log("Featured movies count:", featuredMovies.length);
  console.log("Featured movies:", featuredMovies.map(m => ({ id: m.id, title: m.title, is_featured: m.is_featured })));

  return (
    <main>
      <AuthGate />
      <Hero movies={featuredMovies.map(toMovie)} />

      <div className="relative z-20 -mt-16">
        <ContinueWatchingRow />
        
        <MovieRow title="Trending Now" movies={trendingMovies.map(toMovie)} viewAllLink="/movies" />
        <MovieRow title="Popular on Haapu" movies={allMovies.map(toMovie)} viewAllLink="/movies" />
        <MovieRow title="Recommended for You" movies={recommendedMovies.map(toMovie)} viewAllLink="/movies" />
      </div>
    </main>
  );
}