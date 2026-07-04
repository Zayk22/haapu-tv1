"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Star, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import type { Movie } from "@/types/movie";
import WatchlistButton from "@/components/movie/WatchlistButton";

interface HeroProps {
  movies: (Movie | null)[];
}

export default function Hero({ movies }: HeroProps) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
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

  // Native touch listeners — the only reliable way to get swipe
  // when Framer Motion AnimatePresence is in the tree
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    let startX = 0;
    const onTouchStart = (e: TouchEvent) => { startX = e.changedTouches[0].clientX; };
    const onTouchEnd = (e: TouchEvent) => {
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) { diff > 0 ? goNext() : goPrev(); }
    };
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, [goNext, goPrev]);

  if (validMovies.length === 0) {
    return (
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-matte-black via-matte-950 to-matte-900" />
        <div className="relative z-10 text-center px-6">
          <h1 className="font-display text-display text-white">Welcome to Haapu TV</h1>
          <p className="mt-4 text-matte-400">No featured content available.</p>
        </div>
      </section>
    );
  }

  const movie = validMovies[currentIndex];

  return (
    <section ref={sectionRef} className="bg-matte-black">

      {/* ═══════════════════════════════════════════════════
          MOBILE LAYOUT
          Image in a 16:9 container — landscape backdrop
          images fill it with ZERO cropping. Portrait-only
          images (SINACH, Body Praise) show their top portion
          where faces are. Content sits cleanly below.
          Arrows live inside the image. Swipe also works.
      ══════════════════════════════════════════════════ */}
      <div className="sm:hidden">

        {/* Image — aspect-video = exactly 16:9 = no crop for landscape images */}
        <div className="relative w-full aspect-video overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentIndex}
              src={movie.backdropUrl || movie.posterUrl}
              alt=""
              className="absolute inset-0 h-full w-full object-cover object-top"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
            />
          </AnimatePresence>

          {/* Fade to dark at bottom — connects image to content section */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-matte-black" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />

          {/* Arrows inside image — above gradient, can't overlap content */}
          {validMovies.length > 1 && (
            <>
              <button
                onClick={goPrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm active:scale-95"
                aria-label="Previous"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={goNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm active:scale-95"
                aria-label="Next"
              >
                <ChevronRight size={16} />
              </button>
            </>
          )}
        </div>

        {/* Content — below image, always readable, never overlaps */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            className="px-4 pt-3 pb-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <span className="text-[10px] font-semibold uppercase tracking-widest text-gold-soft">
              Featured
            </span>

            <h1 className="mt-1 font-display text-2xl leading-tight text-white">
              {movie.title}
            </h1>

            <p className="mt-1.5 text-caption text-matte-400 line-clamp-2 leading-relaxed">
              {movie.description}
            </p>

            <div className="mt-2 flex flex-wrap items-center gap-2 text-small text-matte-500">
              {movie.rating > 0 && (
                <span className="flex items-center gap-1">
                  <Star size={11} className="text-gold-DEFAULT" fill="currentColor" />
                  <span className="text-white font-medium">{movie.rating}</span>
                </span>
              )}
              {movie.duration && (
                <span className="flex items-center gap-1">
                  <Clock size={11} className="text-matte-600" />
                  {movie.duration}
                </span>
              )}
              {movie.quality && (
                <span className="rounded border border-matte-700 px-1.5 py-px text-matte-500">
                  {movie.quality}
                </span>
              )}
            </div>

            {/* ✅ FIXED: Side by side — Watch Now takes most space, My List is compact */}
            <div className="mt-4 flex flex-row items-center gap-2.5">
              <button
                onClick={() => { if (movie.slug) router.push(`/movie/${movie.slug}`); }}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-crimson-DEFAULT py-3 text-body font-semibold text-white active:scale-[0.98] transition-transform"
              >
                <Play size={18} fill="currentColor" />
                Watch Now
              </button>
              <WatchlistButton movie={movie} />
            </div>

            {/* Dots — below buttons, inside section, never overlaps Continue Watching */}
            {validMovies.length > 1 && (
              <div className="mt-4 flex items-center justify-center gap-2">
                {validMovies.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goTo(index)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      index === currentIndex
                        ? "w-6 bg-crimson-DEFAULT"
                        : "w-1.5 bg-matte-700 hover:bg-matte-500"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ═══════════════════════════════════════════════════
          DESKTOP LAYOUT — full cinematic hero, unchanged
      ══════════════════════════════════════════════════ */}
      <div className="relative hidden min-h-screen items-center overflow-hidden sm:flex">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            className="absolute inset-0 z-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <img
              src={movie.backdropUrl || movie.posterUrl}
              alt=""
              className="h-full w-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-matte-black via-matte-black/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-matte-black/90 via-matte-black/30 to-transparent" />
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute left-1/3 top-1/4 h-96 w-96 rounded-full bg-gold-DEFAULT opacity-[0.03] blur-[120px]" />
          <div className="absolute right-1/4 bottom-1/3 h-64 w-64 rounded-full bg-crimson-DEFAULT opacity-[0.04] blur-[100px]" />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            className="relative z-10 mx-auto w-full max-w-screen-2xl px-6 lg:px-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <div className="max-w-2xl">
              <span className="inline-block rounded-full border border-gold-DEFAULT/30 bg-gold-DEFAULT/10 px-4 py-1.5 text-small font-medium uppercase tracking-wider text-gold-soft">
                Featured
              </span>

              <h1 className="mt-6 font-display text-display lg:text-hero leading-none text-white">
                {movie.title}
              </h1>

              <p className="mt-6 max-w-lg text-body-lg leading-relaxed text-matte-300 line-clamp-3">
                {movie.description}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-6 text-caption text-matte-500">
                {movie.rating > 0 && (
                  <div className="flex items-center gap-1.5">
                    <Star size={14} className="text-gold-DEFAULT" fill="currentColor" />
                    <span className="font-medium text-white">{movie.rating}</span>
                  </div>
                )}
                {movie.duration && (
                  <div className="flex items-center gap-1.5">
                    <Clock size={14} className="text-matte-600" />
                    <span>{movie.duration}</span>
                  </div>
                )}
                {movie.quality && (
                  <span className="rounded border border-matte-700 px-1.5 py-0.5 text-small text-matte-400">
                    {movie.quality}
                  </span>
                )}
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => { if (movie.slug) router.push(`/movie/${movie.slug}`); }}
                  className="flex items-center gap-2.5 rounded-lg bg-crimson-DEFAULT px-8 py-3.5 text-body font-semibold text-white shadow-glow-lg transition-colors hover:bg-crimson-dark"
                >
                  <Play size={18} fill="currentColor" />
                  Watch Now
                </button>
                <WatchlistButton movie={movie} />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Desktop arrows */}
        {validMovies.length > 1 && (
          <>
            <button
              onClick={goPrev}
              className="absolute left-8 top-1/2 -translate-y-1/2 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-all hover:bg-black/80 hover:scale-110"
              aria-label="Previous"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={goNext}
              className="absolute right-8 top-1/2 -translate-y-1/2 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-all hover:bg-black/80 hover:scale-110"
              aria-label="Next"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}

        {/* Desktop dots */}
        {validMovies.length > 1 && (
          <div className="absolute bottom-10 left-0 right-0 z-20 flex justify-center gap-2">
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
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 z-10 h-32 bg-gradient-to-t from-matte-950 to-transparent" />
      </div>
    </section>
  );
}