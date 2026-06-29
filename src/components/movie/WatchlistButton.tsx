"use client";

import { Bookmark } from "lucide-react";
import { useWatchlist } from "@/hooks/useWatchlist";
import { useToast } from "@/contexts/ToastContext";
import type { Movie } from "@/types/movie";

interface WatchlistButtonProps {
  movie: Movie;
}

export default function WatchlistButton({ movie }: WatchlistButtonProps) {
  const { isAdded, toggle } = useWatchlist(movie.id.toString());
  const { showToast } = useToast();

  const handleClick = () => {
    toggle({
      movieId: movie.id.toString(),
      slug: movie.slug || movie.id.toString(),
      title: movie.title,
      posterUrl: movie.posterUrl,
    });
    
    if (!isAdded) {
      showToast({
        message: `Added "${movie.title}" to your watchlist`,
        type: "success",
      });
    } else {
      showToast({
        message: `Removed "${movie.title}" from your watchlist`,
        type: "info",
      });
    }
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-2 rounded-lg border border-matte-700 px-4 py-2 text-sm font-medium text-matte-300 transition-all hover:border-matte-500 hover:text-white"
      aria-label={isAdded ? "Remove from watchlist" : "Add to watchlist"}
    >
      <Bookmark size={18} fill={isAdded ? "currentColor" : "none"} />
      <span>{isAdded ? "In Watchlist" : "Add to Watchlist"}</span>
    </button>
  );
}