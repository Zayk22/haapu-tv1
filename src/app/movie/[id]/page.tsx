import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Play, Star, Clock, ChevronLeft } from "lucide-react";
import { getContentBySlug, getContent } from "@/lib/contentData";
import MovieRow from "@/components/home/MovieRow";
import WatchlistButton from "@/components/movie/WatchlistButton";
import type { ContentItem } from "@/types/content";

function toMovie(item: ContentItem) {
  return {
    id: Number(item.id),
    title: item.title,
    posterUrl: item.posterUrl,
    backdropUrl: item.backdropUrl,
    rating: item.rating ?? 0,
    year: 0,
    duration: item.duration,
    genres: item.genres,
    description: item.description,
    quality: "HD" as const,
    type: "movie" as const,
    slug: item.slug,
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const movie = await getContentBySlug(id);
  if (!movie) return { title: "Movie Not Found | Haapu TV" };
  return {
    title: `${movie.title} | Haapu TV`,
    description: movie.description,
    openGraph: {
      title: movie.title,
      description: movie.description || "",
      images: [movie.posterUrl],
    },
  };
}

export default async function MovieDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [movie, allMovies] = await Promise.all([
    getContentBySlug(id),
    getContent("movie"),
  ]);

  if (!movie) notFound();

  const relatedMovies = allMovies
    .filter((m) => m.slug !== movie.slug)
    .slice(0, 12);

  const movieForWatchlist = toMovie(movie);

  return (
    <main className="bg-matte-black min-h-screen">

      {/*
        Hero height:
        Mobile  → 65vh  (shorter = less zoom-in on object-cover, less cropping)
        Desktop → 100vh (full cinematic hero)
        min-h-[500px] ensures it never collapses on tiny screens.
      */}
      <section className="relative w-full h-[65vh] sm:h-screen min-h-[500px] max-h-[900px] flex flex-col justify-end">

        {/* Backdrop — mobile uses poster (portrait), desktop uses backdrop (landscape) */}
        {movie.backdropUrl || movie.posterUrl ? (
          <div className="absolute inset-0 z-0">
            {/* Mobile: poster — portrait image, better fit for tall narrow screens */}
            <img
              src={movie.posterUrl || movie.backdropUrl}
              alt={movie.title}
              className="block sm:hidden h-full w-full object-cover object-[center_15%]"
            />
            {/* Desktop: backdrop — wide landscape image */}
            <img
              src={movie.backdropUrl || movie.posterUrl}
              alt={movie.title}
              className="hidden sm:block h-full w-full object-cover object-[center_20%]"
            />
          </div>
        ) : (
          <div className="absolute inset-0 z-0 bg-gradient-to-br from-matte-900 to-matte-black" />
        )}

        {/* Gradient overlays */}
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-matte-black via-matte-black/60 to-transparent" />
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-matte-black/90 via-matte-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-48 z-10 bg-gradient-to-t from-matte-black to-transparent" />

        {/* Back button */}
        <Link
          href="/movies"
          className="absolute top-20 left-4 sm:left-8 lg:left-12 z-20 flex items-center gap-1.5 text-white/70 hover:text-white transition-colors duration-200"
        >
          <ChevronLeft size={22} />
          <span className="text-caption font-medium">Movies</span>
        </Link>

        {/* Hero content */}
        <div className="relative z-20 px-4 sm:px-8 lg:px-16 pb-8 sm:pb-16 max-w-3xl">

          {movie.genres.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {movie.genres.map((genre) => (
                <span
                  key={genre}
                  className="text-small text-matte-300 uppercase tracking-widest font-medium"
                >
                  {genre}
                </span>
              ))}
            </div>
          )}

          <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl text-white leading-tight mb-3">
            {movie.title}
          </h1>

          <div className="flex flex-wrap items-center gap-3 mb-4 text-small sm:text-caption text-matte-300">
            {movie.rating > 0 && (
              <span className="flex items-center gap-1 text-white font-semibold">
                <Star size={13} className="text-yellow-400" fill="currentColor" />
                {movie.rating}
              </span>
            )}
            {movie.duration && (
              <>
                <span className="text-matte-600">•</span>
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  {movie.duration}
                </span>
              </>
            )}
            <span className="rounded border border-matte-600 px-2 py-0.5 text-small text-matte-400 uppercase tracking-wide">
              {movie.accessType === "free" ? "Free" : "Premium"}
            </span>
            <span className="rounded border border-matte-600 px-2 py-0.5 text-small text-matte-400">
              HD
            </span>
          </div>

          {movie.description && (
            <p className="text-caption sm:text-body text-matte-200 leading-relaxed line-clamp-2 sm:line-clamp-3 lg:line-clamp-none max-w-2xl mb-6">
              {movie.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3">
            {movie.videoEmbedUrl ? (
              <Link
                href={`/watch/title/${movie.slug}`}
                className="flex items-center gap-2.5 rounded-md bg-white px-6 py-3 sm:px-8 sm:py-3.5 text-body font-bold text-matte-black shadow-lg transition-all duration-200 hover:bg-white/85 active:scale-95"
              >
                <Play size={20} fill="currentColor" />
                Play
              </Link>
            ) : (
              <button
                disabled
                className="flex items-center gap-2.5 rounded-md bg-matte-700 px-6 py-3 text-body font-bold text-matte-400 cursor-not-allowed"
              >
                <Play size={20} fill="currentColor" />
                Not Available
              </button>
            )}
            <WatchlistButton movie={movieForWatchlist} />
          </div>
        </div>
      </section>

      {relatedMovies.length > 0 && (
        <section className="pb-20">
          <MovieRow
            title="More Like This"
            movies={relatedMovies.map(toMovie)}
            viewAllLink="/movies"
          />
        </section>
      )}
    </main>
  );
}