"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
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

// Extend window for Wistia globals
declare global {
  interface Window {
    _wq: any[];
    Wistia: any;
  }
}

export default function CustomPlayer({ movie }: CustomPlayerProps) {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const hideTimer = useRef<NodeJS.Timeout | null>(null);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);
  const hasAddedRef = useRef(false);
  const wistiaRef = useRef<any>(null);
  const itemsRef = useRef<any[]>([]);

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
  const [wistiaReady, setWistiaReady] = useState(false);

  const { items, updateProgress, addItem } = useContinueWatching();

  // Keep itemsRef in sync so Wistia onReady callback can read latest items
  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  const videoUrl = movie.videoEmbedUrl || "";

  // Extract Wistia video ID — switches from dumb iframe to inline embed
  // so we get real JS API access (seek, timechange events, duration)
  const wistiaVideoId = useMemo(() => {
    const match = videoUrl.match(
      /(?:embed\/iframe\/|medias\/|wistia\.com\/medias\/)([a-zA-Z0-9]+)/
    );
    return match?.[1] || null;
  }, [videoUrl]);

  const isWistia = Boolean(wistiaVideoId);
  // YouTube/Vimeo stay as iframes — only Wistia gets the inline treatment
  const isExternalIframe =
    !isWistia &&
    (videoUrl.includes("youtube.com") ||
      videoUrl.includes("youtu.be") ||
      videoUrl.includes("vimeo.com"));

  // ── ADD TO WATCH HISTORY ON MOUNT ─────────────────────────────────────
  useEffect(() => {
    if (hasAddedRef.current) return;
    if (isWistia || isExternalIframe) {
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
  }, [isWistia, isExternalIframe, movie, addItem]);

  // ── WISTIA INLINE EMBED SETUP ─────────────────────────────────────────
  // This is the key cross-device sync fix. Inline embed gives us the
  // Wistia JS API so we can:
  //   1. Read the actual video position (not just wall-clock time)
  //   2. Seek to the saved DB position when the video loads
  useEffect(() => {
    if (!isWistia || !wistiaVideoId) return;

    // Load Wistia E-v1.js once per page
    const scriptId = "wistia-ev1";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "//fast.wistia.com/assets/external/E-v1.js";
      script.async = true;
      document.head.appendChild(script);
    }

    window._wq = window._wq || [];
    window._wq.push({
      id: wistiaVideoId,
      onReady: (video: any) => {
        wistiaRef.current = video;
        setIsLoading(false);
        setWistiaReady(true);

        // Seek to the progress saved in our DB — this is the sync magic
        const saved = itemsRef.current.find(
          (i) => i.movieId === movie.id.toString()
        );
        if (saved && saved.progress > 10) {
          // Small delay ensures the player is fully initialised before seek
          setTimeout(() => {
            video.time(saved.progress);
          }, 400);
        }

        // Also update our UI state as the video plays
        video.bind("timechange", (t: number) => {
          setCurrentTime(Math.floor(t));
        });

        video.bind("play", () => setIsPlaying(true));
        video.bind("pause", () => setIsPlaying(false));
        video.bind("end", () => setIsPlaying(false));

        video.bind("durationchange", (d: number) => {
          setDuration(Math.floor(d));
        });
      },
    });

    return () => {
      try {
        wistiaRef.current?.unbind("timechange");
        wistiaRef.current?.unbind("play");
        wistiaRef.current?.unbind("pause");
        wistiaRef.current?.unbind("end");
        wistiaRef.current?.unbind("durationchange");
      } catch {}
    };
  }, [isWistia, wistiaVideoId, movie.id]);

  // ── WISTIA PROGRESS SAVE ──────────────────────────────────────────────
  // Save actual video position to DB every 10 seconds
  // This is what the OTHER device reads when resuming
  useEffect(() => {
    if (!isWistia || !wistiaReady) return;

    const interval = setInterval(() => {
      if (!wistiaRef.current) return;
      try {
        const currentPos = Math.floor(wistiaRef.current.time());
        const totalDur = Math.floor(wistiaRef.current.duration?.() || 0);
        if (currentPos > 5) {
          updateProgress(movie.id.toString(), currentPos, {
            movieSlug: movie.slug || movie.id.toString(),
            movieTitle: movie.title,
            posterUrl: movie.posterUrl,
            duration: totalDur || undefined,
          });
        }
      } catch {}
    }, 10000);

    return () => clearInterval(interval);
  }, [isWistia, wistiaReady, movie, updateProgress]);

  // ── FALLBACK EXTERNAL IFRAME PROGRESS TIMER (YouTube/Vimeo) ──────────
  useEffect(() => {
    if (!isExternalIframe) return;
    let elapsed = 0;
    const timer = setInterval(() => {
      elapsed += 10;
      updateProgress(movie.id.toString(), elapsed, {
        movieSlug: movie.slug || movie.id.toString(),
        movieTitle: movie.title,
        posterUrl: movie.posterUrl,
        duration: undefined,
      });
    }, 10000);
    return () => clearInterval(timer);
  }, [isExternalIframe, movie, updateProgress]);

  // ── DIRECT VIDEO HOOKS ────────────────────────────────────────────────
  useEffect(() => {
    if (isWistia || isExternalIframe) return;
    const saved = items.find((item) => item.movieId === movie.id.toString());
    if (saved && saved.progress > 0 && videoRef.current) {
      videoRef.current.currentTime = saved.progress;
    }
  }, [items, movie.id, isWistia, isExternalIframe]);

  useEffect(() => {
    if (isWistia || isExternalIframe) return;
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
  }, [isPlaying, movie, addItem, isWistia, isExternalIframe]);

  useEffect(() => {
    if (isWistia || isExternalIframe) return;
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
    return () => {
      if (progressInterval.current) clearInterval(progressInterval.current);
    };
  }, [isPlaying, movie, updateProgress, isWistia, isExternalIframe]);

  useEffect(() => {
    return () => {
      if (videoRef.current && videoRef.current.currentTime > 0) {
        updateProgress(
          movie.id.toString(),
          Math.floor(videoRef.current.currentTime),
          {
            movieSlug: movie.slug || movie.id.toString(),
            movieTitle: movie.title,
            posterUrl: movie.posterUrl,
            duration: Math.floor(videoRef.current.duration || 0),
          }
        );
      }
    };
  }, [movie, updateProgress]);

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      setIsLoading(false);
      const saved = items.find((item) => item.movieId === movie.id.toString());
      if (
        saved &&
        saved.progress > 5 &&
        saved.progress < videoRef.current.duration - 10
      ) {
        videoRef.current.currentTime = saved.progress;
      }
      videoRef.current.play().catch(() => setIsLoading(false));
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) setCurrentTime(videoRef.current.currentTime);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const resetHideTimer = useCallback(() => {
    setShowControls(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    if (isPlaying) {
      hideTimer.current = setTimeout(() => setShowControls(false), 3000);
    }
  }, [isPlaying]);

  useEffect(() => {
    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      switch (e.key) {
        case " ": case "k": e.preventDefault(); togglePlay(); break;
        case "ArrowLeft": e.preventDefault(); skip(-10); break;
        case "ArrowRight": e.preventDefault(); skip(10); break;
        case "m": e.preventDefault(); setIsMuted((m) => !m); break;
        case "f": e.preventDefault(); toggleFullscreen(); break;
        case "Escape":
          if (isFullscreen) toggleFullscreen(); else goBack(); break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPlaying, isFullscreen]);

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
    if (isWistia && wistiaRef.current) {
      if (isPlaying) wistiaRef.current.pause();
      else wistiaRef.current.play();
      return;
    }
    if (!videoRef.current) return;
    if (isPlaying) videoRef.current.pause();
    else videoRef.current.play().catch(() => {});
    setIsPlaying(!isPlaying);
    resetHideTimer();
  };

  const skip = (seconds: number) => {
    if (isWistia && wistiaRef.current) {
      const newTime = Math.max(0, wistiaRef.current.time() + seconds);
      wistiaRef.current.time(newTime);
      setCurrentTime(Math.floor(newTime));
      return;
    }
    if (videoRef.current) {
      videoRef.current.currentTime += seconds;
      setCurrentTime(videoRef.current.currentTime);
      resetHideTimer();
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current || duration === 0) return;
    e.stopPropagation();
    const rect = progressRef.current.getBoundingClientRect();
    const fraction = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const newTime = fraction * duration;
    if (isWistia && wistiaRef.current) {
      wistiaRef.current.time(newTime);
    } else if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
    setCurrentTime(newTime);
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
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];

  // ── WISTIA INLINE EMBED ───────────────────────────────────────────────
  if (isWistia && wistiaVideoId) {
    return (
      <div
        className="relative h-screen w-screen bg-black overflow-hidden"
        ref={containerRef}
        onMouseMove={resetHideTimer}
      >
        {/* Wistia inline embed — NOT an iframe, gives us full JS API */}
        <div
          className={`wistia_embed wistia_async_${wistiaVideoId} videoFoam=true`}
          style={{ position: "absolute", inset: 0, height: "100%", width: "100%" }}
        />

        {/* Back button */}
        <AnimatePresence>
          {showControls && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/70 to-transparent px-4 pt-4 pb-12"
            >
              <div className="flex items-center justify-between">
                <button
                  onClick={goBack}
                  className="flex items-center gap-2 text-white hover:text-crimson-DEFAULT transition-colors"
                >
                  <ArrowLeft size={20} />
                  <span className="text-caption font-medium">Back</span>
                </button>
                <div className="text-right">
                  <p className="text-caption text-matte-400">Now Playing</p>
                  <h2 className="font-display text-heading-3 text-white drop-shadow-lg">
                    {movie.title}
                  </h2>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/60 pointer-events-none">
            <div className="h-14 w-14 animate-spin rounded-full border-4 border-white/20 border-t-crimson-DEFAULT" />
          </div>
        )}
      </div>
    );
  }

  // ── EXTERNAL IFRAME (YouTube / Vimeo) ─────────────────────────────────
  if (isExternalIframe && videoUrl) {
    return (
      <div className="relative h-screen w-screen bg-black" ref={containerRef}>
        <div className="absolute inset-0">
          <iframe
            src={videoUrl}
            className="h-full w-full"
            allowFullScreen
            allow="autoplay; picture-in-picture"
            onLoad={() => setIsLoading(false)}
          />
        </div>
        <button
          onClick={goBack}
          className="absolute top-4 left-4 z-50 flex items-center gap-2 rounded-lg bg-black/80 px-4 py-2.5 text-white backdrop-blur-md hover:bg-black transition-colors"
        >
          <ArrowLeft size={18} />
          <span className="text-sm font-medium">Back</span>
        </button>
        {isLoading && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/50 pointer-events-none">
            <div className="h-14 w-14 animate-spin rounded-full border-4 border-white/20 border-t-crimson-DEFAULT" />
          </div>
        )}
      </div>
    );
  }

  // ── DIRECT VIDEO PLAYER (MP4 etc.) ────────────────────────────────────
  const savedItem = items.find((item) => item.movieId === movie.id.toString());
  const hasSavedProgress = savedItem && savedItem.progress > 30;

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
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => setIsPlaying(false)}
          onWaiting={() => setIsLoading(true)}
          onPlaying={() => setIsLoading(false)}
          onError={handleError}
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
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-25 text-center">
          <p className="text-caption text-matte-400 mb-3">
            Resume from {formatTime(savedItem!.progress)}?
          </p>
          <button
            onClick={() => {
              if (videoRef.current && savedItem) {
                videoRef.current.currentTime = savedItem.progress;
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
                className="absolute top-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-white opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
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
                  <SkipForward size={16} className="rotate-180" />
                  <span className="text-caption ml-0.5">10</span>
                </button>
                <button onClick={(e) => { e.stopPropagation(); skip(10); }} className="hidden sm:flex items-center text-white/70 hover:text-white">
                  <SkipForward size={16} />
                  <span className="text-caption ml-0.5">10</span>
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
                    <div className="absolute bottom-full right-0 mb-2 rounded-lg border border-white/10 bg-black/90 backdrop-blur-md py-1 shadow-elevated">
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