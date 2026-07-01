"use client";

import { useState } from "react";
import { Plus, Check } from "lucide-react";
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
      aria-label={isAdded ? "Remove from My List" : "Add to My List"}
      className={`
        flex items-center gap-2 rounded-md px-5 py-3 sm:px-6 sm:py-3.5
        text-body font-semibold border-2 transition-all duration-200 active:scale-95
        ${isLoading ? "opacity-50 cursor-not-allowed" : ""}
        ${
          isAdded
            ? "border-white/60 bg-white/20 text-white hover:bg-white/30"
            : "border-white/60 bg-white/10 text-white hover:bg-white/20"
        }
      `}
    >
      {isLoading ? (
        <div className="h-5 w-5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
      ) : isAdded ? (
        <Check size={20} strokeWidth={2.5} />
      ) : (
        <Plus size={20} strokeWidth={2.5} />
      )}
      <span>{isAdded ? "My List" : "My List"}</span>
    </button>
  );
}