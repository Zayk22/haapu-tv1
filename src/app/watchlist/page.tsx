"use client";

import { useWatchlist } from "@/hooks/useWatchlist";
import Link from "next/link";
import { Bookmark, Trash2 } from "lucide-react";

export default function WatchlistPage() {
  const { watchlist, loading, remove } = useWatchlist();

  if (loading) {
    return (
      <main className="min-h-screen pt-24">
        <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-12">
          <div className="flex items-center justify-center h-64">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-matte-700 border-t-crimson-DEFAULT" />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-24">
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-display text-display text-white">My Watchlist</h1>
            <p className="mt-2 text-body-lg text-matte-500">
              {watchlist.length === 0 
                ? "Your watchlist is empty. Start adding movies you want to watch!" 
                : `${watchlist.length} movies saved`}
            </p>
          </div>
          {watchlist.length > 0 && (
            <Link
              href="/movies"
              className="rounded-lg bg-crimson-DEFAULT px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-crimson-dark"
            >
              Browse Movies
            </Link>
          )}
        </div>

        {watchlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-matte-800 bg-matte-900 p-12 text-center">
            <Bookmark size={48} className="text-matte-600" />
            <p className="mt-4 text-body text-matte-400">Your watchlist is empty</p>
            <Link
              href="/movies"
              className="mt-6 rounded-lg bg-crimson-DEFAULT px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-crimson-dark"
            >
              Browse Movies
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {watchlist.map((item) => (
              <div key={item.id} className="group relative">
                <Link href={`/movie/${item.movie_slug}`}>
                  <div className="overflow-hidden rounded-lg bg-matte-800 transition-transform duration-300 group-hover:scale-105">
                    <img
                      src={item.poster_url}
                      alt={item.movie_title}
                      className="aspect-[2/3] w-full object-cover"
                    />
                  </div>
                  <h3 className="mt-2 line-clamp-1 text-sm font-medium text-white">
                    {item.movie_title}
                  </h3>
                </Link>
                <button
                  onClick={() => remove(item.movie_id)}
                  className="absolute right-2 top-2 rounded-full bg-black/70 p-1.5 text-white opacity-0 transition-opacity hover:bg-red-600 group-hover:opacity-100"
                  aria-label="Remove from watchlist"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}