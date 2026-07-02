"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play, Pause, Volume2, VolumeX, Maximize, Minimize,
  ArrowLeft, SkipForward, Settings,
} from "lucide-react";
import type { Movie } from "@/types/movie";
import { useContinueWatching } from "@/hooks/useContinueWatching";

interface CustomPlayerProps {
  movie: Movie;
}

export default function CustomPlayer({ movie }: CustomPlayerProps) {
  const router = useRouter();
  const { items, loading: historyLoading, addItem, updateProgress } = useContinueWatching();

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const hideTimer = useRef<NodeJS.Timeout | null>(null);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);
  const hasAddedRef = useRef(false);
  const elapsedRef = useRef(0);
  const initializedRef = useRef(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [hoverPosition, setHoverPosition] = useState(0);

  const videoUrl = movie.videoEmbedUrl || "";
  const isWistia = videoUrl.includes("wistia.net") || videoUrl.includes("wistia.com");
  const isYouTube = videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be");
  const isVimeo = videoUrl.includes("vimeo.com");
  const isExternalEmbed = isWistia || isYouTube || isVimeo;

  // Saved progress for this movie from DB — only valid once historyLoading is false
  const savedItem = items.find((i) => i.movieId === movie.id.toString());
  const savedProgress = savedItem?.progress || 0;

  // Build the embed URL — this is where cross-device resume happens.
  // We wait for historyLoading to be false before calling this, so
  // savedProgress always contains the real DB value, not 0.
  const buildEmbedUrl = useCallback(() => {
    if (!videoUrl) return "";

    if (isWistia) {
      const match = videoUrl.match(/embed\/iframe\/([a-zA-Z0-9]+)/);
      const videoId = match?.[1];
      if (!videoId) return videoUrl;
      const base = `https://fast.wistia.net/embed/iframe/${videoId}`;
      const params = new URLSearchParams({ autoPlay: "true", endVideoBehavior: "loop" });
      // Bake resume position directly into the URL — Wistia reads ?time= on load
      if (savedProgress > 10) {
        params.set("time", String(Math.floor(savedProgress)));
      }
      return `${base}?${params.toString()}`;
    }

    if (isYouTube) {
      const separator = videoUrl.includes("?") ? "&" : "?";
      const extra = savedProgress > 10
        ? `autoplay=1&start=${Math.floor(savedProgress)}`
        : "autoplay=1";
      return `${videoUrl}${separator}${extra}`;
    }

    return videoUrl;
  }, [videoUrl, isWistia, isYouTube, savedProgress]);

  // Add to watch history once (after history has loaded so we don't double-add)
  useEffect(() => {
    if (historyLoading || hasAddedRef.current || !isExternalEmbed) return;
    hasAddedRef.current = true;
    addItem({
      movieId: movie.id.toString(),
      slug: movie.slug || movie.id.toString(),
      title: movie.title,
      posterUrl: movie.posterUrl,
      year: movie.year,
      rating: movie.rating,
      type: movie.type,
    });
  }, [historyLoading, isExternalEmbed, movie, addItem]);

  // Progress timer for external embeds — saves every 10 seconds.
  // Initialises elapsed from savedProgress so the count continues
  // from where the user left off on ANY device.
  useEffect(() => {
    if (historyLoading || !isExternalEmbed) return;

    // Only initialise once per mount so re-renders don't reset the counter
    if (!initializedRef.current) {
      elapsedRef.current = savedProgress;
      initializedRef.current = true;
    }

    const timer = setInterval(() => {
      elapsedRef.current += 10;
      updateProgress(movie.id.toString(), elapsedRef.current, {
        movieSlug: movie.slug || movie.id.toString(),
        movieTitle: movie.title,
        posterUrl: movie.posterUrl,
        duration: undefined,
      });
    }, 10000);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [historyLoading, isExternalEmbed]);

  // ── CONTROLS HIDE TIMER ───────────────────────────────────────────────
  const resetHideTimer = useCallback(() => {
    setShowControls(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    if (isPlaying) {
      hideTimer.current = setTimeout(() => setShowControls(false), 3000);
    }
  }, [isPlaying]);

  useEffect(() => {
    return () => { if (hideTimer.current) clearTimeout(hideTimer.current); };
  }, []);

  // ── DIRECT VIDEO HOOKS ────────────────────────────────────────────────
  useEffect(() => {
    if (isExternalEmbed) return;
    const saved = items.find((i) => i.movieId === movie.id.toString());
    if (saved && saved.progress > 0 && videoRef.current) {
      videoRef.current.currentTime = saved.progress;
    }
  }, [items, movie.id, isExternalEmbed]);

  useEffect(() => {
    if (isExternalEmbed) return;
    if (isPlaying && !hasAddedRef.current) {
      hasAddedRef.current = true;
      addItem({
        movieId: movie.id.toString(),
        slug: movie.slug || movie.id.toString(),
        title: movie.title,
        posterUrl: movie.posterUrl,
        year: movie.year,
        rating: movie.rating,
        type: movie.type,
      });
    }
  }, [isPlaying, movie, addItem, isExternalEmbed]);

  useEffect(() => {
    if (isExternalEmbed) return;
    if (isPlaying) {
      progressInterval.current = setInterval(() => {
        if (videoRef.current) {
          const current = Math.floor(videoRef.current.currentTime);
          const dur = Math.floor(videoRef.current.duration || 0);
          updateProgress(movie.id.toString(), current, {
            movieSlug: movie.slug || movie.id.toString(),
            movieTitle: movie.title,
            posterUrl: movie.posterUrl,
            duration: dur,
          });
        }
      }, 5000);
    }
    return () => { if (progressInterval.current) clearInterval(progressInterval.current); };
  }, [isPlaying, movie, updateProgress, isExternalEmbed]);

  useEffect(() => {
    return () => {
      if (videoRef.current && videoRef.current.currentTime > 0) {
        updateProgress(movie.id.toString(), Math.floor(videoRef.current.currentTime), {
          movieSlug: movie.slug || movie.id.toString(),
          movieTitle: movie.title,
          posterUrl: movie.posterUrl,
          duration: Math.floor(videoRef.current.duration || 0),
        });
      }
    };
  }, [movie, updateProgress]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      if (isExternalEmbed) {
        if (e.key === "Escape") goBack();
        return;
      }
      switch (e.key) {
        case " ": case "k": e.preventDefault(); togglePlay(); break;
        case "ArrowLeft": e.preventDefault(); skip(-10); break;
        case "ArrowRight": e.preventDefault(); skip(10); break;
        case "m": e.preventDefault(); setIsMuted((m) => !m); break;
        case "f": e.preventDefault(); toggleFullscreen(); break;
        case "Escape": if (isFullscreen) toggleFullscreen(); else goBack(); break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPlaying, isFullscreen, isExternalEmbed]);

  useEffect(() => {
    if (videoRef.current) videoRef.current.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  useEffect(() => {
    if (videoRef.current) videoRef.current.playbackRate = playbackSpeed;
  }, [playbackSpeed]);

  const goBack = () => {
    if (window.history.length > 1) router.back();
    else router.push("/");
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) videoRef.current.pause();
    else videoRef.current.play().catch(() => {});
    setIsPlaying(!isPlaying);
    resetHideTimer();
  };

  const skip = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds;
      setCurrentTime(videoRef.current.currentTime);
      resetHideTimer();
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      setIsLoading(false);
      const saved = items.find((i) => i.movieId === movie.id.toString());
      if (saved && saved.progress > 5 && saved.progress < videoRef.current.duration - 10) {
        videoRef.current.currentTime = saved.progress;
      }
      videoRef.current.play().catch(() => setIsLoading(false));
      setIsPlaying(true);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current || !videoRef.current || duration === 0) return;
    e.stopPropagation();
    const rect = progressRef.current.getBoundingClientRect();
    const fraction = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    videoRef.current.currentTime = fraction * duration;
    setCurrentTime(fraction * duration);
    resetHideTimer();
  };

  const handleProgressHover = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current || duration === 0) return;
    const rect = progressRef.current.getBoundingClientRect();
    const fraction = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setHoverTime(fraction * duration);
    setHoverPosition(e.clientX - rect.left);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
    resetHideTimer();
  };

  const formatTime = (seconds: number): string => {
    if (isNaN(seconds) || seconds < 0) return "0:00";
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    if (hrs > 0) return `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const formatTimeLabel = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];

  // ── SHOW LOADING SPINNER WHILE HISTORY LOADS ──────────────────────────
  // Critical: don't render the iframe until we have the saved position.
  // This is what makes cross-device resume work.
  if (historyLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-black">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-crimson-DEFAULT" />
          <p className="text-caption text-matte-500">Loading...</p>
        </div>
      </div>
    );
  }

  // ── EXTERNAL EMBED (Wistia / YouTube / Vimeo) ─────────────────────────
  if (isExternalEmbed) {
    const embedUrl = buildEmbedUrl();

    return (
      <div className="relative h-screen w-screen bg-black" ref={containerRef}>
        {/* Resume indicator — shown briefly if we're resuming */}
        {savedProgress > 10 && (
          <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 rounded-full bg-black/80 px-4 py-2 text-caption text-white backdrop-blur-sm">
            Resuming from {formatTimeLabel(savedProgress)}
          </div>
        )}

        <iframe
          src={embedUrl}
          className="absolute inset-0 h-full w-full"
          allowFullScreen
          allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
          onLoad={() => setIsLoading(false)}
        />

        {isLoading && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-black pointer-events-none">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-crimson-DEFAULT" />
          </div>
        )}

        {/* Back button — always visible */}
        <button
          onClick={goBack}
          className="absolute top-4 left-4 z-50 flex items-center gap-2 rounded-lg bg-black/80 px-4 py-2.5 text-white backdrop-blur-md transition-colors hover:bg-black"
        >
          <ArrowLeft size={18} />
          <span className="text-sm font-medium">Back</span>
        </button>

        {/* Title — top right */}
        <div className="absolute top-4 right-4 z-50 text-right pointer-events-none">
          <p className="text-small text-white/50">Now Playing</p>
          <h2 className="font-display text-xl text-white drop-shadow-lg max-w-xs truncate">
            {movie.title}
          </h2>
        </div>
      </div>
    );
  }

  // ── DIRECT VIDEO PLAYER (MP4) ─────────────────────────────────────────
  const savedItemForVideo = items.find((i) => i.movieId === movie.id.toString());
  const hasSavedProgress = savedItemForVideo && savedItemForVideo.progress > 30;

  return (
    <div
      ref={containerRef}
      className="relative h-screen w-screen bg-black overflow-hidden select-none"
      onMouseMove={resetHideTimer}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      {hasError && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black">
          <div className="text-center px-6">
            <p className="font-display text-heading-1 text-white mb-4">{movie.title}</p>
            <p className="text-body text-matte-400 mb-8">Video failed to load.</p>
            <button
              onClick={goBack}
              className="flex items-center gap-2 mx-auto rounded-lg bg-crimson-DEFAULT px-6 py-3 text-body font-semibold text-white hover:bg-crimson-dark"
            >
              <ArrowLeft size={18} /> Go Back
            </button>
          </div>
        </div>
      )}

      {!hasError && videoUrl && (
        <video
          ref={videoRef}
          src={videoUrl}
          className="absolute inset-0 h-full w-full object-contain bg-black cursor-pointer"
          onLoadedMetadata={handleLoadedMetadata}
          onTimeUpdate={() => { if (videoRef.current) setCurrentTime(videoRef.current.currentTime); }}
          onEnded={() => setIsPlaying(false)}
          onWaiting={() => setIsLoading(true)}
          onPlaying={() => setIsLoading(false)}
          onError={() => { setIsLoading(false); setHasError(true); }}
          onClick={(e) => { e.stopPropagation(); togglePlay(); }}
          playsInline
          preload="auto"
        />
      )}

      {isLoading && !hasError && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/50 pointer-events-none">
          <div className="h-14 w-14 animate-spin rounded-full border-4 border-white/20 border-t-crimson-DEFAULT" />
        </div>
      )}

      {hasSavedProgress && !isPlaying && !isLoading && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 text-center">
          <p className="text-caption text-matte-400 mb-3">
            Resume from {formatTime(savedItemForVideo!.progress)}?
          </p>
          <button
            onClick={() => {
              if (videoRef.current && savedItemForVideo) {
                videoRef.current.currentTime = savedItemForVideo.progress;
                videoRef.current.play().catch(() => {});
                setIsPlaying(true);
              }
            }}
            className="rounded-lg bg-crimson-DEFAULT px-6 py-3 text-body font-semibold text-white hover:bg-crimson-dark"
          >
            Resume
          </button>
        </div>
      )}

      <AnimatePresence>
        {showControls && !hasError && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/80 to-transparent px-4 sm:px-8 pt-4 pb-12"
          >
            <div className="flex items-center justify-between">
              <button onClick={goBack} className="flex items-center gap-2 text-white hover:text-crimson-DEFAULT transition-colors">
                <ArrowLeft size={20} />
                <span className="text-caption font-medium">Back</span>
              </button>
              <div className="text-right">
                <p className="text-caption text-matte-400">Now Playing</p>
                <h2 className="font-display text-heading-3 text-white">{movie.title}</h2>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!isPlaying && showControls && !isLoading && !hasError && !hasSavedProgress && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            onClick={(e) => { e.stopPropagation(); togglePlay(); }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex h-20 w-20 items-center justify-center rounded-full bg-crimson-DEFAULT/90 text-white shadow-glow-lg hover:scale-110 transition-transform"
          >
            <Play size={32} fill="white" className="ml-1" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showControls && !hasError && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/95 via-black/50 to-transparent px-4 sm:px-8 pb-4 sm:pb-6 pt-16"
          >
            <div
              ref={progressRef}
              onClick={handleProgressClick}
              onMouseMove={handleProgressHover}
              onMouseLeave={() => setHoverTime(null)}
              className="group relative mb-3 h-1.5 w-full cursor-pointer rounded-full bg-white/20 hover:h-2.5 transition-all"
            >
              <div className="absolute top-0 left-0 h-full w-full rounded-full bg-white/20" />
              <div className="absolute top-0 left-0 h-full rounded-full bg-crimson-DEFAULT" style={{ width: `${progress}%` }} />
              <div
                className="absolute top-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-white opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ left: `${progress}%`, marginLeft: "-8px" }}
              />
              {hoverTime !== null && (
                <div
                  className="absolute bottom-full mb-2 -translate-x-1/2 rounded bg-black/90 px-2 py-1 text-caption text-white whitespace-nowrap pointer-events-none"
                  style={{ left: `${hoverPosition}px` }}
                >
                  {formatTime(hoverTime)}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button onClick={(e) => { e.stopPropagation(); togglePlay(); }} className="text-white hover:scale-110 transition-transform">
                  {isPlaying ? <Pause size={22} fill="white" /> : <Play size={22} fill="white" />}
                </button>
                <button onClick={(e) => { e.stopPropagation(); skip(-10); }} className="hidden sm:flex items-center text-white/70 hover:text-white">
                  <SkipForward size={16} className="rotate-180" /><span className="text-caption ml-0.5">10</span>
                </button>
                <button onClick={(e) => { e.stopPropagation(); skip(10); }} className="hidden sm:flex items-center text-white/70 hover:text-white">
                  <SkipForward size={16} /><span className="text-caption ml-0.5">10</span>
                </button>
                <div className="hidden sm:flex items-center gap-2">
                  <button onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }} className="text-white/70 hover:text-white">
                    {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
                  </button>
                  <input
                    type="range" min="0" max="1" step="0.05" value={isMuted ? 0 : volume}
                    onChange={(e) => { setVolume(Number(e.target.value)); setIsMuted(false); }}
                    onClick={(e) => e.stopPropagation()}
                    className="w-20 h-1 appearance-none bg-white/30 rounded-full cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                  />
                </div>
                <span className="text-caption text-white/80 tabular-nums font-medium">
                  <span className="text-white">{formatTime(currentTime)}</span>
                  <span className="text-white/40 mx-1">/</span>
                  <span className="text-white/60">{formatTime(duration)}</span>
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <button
                    onClick={(e) => { e.stopPropagation(); setShowSpeedMenu(!showSpeedMenu); }}
                    className="flex items-center gap-1 text-white/70 hover:text-white"
                  >
                    <Settings size={16} />
                    <span className="text-caption hidden sm:inline">{playbackSpeed}x</span>
                  </button>
                  {showSpeedMenu && (
                    <div className="absolute bottom-full right-0 mb-2 rounded-lg border border-white/10 bg-black/90 backdrop-blur-md py-1">
                      {speeds.map((s) => (
                        <button
                          key={s}
                          onClick={(e) => { e.stopPropagation(); setPlaybackSpeed(s); setShowSpeedMenu(false); }}
                          className={`block w-full px-4 py-2 text-left text-caption hover:bg-white/10 ${playbackSpeed === s ? "text-crimson-DEFAULT" : "text-white"}`}
                        >
                          {s}x
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <button onClick={(e) => { e.stopPropagation(); toggleFullscreen(); }} className="text-white/70 hover:text-white">
                  {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}