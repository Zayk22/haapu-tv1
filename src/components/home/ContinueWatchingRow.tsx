"use client";

import { useContinueWatching } from "@/hooks/useContinueWatching";
import MovieCard from "@/components/movie/MovieCard";

export default function ContinueWatchingRow() {
  const { items, loading } = useContinueWatching();

  // Only show movies that have progress > 0
  const watchedMovies = items.filter(item => item.progress > 0);

  if (loading) {
    return (
      <section className="py-6">
        <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-12">
          <div className="mb-4 h-8 w-48 animate-pulse rounded bg-matte-800" />
          <div className="flex gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-[160px] flex-shrink-0 animate-pulse rounded-lg bg-matte-800 aspect-[2/3]" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (watchedMovies.length === 0) {
    return null;
  }

  // Convert to Movie format for MovieCard - FIXED duration type
  const movies = watchedMovies.map(item => ({
    id: parseInt(item.movieId) || 0,
    title: item.movieTitle,
    posterUrl: item.posterUrl,
    slug: item.movieSlug,
    rating: 0,
    year: new Date().getFullYear(),
    duration: typeof item.duration === 'number' ? `${item.duration}s` : (item.duration || ""),
    genres: [],
    type: "movie" as const,
  }));

  return (
    <section className="py-6 sm:py-8">
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-12">
        <h2 className="font-display text-heading-3 sm:text-heading-2 font-semibold text-white mb-4">
          Continue Watching
        </h2>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {movies.map((movie, index) => (
            <div key={movie.id} className="relative w-[160px] flex-shrink-0 sm:w-[200px]">
              <MovieCard movie={movie} index={index} slug={movie.slug} />
              {/* Progress bar */}
              {watchedMovies[index] && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-matte-800 rounded-b-lg overflow-hidden">
                  <div 
                    className="h-full bg-crimson-DEFAULT transition-all duration-300"
                    style={{ width: `${Math.min((watchedMovies[index].progress / 100) * 100, 100)}%` }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}