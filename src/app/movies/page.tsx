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
    slug: item.slug, // ✅ ADD THIS LINE
  };
}

export default async function MoviesPage() {
  const moviesData = await getContent("movie");
  const movies = moviesData.map(toMovie);

  return (
    <main className="min-h-screen pt-24">
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-12 mb-8">
        <h1 className="font-display text-display text-white">Movies</h1>
        <p className="mt-2 text-body-lg text-matte-500">
          Explore our full movie catalog.
        </p>
      </div>

      {movies.length > 0 ? (
        <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-12">
          <div className="flex gap-4 overflow-x-auto pb-8 no-scrollbar">
            {movies.map((movie, index) => (
              <div key={movie.id} className="w-[160px] flex-shrink-0 sm:w-[200px] lg:w-[220px]">
                <MovieCard
                  movie={movie}
                  index={index}
                  slug={movie.slug}
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex min-h-[30vh] items-center justify-center">
          <p className="text-body-lg text-matte-600">No movies available at the moment.</p>
        </div>
      )}
    </main>
  );
}