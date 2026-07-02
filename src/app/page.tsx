import { sql } from "@/lib/db";
import AuthGate from "@/components/home/AuthGate";
import ContinueWatchingRow from "@/components/home/ContinueWatchingRow";
import Hero from "@/components/home/Hero";
import MovieRow from "@/components/home/MovieRow";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function toMovie(movie: any) {
  return {
    id: movie.id,
    slug: movie.slug,
    title: movie.title,
    posterUrl: movie.poster_url,
    backdropUrl: movie.backdrop_url,
    rating: movie.rating,
    // Use actual release_date from DB — falls back to 0 (hidden by MovieCard)
    year: movie.release_date
      ? new Date(movie.release_date).getFullYear()
      : 0,
    duration: movie.duration,
    genres: movie.genres,
    description: movie.description,
    quality: "HD" as const,
    type: "movie" as const,
  };
}

export default async function Home() {
  const [featuredMovies, trendingMovies, recommendedMovies, latestMovies] =
    await Promise.all([
      sql`SELECT * FROM movies WHERE is_featured = true ORDER BY hero_order ASC`,
      sql`SELECT * FROM movies WHERE is_trending = true ORDER BY id DESC`,
      sql`SELECT * FROM movies WHERE is_recommended = true ORDER BY id DESC`,
      // "New Additions" — most recently added, always has content
      sql`SELECT * FROM movies ORDER BY id DESC LIMIT 12`,
    ]);

  return (
    <main>
      <AuthGate />
      <Hero movies={featuredMovies.map(toMovie)} />

      <div className="relative z-20 -mt-16">
        {/* Continue Watching — only shows when user has watch history */}
        <ContinueWatchingRow />

        {/* Trending — only shown if admin has marked movies as trending */}
        {trendingMovies.length > 0 && (
          <MovieRow
            title="Trending Now"
            movies={trendingMovies.map(toMovie)}
            viewAllLink="/movies"
          />
        )}

        {/* New Additions — always shows, newest movies first */}
        <MovieRow
          title="New Additions"
          movies={latestMovies.map(toMovie)}
          viewAllLink="/movies"
        />

        {/* Recommended — only shown if admin has marked movies as recommended */}
        {recommendedMovies.length > 0 && (
          <MovieRow
            title="Recommended for You"
            movies={recommendedMovies.map(toMovie)}
            viewAllLink="/movies"
          />
        )}
      </div>
    </main>
  );
}