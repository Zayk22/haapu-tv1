import { Metadata } from "next";
import Link from "next/link";
import { Tv } from "lucide-react";
import { getContent } from "@/lib/contentData";
import MovieCard from "@/components/movie/MovieCard";
import type { ContentItem } from "@/types/content";

export const metadata: Metadata = {
  title: "TV Shows | Haapu TV",
  description: "Browse our collection of TV shows on Haapu TV.",
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
    type: "tv" as const,
    slug: item.slug,
  };
}

export default async function TVShowsPage() {
  const tvShows = await getContent("tv_show");

  return (
    <main className="min-h-screen bg-matte-black">
      <div className="pt-24 pb-6 px-4 sm:px-6 lg:px-12 mx-auto max-w-screen-2xl">
        <div className="flex items-end gap-4">
          <h1 className="font-display text-display text-white">TV Shows</h1>
          {tvShows.length > 0 && (
            <span className="mb-1 text-body text-matte-500">
              {tvShows.length} title{tvShows.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>
      </div>

      {tvShows.length > 0 ? (
        <div className="px-4 sm:px-6 lg:px-12 pb-20 mx-auto max-w-screen-2xl">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-5">
            {tvShows.map((item, index) => (
              <MovieCard
                key={item.id}
                movie={toMovie(item)}
                index={index}
                slug={item.slug}
              />
            ))}
          </div>
        </div>
      ) : (
        // Coming soon state — looks intentional, not broken
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-matte-800 mb-6">
            <Tv size={36} className="text-matte-500" />
          </div>
          <h2 className="font-display text-heading-1 text-white mb-3">
            Coming Soon
          </h2>
          <p className="text-body text-matte-500 max-w-sm mb-8">
            We're adding TV shows to Haapu TV. Check back soon for series and
            episodic content.
          </p>
          <Link
            href="/movies"
            className="rounded-lg bg-crimson-DEFAULT px-8 py-3 text-body font-semibold text-white transition-colors hover:bg-crimson-dark"
          >
            Browse Movies Instead
          </Link>
        </div>
      )}
    </main>
  );
}