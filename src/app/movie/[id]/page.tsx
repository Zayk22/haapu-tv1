import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Play, Plus, Star, Clock, ChevronLeft } from "lucide-react";
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
    year: 2026,
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

      {/* ── HERO ── full viewport height, backdrop fills the screen */}
      <section className="relative w-full h-screen min-h-[600px] max-h-[900px] flex flex-col justify-end">

        {/* Backdrop image */}
        {movie.backdropUrl ? (
          <div className="absolute inset-0 z-0">
            <img
              src={movie.backdropUrl}
              alt={movie.title}
              className="h-full w-full object-cover object-center"
            />
          </div>
        ) : (
          <div className="absolute inset-0 z-0 bg-gradient-to-br from-matte-900 to-matte-black" />
        )}

        {/* Gradient overlays — same technique Netflix uses */}
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-matte-black via-matte-black/50 to-transparent" />
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-matte-black/90 via-matte-black/30 to-transparent" />
        {/* Stronger fade at the very bottom so content is always readable */}
        <div className="absolute bottom-0 left-0 right-0 h-48 z-10 bg-gradient-to-t from-matte-black to-transparent" />

        {/* Back button — top left */}
        <Link
          href="/movies"
          className="absolute top-20 left-4 sm:left-8 lg:left-12 z-20 flex items-center gap-1.5 text-white/70 hover:text-white transition-colors duration-200"
        >
          <ChevronLeft size={22} />
          <span className="text-caption font-medium">Movies</span>
        </Link>

        {/* Hero content — bottom left */}
        <div className="relative z-20 px-4 sm:px-8 lg:px-16 pb-12 sm:pb-16 max-w-3xl">

          {/* Genre pills */}
          {movie.genres.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
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

          {/* Title */}
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-white leading-tight mb-4">
            {movie.title}
          </h1>

          {/* Metadata row */}
          <div className="flex flex-wrap items-center gap-3 mb-5 text-small sm:text-caption text-matte-300">
            {movie.rating > 0 && (
              <span className="flex items-center gap-1 text-white font-semibold">
                <Star size={14} className="text-yellow-400" fill="currentColor" />
                {movie.rating}
              </span>
            )}
            {movie.rating > 0 && movie.duration && (
              <span className="text-matte-600">•</span>
            )}
            {movie.duration && (
              <span className="flex items-center gap-1">
                <Clock size={13} />
                {movie.duration}
              </span>
            )}
            {movie.duration && (
              <span className="text-matte-600">•</span>
            )}
            <span className="rounded border border-matte-600 px-2 py-0.5 text-small text-matte-400 uppercase tracking-wide">
              {movie.accessType === "free" ? "Free" : "Premium"}
            </span>
            <span className="rounded border border-matte-600 px-2 py-0.5 text-small text-matte-400">
              HD
            </span>
          </div>

          {/* Description — limited to 3 lines on mobile, more on desktop */}
          {movie.description && (
            <p className="text-body text-matte-200 leading-relaxed line-clamp-3 sm:line-clamp-4 lg:line-clamp-none max-w-2xl mb-8">
              {movie.description}
            </p>
          )}

          {/* Action Buttons — Netflix style: white Play + outlined Watchlist */}
          <div className="flex flex-wrap items-center gap-3">
            {movie.videoEmbedUrl ? (
              <Link
                href={`/watch/title/${movie.slug}`}
                className="flex items-center gap-2.5 rounded-md bg-white px-7 py-3 sm:px-8 sm:py-3.5 text-body font-bold text-matte-black shadow-lg transition-all duration-200 hover:bg-white/85 active:scale-95"
              >
                <Play size={20} fill="currentColor" />
                Play
              </Link>
            ) : (
              <button
                disabled
                className="flex items-center gap-2.5 rounded-md bg-matte-700 px-7 py-3 sm:px-8 sm:py-3.5 text-body font-bold text-matte-400 cursor-not-allowed"
              >
                <Play size={20} fill="currentColor" />
                Not Available
              </button>
            )}

            {/* Watchlist button — now uses the existing WatchlistButton but styled inline */}
            <WatchlistButton movie={movieForWatchlist} />
          </div>
        </div>
      </section>

      {/* ── MORE LIKE THIS ── */}
      {relatedMovies.length > 0 && (
        <section className="pb-20">
          <MovieRow
            title="More Like This"
            movies={relatedMovies.map(toMovie)}
          />
        </section>
      )}
    </main>
  );
}
