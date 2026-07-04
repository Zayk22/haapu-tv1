"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Star, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import type { Movie } from "@/types/movie";
import WatchlistButton from "@/components/movie/WatchlistButton";

interface HeroProps {
  movies: (Movie | null)[];
}

export default function Hero({ movies }: HeroProps) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const validMovies = movies.filter((m): m is Movie => m !== null);

  useEffect(() => {
    if (validMovies.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % validMovies.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [validMovies.length]);

  const goTo = useCallback((index: number) => setCurrentIndex(index), []);

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % validMovies.length);
  }, [validMovies.length]);

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + validMovies.length) % validMovies.length);
  }, [validMovies.length]);

  if (validMovies.length === 0) {
    return (
      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-matte-black via-matte-950 to-matte-900" />
        <div className="relative z-10 text-center px-6">
          <h1 className="font-display text-display text-white">Welcome to Haapu TV</h1>
          <p className="mt-4 text-body-lg text-matte-400">No featured content available.</p>
        </div>
      </section>
    );
  }

  const movie = validMovies[currentIndex];
  const mobileImage = movie.posterUrl || movie.backdropUrl;
  const desktopImage = movie.backdropUrl || movie.posterUrl;

  return (
    <section className="relative flex min-h-screen flex-col overflow-hidden">

      {/* ── BACKGROUND ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          className="absolute inset-0 z-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/*
            MOBILE — blurred background technique:
            Layer 1: heavily blurred + scaled poster fills the entire hero
                     with the movie's color palette. No crop is visible
                     because at blur-3xl you can't see edges.
            Layer 2: sharp poster in object-contain positioned toward the top
                     so the face is always fully visible, never cropped.
            This works for every image regardless of orientation or subject position.
          */}
          {mobileImage && (
            <div className="sm:hidden absolute inset-0">
              {/* Blurred ambient fill */}
              <img
                src={mobileImage}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 h-full w-full object-cover scale-125 blur-3xl opacity-70"
              />
              {/* Dark overlay so blurred bg doesn't overpower */}
              <div className="absolute inset-0 bg-matte-black/40" />
              {/* Sharp poster — object-contain = zero cropping */}
              <img
                src={mobileImage}
                alt=""
                className="absolute inset-0 h-full w-full object-contain"
                style={{ objectPosition: "center 8%" }}
              />
            </div>
          )}

          {/* DESKTOP — wide backdrop, object-cover works fine on landscape */}
          {desktopImage && (
            <img
              src={desktopImage}
              alt=""
              className="hidden sm:block h-full w-full object-cover object-center"
            />
          )}

          {/* Gradient overlays — same on both */}
          <div className="absolute inset-0 bg-gradient-to-t from-matte-black via-matte-black/65 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-matte-black/80 via-matte-black/20 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Ambient glow */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute left-1/3 top-1/4 h-96 w-96 rounded-full bg-gold-DEFAULT opacity-[0.03] blur-[120px]" />
        <div className="absolute right-1/4 bottom-1/3 h-64 w-64 rounded-full bg-crimson-DEFAULT opacity-[0.04] blur-[100px]" />
      </div>

      {/*
        ── CONTENT ──
        flex-1 + flex-col + justify-end pushes everything to the bottom.
        No absolute positioning means arrows can never overlap text.
      */}
      <div className="relative z-10 flex flex-1 flex-col justify-end">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            className="mx-auto w-full max-w-screen-2xl px-4 sm:px-6 lg:px-20 pt-24"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <div className="max-w-2xl">
              <span className="inline-block rounded-full border border-gold-DEFAULT/30 bg-gold-DEFAULT/10 px-3 py-1 sm:px-4 sm:py-1.5 text-small font-medium uppercase tracking-wider text-gold-soft">
                Featured
              </span>

              <h1 className="mt-3 sm:mt-6 font-display text-display lg:text-hero leading-none text-white">
                {movie.title}
              </h1>

              {/* Description hidden on mobile to save space */}
              <p className="mt-4 sm:mt-6 max-w-lg text-body sm:text-body-lg leading-relaxed text-matte-300 hidden sm:block line-clamp-3">
                {movie.description}
              </p>

              <div className="mt-3 sm:mt-6 flex flex-wrap items-center gap-3 sm:gap-6 text-small sm:text-caption text-matte-500">
                {movie.rating > 0 && (
                  <div className="flex items-center gap-1.5">
                    <Star size={13} className="text-gold-DEFAULT" fill="currentColor" />
                    <span className="font-medium text-white">{movie.rating}</span>
                  </div>
                )}
                {movie.duration && (
                  <div className="flex items-center gap-1.5">
                    <Calendar size={13} className="text-matte-600" />
                    <span>{movie.duration}</span>
                  </div>
                )}
                {movie.quality && (
                  <span className="rounded border border-matte-700 px-1.5 py-0.5 text-small text-matte-400">
                    {movie.quality}
                  </span>
                )}
              </div>

              <div className="mt-5 sm:mt-8 flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-3 sm:gap-4">
                <button
                  onClick={() => {
                    const slug = movie.slug || validMovies[currentIndex]?.slug;
                    if (slug) router.push(`/movie/${slug}`);
                  }}
                  className="flex items-center gap-2.5 rounded-lg bg-crimson-DEFAULT px-6 sm:px-8 py-3 sm:py-3.5 text-body font-semibold text-white shadow-glow-lg transition-colors duration-300 hover:bg-crimson-dark w-full sm:w-auto justify-center"
                >
                  <Play size={18} fill="currentColor" />
                  Watch Now
                </button>
                <WatchlistButton movie={movie} />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/*
          ── NAVIGATION ROW ──
          Arrows + dots in a single row at the bottom.
          Physically below all content so overlap is impossible.
        */}
        {validMovies.length > 1 && (
          <div className="flex items-center justify-center gap-3 py-6 sm:py-8 px-4">
            <button
              onClick={goPrev}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-all hover:bg-white/20 active:scale-95"
              aria-label="Previous"
            >
              <ChevronLeft size={18} />
            </button>

            {validMovies.map((_, index) => (
              <button
                key={index}
                onClick={() => goTo(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "w-8 bg-crimson-DEFAULT"
                    : "w-2 bg-matte-600 hover:bg-matte-500"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}

            <button
              onClick={goNext}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-all hover:bg-white/20 active:scale-95"
              aria-label="Next"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-[5] h-24 bg-gradient-to-t from-matte-950 to-transparent" />
    </section>
  );
}