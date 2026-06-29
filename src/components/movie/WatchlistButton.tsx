"use client";

import { useState } from "react";
import { Bookmark } from "lucide-react";
import { useWatchlist } from "@/hooks/useWatchlist";
import type { Movie } from "@/types/movie";

interface WatchlistButtonProps {
  movie: Movie;
}

export default function WatchlistButton({ movie }: WatchlistButtonProps) {
  const { isAdded, toggle } = useWatchlist(movie.id.toString());
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      await toggle({
        movieId: movie.id.toString(),
        slug: movie.slug || movie.id.toString(),
        title: movie.title,
        posterUrl: movie.posterUrl,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
        isAdded
          ? "border-crimson-DEFAULT bg-crimson-DEFAULT/10 text-crimson-DEFAULT hover:bg-crimson-DEFAULT/20"
          : "border-matte-700 text-matte-300 hover:border-matte-500 hover:text-white"
      } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
      aria-label={isAdded ? "Remove from watchlist" : "Add to watchlist"}
    >
      <Bookmark size={18} fill={isAdded ? "currentColor" : "none"} />
      <span>{isLoading ? "..." : (isAdded ? "In Watchlist" : "Add to Watchlist")}</span>
    </button>
  );
}