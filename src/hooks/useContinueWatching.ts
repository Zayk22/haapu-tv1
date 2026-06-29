"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface WatchItem {
  movieId: string;
  movieSlug: string;
  movieTitle: string;
  posterUrl: string;
  progress: number;
  duration?: number;
  lastWatched: string;
}

export function useContinueWatching() {
  const [items, setItems] = useState<WatchItem[]>([]);
  const [loading, setLoading] = useState(true);
  const itemsRef = useRef<WatchItem[]>([]);

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  const loadHistory = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/watch-history', {
        credentials: 'include', // ✅ ADDED
      });
      if (response.ok) {
        const data = await response.json();
        const mapped: WatchItem[] = (data.history || []).map((row: Record<string, unknown>) => ({
          movieId: row.movie_id as string,
          movieSlug: row.movie_slug as string,
          movieTitle: row.movie_title as string,
          posterUrl: row.poster_url as string,
          progress: Number(row.progress) || 0,
          duration: row.duration ? Number(row.duration) : undefined,
          lastWatched: row.last_watched as string,
        }));
        setItems(mapped);
        setLoading(false);
        return;
      }
    } catch (error) {
      console.error('Failed to fetch watch history:', error);
    }
    try {
      const stored = localStorage.getItem('continueWatching');
      if (stored) setItems(JSON.parse(stored));
    } catch {
      setItems([]);
    }
    setLoading(false);
  }, []);

  const addItem = useCallback(async (movie: {
    movieId: string;
    title: string;
    posterUrl: string;
    year: number;
    rating: number;
    type: string;
    slug?: string;
  }) => {
    const exists = itemsRef.current.some(i => i.movieId === movie.movieId);
    if (exists) return;

    const newItem: WatchItem = {
      movieId: movie.movieId,
      movieSlug: movie.slug || movie.movieId,
      movieTitle: movie.title,
      posterUrl: movie.posterUrl,
      progress: 0,
      lastWatched: new Date().toISOString(),
    };

    setItems(prev => [newItem, ...prev]);

    try {
      await fetch('/api/watch-history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // ✅ ADDED
        body: JSON.stringify({
          movieId: movie.movieId,
          movieSlug: movie.slug || movie.movieId,
          movieTitle: movie.title,
          posterUrl: movie.posterUrl,
          progress: 0,
          duration: 0,
        }),
      });
    } catch (error) {
      console.error('Failed to add to watch history:', error);
    }
  }, []);

  const updateProgress = useCallback(async (
    movieId: string,
    progress: number,
    movieMeta?: {
      movieSlug: string;
      movieTitle: string;
      posterUrl: string;
      duration?: number;
    }
  ) => {
    setItems(prev =>
      prev.map(item =>
        item.movieId === movieId
          ? { ...item, progress, lastWatched: new Date().toISOString() }
          : item
      )
    );

    const existing = itemsRef.current.find(i => i.movieId === movieId);
    const slug = movieMeta?.movieSlug ?? existing?.movieSlug;
    const title = movieMeta?.movieTitle ?? existing?.movieTitle;
    const poster = movieMeta?.posterUrl ?? existing?.posterUrl;
    const duration = movieMeta?.duration;

    if (!slug || !title) {
      console.warn(`updateProgress: missing data for ${movieId}`);
      return;
    }

    try {
      await fetch('/api/watch-history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // ✅ ADDED
        body: JSON.stringify({
          movieId,
          movieSlug: slug,
          movieTitle: title,
          posterUrl: poster,
          progress,
          duration,
        }),
      });
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  }, []);

  const removeItem = useCallback(async (movieId: string) => {
    setItems(prev => prev.filter(i => i.movieId !== movieId));
    try {
      await fetch(`/api/watch-history?movieId=${movieId}`, {
        method: 'DELETE',
        credentials: 'include', // ✅ ADDED
      });
    } catch (error) {
      console.error('Failed to remove watch history:', error);
    }
  }, []);

  useEffect(() => { loadHistory(); }, [loadHistory]);

  return { items, loading, addItem, updateProgress, removeItem };
}