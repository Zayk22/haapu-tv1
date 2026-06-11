import { Metadata } from "next";
import { getContent } from "@/lib/contentData";
import MovieCard from "@/components/movie/MovieCard";
import type { ContentItem } from "@/types/content";

export const metadata: Metadata = {
  title: "Movies | Happu TV",
  description: "Browse our collection of movies.",
};

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
    type: "movie" as const, // Simply force everything to "movie"
  };
}

export default async function MoviesPage() {
  const movies = await getContent("movie");

  return (
    <main className="min-h-screen pt-24">
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-12 mb-8">
        <h1 className="font-display text-display text-white">Movies</h1>
        <p className="mt-2 text-body-lg text-matte-500">
          Explore our full movie catalog.
        </p>
      </div>
      {movies.length > 0 ? (
        <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 pb-12">
          {movies.map((item, index) => (
            <MovieCard
              key={item.id}
              movie={toMovie(item)}
              index={index}
              slug={item.slug}
            />
          ))}
        </div>
      ) : (
        <div className="flex min-h-[30vh] items-center justify-center">
          <p className="text-body-lg text-matte-600">No movies available at the moment.</p>
        </div>
      )}
    </main>
  );
}