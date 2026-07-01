import { getContent } from "@/lib/contentData";
import MovieCard from "@/components/movie/MovieCard";
import type { ContentItem } from "@/types/content";

function toMovie(item: ContentItem) {
  return {
    id: Number(item.id),
    title: item.title,
    posterUrl: item.posterUrl,
    backdropUrl: item.backdropUrl,
    rating: item.rating ?? 0,
    year: item.releaseDate ? new Date(item.releaseDate).getFullYear() : 0,
    duration: item.duration,
    genres: item.genres,
    description: item.description,
    quality: "HD" as const,
    type: "movie" as const,
    slug: item.slug,
  };
}

export default async function MoviesPage() {
  const moviesData = await getContent("movie");
  const movies = moviesData.map(toMovie);

  return (
    <main className="min-h-screen bg-matte-black">
      <div className="pt-24 pb-6 px-4 sm:px-6 lg:px-12 mx-auto max-w-screen-2xl">
        <div className="flex items-end gap-4">
          <h1 className="font-display text-display text-white">Movies</h1>
          {movies.length > 0 && (
            <span className="mb-1 text-body text-matte-500">
              {movies.length} title{movies.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>
      </div>

      {movies.length > 0 ? (
        <div className="px-4 sm:px-6 lg:px-12 pb-20 mx-auto max-w-screen-2xl">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-5">
            {movies.map((movie, index) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                index={index}
                slug={movie.slug}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex min-h-[40vh] items-center justify-center">
          <p className="text-body-lg text-matte-500">
            No movies available at the moment.
          </p>
        </div>
      )}
    </main>
  );
}