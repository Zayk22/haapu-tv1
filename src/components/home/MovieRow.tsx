"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import MovieCard from "@/components/movie/MovieCard";
import type { MovieRowProps } from "@/types/movie";

export default function MovieRow({
  title,
  movies,
  isLoading = false,
  viewAllLink,
}: MovieRowProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isHovering, setIsHovering] = useState(false);

  const checkScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    setCanScrollLeft(container.scrollLeft > 10);
    const isAtEnd =
      container.scrollLeft + container.clientWidth >=
      container.scrollWidth - 10;
    setCanScrollRight(!isAtEnd);
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    container.addEventListener("scroll", checkScroll);
    checkScroll();
    return () => container.removeEventListener("scroll", checkScroll);
  }, [checkScroll]);

  const scroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const scrollAmount = container.clientWidth * 0.7;
    const targetScroll =
      direction === "left"
        ? container.scrollLeft - scrollAmount
        : container.scrollLeft + scrollAmount;
    container.scrollTo({ left: targetScroll, behavior: "smooth" });
  };

  if (isLoading) {
    return (
      <section className="py-6 sm:py-8">
        <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-12">
          <div className="mb-4 h-8 w-48 animate-pulse rounded bg-matte-800" />
          <div className="flex gap-3 overflow-hidden">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="w-[130px] sm:w-[160px] lg:w-[190px] flex-shrink-0 aspect-[2/3] animate-pulse rounded-lg bg-matte-800"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!movies || movies.length === 0) return null;

  return (
    <section
      className="py-6 sm:py-8"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-12">
        {/* Row header */}
        <div className="mb-3 sm:mb-4 flex items-center justify-between">
          <h2 className="font-display text-heading-3 sm:text-heading-2 font-semibold text-white">
            {title}
          </h2>
          {viewAllLink && (
            <Link
              href={viewAllLink}
              className="text-caption font-medium text-matte-500 transition-colors duration-300 hover:text-crimson-DEFAULT"
            >
              View All
            </Link>
          )}
        </div>

        <div className="relative group/row">
          {/* Left scroll button */}
          {canScrollLeft && (
            <button
              onClick={() => scroll("left")}
              className={`absolute -left-3 top-0 z-20 hidden sm:flex h-full w-12 items-center justify-center transition-all duration-300 ${
                isHovering ? "opacity-100" : "opacity-0"
              }`}
              aria-label="Scroll left"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-matte-900/90 text-white shadow-elevated backdrop-blur-sm transition-transform duration-300 hover:scale-110">
                <ChevronLeft size={20} />
              </div>
            </button>
          )}

          {/* Cards — each card gets a FIXED width so they're all identical regardless of image */}
          <div
            ref={scrollContainerRef}
            className="no-scrollbar flex gap-3 overflow-x-auto scroll-smooth pb-4"
          >
            {movies
              .filter((movie) => movie && movie.id && movie.posterUrl)
              .map((movie, index) => (
                <div
                  key={movie.id}
                  className="w-[130px] sm:w-[160px] lg:w-[190px] flex-shrink-0"
                >
                  <MovieCard movie={movie} index={index} slug={movie.slug} />
                </div>
              ))}
          </div>

          {/* Right scroll button */}
          {canScrollRight && (
            <button
              onClick={() => scroll("right")}
              className={`absolute -right-3 top-0 z-20 hidden sm:flex h-full w-12 items-center justify-center transition-all duration-300 ${
                isHovering ? "opacity-100" : "opacity-0"
              }`}
              aria-label="Scroll right"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-matte-900/90 text-white shadow-elevated backdrop-blur-sm transition-transform duration-300 hover:scale-110">
                <ChevronRight size={20} />
              </div>
            </button>
          )}

          <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-8 bg-gradient-to-r from-matte-950 to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-8 bg-gradient-to-l from-matte-950 to-transparent" />
        </div>
      </div>
    </section>
  );
}