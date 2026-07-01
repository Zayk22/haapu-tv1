"use client";

import { useContinueWatching } from "@/hooks/useContinueWatching";
import MovieCard from "@/components/movie/MovieCard";

export default function ContinueWatchingRow() {
  const { items, loading } = useContinueWatching();

  const watchedMovies = items.filter((item) => item.progress > 5);

  if (loading) {
    return (
      <section className="py-6 sm:py-8">
        <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-12">
          <div className="mb-4 h-7 w-52 animate-pulse rounded bg-matte-800" />
          <div className="flex gap-3 sm:gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-[140px] sm:w-[170px] flex-shrink-0 animate-pulse rounded-lg bg-matte-800 aspect-[2/3]"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (watchedMovies.length === 0) return null;

  const movies = watchedMovies.map((item) => ({
    id: parseInt(item.movieId) || 0,
    title: item.movieTitle,
    posterUrl: item.posterUrl,
    slug: item.movieSlug,
    rating: 0,
    year: new Date().getFullYear(),
    duration:
      typeof item.duration === "number" && item.duration > 0
        ? `${Math.floor(item.duration / 60)}m`
        : "",
    genres: [],
    type: "movie" as const,
  }));

  return (
    <section className="py-6 sm:py-8">
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-12">
        <h2 className="font-display text-heading-3 sm:text-heading-2 font-semibold text-white mb-4">
          Continue Watching
        </h2>
        <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 no-scrollbar">
          {movies.map((movie, index) => {
            const watchItem = watchedMovies[index];
            const progressPct =
              watchItem.duration && watchItem.duration > 0
                ? Math.min(
                    (watchItem.progress / watchItem.duration) * 100,
                    100
                  )
                : Math.min(watchItem.progress, 100);

            return (
              <div
                key={`${movie.id}-${index}`}
                className="relative w-[140px] flex-shrink-0 sm:w-[170px]"
              >
                <MovieCard movie={movie} index={index} slug={movie.slug} />
                <div className="absolute bottom-[2.25rem] sm:bottom-[2.5rem] left-0 right-0 h-1 bg-matte-700 overflow-hidden rounded-b">
                  <div
                    className="h-full bg-crimson-DEFAULT transition-all duration-300"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}