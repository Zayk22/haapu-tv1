"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Play, Clock, Calendar, Star } from "lucide-react";

interface FeaturedMovieProps {
  title: string;
  description: string;
  videoId: string;
  posterUrl: string;
  backdropUrl?: string;
  year?: number;
  rating?: number;
  duration?: string;
  genre?: string;
  slug?: string;
  showLabel?: boolean;
}

export default function FeaturedMovie({
  title,
  description,
  videoId,
  posterUrl,
  backdropUrl,
  year,
  rating,
  duration,
  genre,
  slug,
  showLabel = true,
}: FeaturedMovieProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const embedUrl = `https://fast.wistia.net/embed/iframe/${videoId}?autoPlay=true`;

  return (
    <section className="relative overflow-hidden px-6 py-24 sm:px-12 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-20 items-stretch">
          
          {/* Left - Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col justify-center order-2 lg:order-1"
          >
            {/* Label - Conditionally shown */}
            {showLabel && (
              <div
                className="mb-4 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 w-fit"
                style={{
                  borderColor: "rgba(212,175,55,0.3)",
                  backgroundColor: "rgba(212,175,55,0.08)",
                }}
              >
                <span
                  className="text-xs font-medium uppercase tracking-widest"
                  style={{ color: "#D4AF37" }}
                >
                  Featured Film
                </span>
              </div>
            )}

            {/* Title */}
            <h2 className="font-display text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
              {title}
            </h2>

            {/* Metadata */}
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-white/50">
              {year && (
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} />
                  {year}
                </span>
              )}
              {duration && (
                <span className="flex items-center gap-1.5">
                  <Clock size={14} />
                  {duration}
                </span>
              )}
              {rating && rating > 0 && (
                <span className="flex items-center gap-1.5">
                  <Star size={14} style={{ color: "#D4AF37" }} fill="currentColor" />
                  {rating.toFixed(1)}
                </span>
              )}
              {genre && (
                <span className="text-white/40">{genre}</span>
              )}
            </div>

            {/* Description */}
            <p className="mt-4 text-base leading-relaxed text-white/70 sm:text-lg">
              {description}
            </p>

            {/* CTA Buttons - Watch Now only shows when showLabel is true */}
            <div className="mt-6 flex flex-wrap gap-3">
              {showLabel && (
                <Link
                  href={`/movie/${slug || title.toLowerCase().replace(/\s+/g, '-')}`}
                  className="inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:opacity-90 hover:scale-105"
                  style={{ backgroundColor: "#E50914" }}
                >
                  <Play size={16} fill="currentColor" />
                  Watch Now
                </Link>
              )}
              <Link
                href="/covenant"
                className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-6 py-3 text-sm font-semibold text-white/80 transition-all duration-300 hover:border-white/40 hover:text-white"
              >
                Become a Member
              </Link>
            </div>
          </motion.div>

          {/* Right - Video Player */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="order-1 lg:order-2"
          >
            <div className="relative overflow-hidden rounded-2xl shadow-2xl aspect-video bg-black/50 border border-white/10">
              {/* Poster/Thumbnail before playback */}
              {!isPlaying && (
                <div 
                  className="absolute inset-0 z-10 cursor-pointer"
                  onClick={() => setIsPlaying(true)}
                >
                  <img
                    src={posterUrl}
                    alt={`${title} poster`}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "https://placehold.co/1280x720/1a1a1a/D4AF37?text=African+Rhapsody";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div 
                      className="flex h-20 w-20 items-center justify-center rounded-full bg-crimson/90 text-white shadow-2xl transition-transform duration-300 hover:scale-110"
                      style={{ backgroundColor: "#E50914" }}
                    >
                      <Play size={32} fill="white" className="ml-1" />
                    </div>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                    <p className="text-sm font-medium text-white/80">▶ Click to play</p>
                    <p className="text-xs text-white/40">{title}</p>
                  </div>
                </div>
              )}

              {/* Wistia Player */}
              {isPlaying && (
                <div className="absolute inset-0">
                  <iframe
                    src={embedUrl}
                    className="h-full w-full"
                    allowFullScreen
                    allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
                    onLoad={() => setIsLoading(false)}
                  />
                  
                  {isLoading && (
                    <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/80">
                      <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-crimson" />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Player caption */}
            <p className="mt-2 text-center text-xs text-white/30">
              {isPlaying ? 'Now playing' : 'Click play to watch the trailer'} • Haapu Original
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}