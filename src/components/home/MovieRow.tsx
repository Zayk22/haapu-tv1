"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import MovieCard from "@/components/movie/MovieCard";
import type { Movie } from "@/types/movie";

interface MovieRowProps {
  title: string;
  movies: Movie[];
  viewAllLink?: string;
}

export default function MovieRow({ title, movies, viewAllLink }: MovieRowProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isHovering, setIsHovering] = useState(false);

  const checkScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    setCanScrollLeft(container.scrollLeft > 10);
    setCanScrollRight(
      container.scrollLeft + container.clientWidth < container.scrollWidth - 10
    );
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
    const amount = container.clientWidth * 0.7;
    container.scrollTo({
      left: container.scrollLeft + (direction === "left" ? -amount : amount),
      behavior: "smooth",
    });
  };

  if (!movies || movies.length === 0) return null;

  return (
    <motion.section
      className="py-6 sm:py-8"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.4 }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-12">

        <motion.div
          className="mb-3 sm:mb-4 flex items-center justify-between"
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <h2 className="font-display text-heading-3 sm:text-heading-2 font-semibold text-white">
            {title}
          </h2>
          {viewAllLink && (
            <Link
              href={viewAllLink}
              className="text-caption font-medium text-matte-500 transition-colors duration-200 hover:text-crimson-DEFAULT"
            >
              View All
            </Link>
          )}
        </motion.div>

        <div className="relative group/row">
          {/* Left scroll button */}
          {canScrollLeft && (
            <button
              onClick={() => scroll("left")}
              className={`absolute -left-3 top-0 z-20 hidden sm:flex h-full w-12 items-center justify-center transition-opacity duration-200 ${
                isHovering ? "opacity-100" : "opacity-0"
              }`}
              aria-label="Scroll left"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-matte-900/90 text-white shadow-elevated backdrop-blur-sm hover:scale-110 transition-transform">
                <ChevronLeft size={20} />
              </div>
            </button>
          )}

          {/* Cards */}
          <div
            ref={scrollContainerRef}
            className="no-scrollbar flex gap-3 overflow-x-auto scroll-smooth pb-2"
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
              className={`absolute -right-3 top-0 z-20 hidden sm:flex h-full w-12 items-center justify-center transition-opacity duration-200 ${
                isHovering ? "opacity-100" : "opacity-0"
              }`}
              aria-label="Scroll right"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-matte-900/90 text-white shadow-elevated backdrop-blur-sm hover:scale-110 transition-transform">
                <ChevronRight size={20} />
              </div>
            </button>
          )}

          {/* Edge fade gradients */}
          <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-6 bg-gradient-to-r from-matte-950 to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-6 bg-gradient-to-l from-matte-950 to-transparent" />
        </div>
      </div>
    </motion.section>
  );
}