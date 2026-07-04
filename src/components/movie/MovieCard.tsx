"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Star, Play } from "lucide-react";
import type { Movie } from "@/types/movie";

interface MovieCardProps {
  movie: Movie;
  index?: number;
  slug?: string;
}

export default function MovieCard({ movie, index = 0, slug }: MovieCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const router = useRouter();

  const handleClick = () => {
    const target = slug || movie.slug;
    if (target) router.push(`/movie/${target}`);
    else if (movie.type === "anime") router.push(`/anime/${movie.id}`);
    else router.push(`/movie/${movie.id}`);
  };

  const showRating = movie.rating && movie.rating > 0;
  const showYear = movie.year && movie.year > 0;

  return (
    <motion.div
      className="group relative cursor-pointer w-full"
      // Scroll-triggered entrance — fires when card enters viewport, not on page load
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{
        duration: 0.4,
        // Cap delay at 0.25s so later cards in long rows don't wait forever
        delay: Math.min(index * 0.06, 0.25),
        ease: "easeOut",
      }}
      // Subtle lift on hover — 3% scale, barely noticeable, very satisfying
      whileHover={{ scale: 1.03, transition: { duration: 0.2, ease: "easeOut" } }}
      // Physical press feel on tap
      whileTap={{ scale: 0.97, transition: { duration: 0.1 } }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      {/*
        Glow layer — sits BEHIND the card at -z-10.
        Uses crimson at 20% opacity + blur-md so it reads as
        a soft ambient light, not a visible shape.
        Only appears on hover via group-hover.
      */}
      <div className="pointer-events-none absolute -inset-1 -z-10 rounded-xl bg-crimson-DEFAULT/20 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100" />

      {/* Poster */}
      <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-matte-800">
        {!imageLoaded && (
          <div className="absolute inset-0 z-10 animate-pulse bg-matte-800" />
        )}
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
            e.currentTarget.src =
              "https://placehold.co/300x450/1a1a1a/808080?text=No+Image";
            setImageLoaded(true);
          }}
          style={{ opacity: imageLoaded ? 1 : 0 }}
          loading="lazy"
          decoding="async"
        />

        {/* Hover overlay — only on desktop */}
        <motion.div
          className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-matte-black/95 via-matte-black/40 to-transparent p-3 sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="mb-2 flex justify-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-white/10 backdrop-blur-sm">
              <Play size={16} fill="white" className="ml-0.5" />
            </div>
          </div>
          <h3 className="text-small font-semibold text-white line-clamp-1 text-center">
            {movie.title}
          </h3>
          {(showRating || showYear) && (
            <div className="mt-1 flex items-center justify-center gap-2 text-[10px] text-matte-300">
              {showRating && (
                <span className="flex items-center gap-0.5">
                  <Star size={9} className="text-gold-DEFAULT" fill="currentColor" />
                  {movie.rating}
                </span>
              )}
              {showRating && showYear && <span>·</span>}
              {showYear && <span>{movie.year}</span>}
            </div>
          )}
        </motion.div>
      </div>

      {/* Below-card label — always visible on mobile */}
      <div className="mt-2 px-0.5">
        <h3 className="text-small font-medium text-matte-300 line-clamp-1 transition-colors duration-200 group-hover:text-white">
          {movie.title}
        </h3>
        {(showYear || showRating) && (
          <div className="mt-0.5 flex items-center gap-1.5 text-[10px] text-matte-600">
            {showYear && <span>{movie.year}</span>}
            {showYear && showRating && <span>•</span>}
            {showRating && (
              <span className="flex items-center gap-1">
                <Star size={8} className="text-gold-DEFAULT" fill="currentColor" />
                {movie.rating}
              </span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}