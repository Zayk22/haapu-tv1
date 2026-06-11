"use client";

import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
  };
}

export default function MoviesPage() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [movies, setMovies] = useState<any[]>([]);

  useEffect(() => {
    getContent("movie").then(data => {
      setMovies(data.map(toMovie));
    });
  }, []);

  const checkScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    setCanScrollLeft(container.scrollLeft > 10);
    const isAtEnd = container.scrollLeft + container.clientWidth >= container.scrollWidth - 10;
    setCanScrollRight(!isAtEnd);
  };

  const scroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const scrollAmount = container.clientWidth * 0.7;
    const targetScroll = direction === "left"
      ? container.scrollLeft - scrollAmount
      : container.scrollLeft + scrollAmount;
    container.scrollTo({ left: targetScroll, behavior: "smooth" });
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    container.addEventListener("scroll", checkScroll);
    checkScroll();
    return () => container.removeEventListener("scroll", checkScroll);
  }, [movies]);

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
          <div className="relative group">
            {canScrollLeft && (
              <button
                onClick={() => scroll("left")}
                className="absolute -left-3 top-1/2 z-20 -translate-y-1/2 hidden sm:flex h-12 w-12 items-center justify-center rounded-full bg-matte-900/90 text-white shadow-elevated backdrop-blur-sm transition-all hover:scale-110"
              >
                <ChevronLeft size={24} />
              </button>
            )}

            <div
              ref={scrollContainerRef}
              className="flex gap-4 overflow-x-auto scrollbar-hide pb-8"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
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

            {canScrollRight && (
              <button
                onClick={() => scroll("right")}
                className="absolute -right-3 top-1/2 z-20 -translate-y-1/2 hidden sm:flex h-12 w-12 items-center justify-center rounded-full bg-matte-900/90 text-white shadow-elevated backdrop-blur-sm transition-all hover:scale-110"
              >
                <ChevronRight size={24} />
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="flex min-h-[30vh] items-center justify-center">
          <p className="text-body-lg text-matte-600">No movies available at the moment.</p>
        </div>
      )}

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </main>
  );
}