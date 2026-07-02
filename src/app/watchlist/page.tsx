"use client";

import { useWatchlist } from "@/hooks/useWatchlist";
import Link from "next/link";
import { Bookmark, Trash2, Play, ChevronLeft } from "lucide-react";

export default function WatchlistPage() {
  const { watchlist, loading, remove } = useWatchlist();

  if (loading) {
    return (
      <main className="min-h-screen bg-matte-black pt-24 pb-24">
        <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-12">
          {/* Back link skeleton */}
          <div className="mb-6 h-4 w-20 animate-pulse rounded bg-matte-800" />
          <div className="mb-8">
            <div className="h-10 w-36 animate-pulse rounded bg-matte-800" />
            <div className="mt-2 h-5 w-24 animate-pulse rounded bg-matte-800" />
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="aspect-[2/3] animate-pulse rounded-lg bg-matte-800"
              />
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-matte-black pt-24 pb-24 lg:pb-8">
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-12">

        {/* Back to Home — always visible, one tap away */}
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-1.5 text-caption text-matte-500 transition-colors hover:text-white"
        >
          <ChevronLeft size={16} />
          Back to Home
        </Link>

        {/* Page header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="font-display text-display text-white">My List</h1>
            <p className="mt-1 text-body text-matte-500">
              {watchlist.length === 0
                ? "Movies you save will appear here"
                : `${watchlist.length} title${watchlist.length !== 1 ? "s" : ""} saved`}
            </p>
          </div>
          {watchlist.length > 0 && (
            <Link
              href="/movies"
              className="inline-flex items-center gap-2 rounded-lg border border-matte-700 px-5 py-2.5 text-caption font-medium text-matte-300 transition-colors hover:border-matte-500 hover:text-white"
            >
              Browse More Movies
            </Link>
          )}
        </div>

        {/* Empty state */}
        {watchlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-matte-800 mb-6">
              <Bookmark size={36} className="text-matte-600" />
            </div>
            <h2 className="font-display text-heading-1 text-white mb-3">
              Your list is empty
            </h2>
            <p className="text-body text-matte-500 max-w-sm mb-8">
              Browse movies and tap the{" "}
              <span className="text-white font-medium">+ My List</span> button
              on any title to save it here.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/movies"
                className="rounded-lg bg-crimson-DEFAULT px-8 py-3 text-body font-semibold text-white transition-colors hover:bg-crimson-dark"
              >
                Browse Movies
              </Link>
              <Link
                href="/"
                className="rounded-lg border border-matte-700 px-8 py-3 text-body font-medium text-matte-300 transition-colors hover:border-matte-500 hover:text-white"
              >
                Go Home
              </Link>
            </div>
          </div>
        ) : (
          /* Movie grid */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-5">
            {watchlist.map((item) => (
              <div key={item.id} className="group relative">
                <Link href={`/movie/${item.movie_slug}`}>
                  <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-matte-800 transition-transform duration-300 group-hover:scale-105">
                    <img
                      src={item.poster_url}
                      alt={item.movie_title}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://placehold.co/300x450/1a1a1a/808080?text=No+Image";
                      }}
                    />
                    {/* Play overlay on hover */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-white bg-white/10 backdrop-blur-sm">
                        <Play size={20} fill="white" className="ml-0.5" />
                      </div>
                    </div>
                  </div>
                  <h3 className="mt-2 line-clamp-1 text-small font-medium text-matte-300 group-hover:text-white transition-colors">
                    {item.movie_title}
                  </h3>
                </Link>

                {/* Remove button — visible on hover */}
                <button
                  onClick={() => remove(item.movie_id)}
                  className="absolute right-1.5 top-1.5 rounded-full bg-black/70 p-1.5 text-white opacity-0 transition-all duration-200 hover:bg-crimson-DEFAULT group-hover:opacity-100"
                  aria-label="Remove from list"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}