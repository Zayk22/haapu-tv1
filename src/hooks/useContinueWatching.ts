"use client";

import { useState, useEffect, useCallback } from "react";

interface WatchItem {
  movieId: string;
  movieSlug: string;
  movieTitle: string;
  posterUrl: string;
  progress: number;
  duration?: string;
  lastWatched: string;
}

export function useContinueWatching() {
  const [items, setItems] = useState<WatchItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Load watch history
  const loadHistory = useCallback(async () => {
    setLoading(true);
    
    try {
      const response = await fetch('/api/watch-history');
      if (response.ok) {
        const data = await response.json();
        setItems(data.history || []);
        setLoading(false);
        return;
      }
    } catch (error) {
      console.error('Failed to fetch watch history:', error);
    }
    
    // Fallback to localStorage
    try {
      const stored = localStorage.getItem('continueWatching');
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch {
      setItems([]);
    }
    setLoading(false);
  }, []);

  // Add item
  const addItem = useCallback(async (movie: {
    movieId: string;
    title: string;
    posterUrl: string;
    year: number;
    rating: number;
    type: string;
    slug?: string;
  }) => {
    const newItem: WatchItem = {
      movieId: movie.movieId,
      movieSlug: movie.slug || movie.movieId,
      movieTitle: movie.title,
      posterUrl: movie.posterUrl,
      progress: 0,
      lastWatched: new Date().toISOString(),
    };

    setItems(prev => {
      const exists = prev.some(i => i.movieId === movie.movieId);
      if (exists) return prev;
      return [newItem, ...prev];
    });

    try {
      await fetch('/api/watch-history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          movieId: movie.movieId,
          movieSlug: movie.slug || movie.movieId,
          movieTitle: movie.title,
          posterUrl: movie.posterUrl,
          progress: 0,
        }),
      });
    } catch (error) {
      console.error('Failed to save watch progress:', error);
      // Fallback to localStorage
      const stored = localStorage.getItem('continueWatching');
      const current = stored ? JSON.parse(stored) : [];
      localStorage.setItem('continueWatching', JSON.stringify([newItem, ...current]));
    }
  }, []);

  // Update progress
  const updateProgress = useCallback(async (movieId: string, progress: number, duration?: string) => {
    setItems(prev => prev.map(item =>
      item.movieId === movieId
        ? { ...item, progress, duration, lastWatched: new Date().toISOString() }
        : item
    ));

    try {
      const item = items.find(i => i.movieId === movieId);
      if (!item) return;
      
      await fetch('/api/watch-history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          movieId: movieId,
          movieSlug: item.movieSlug,
          movieTitle: item.movieTitle,
          posterUrl: item.posterUrl,
          progress,
          duration,
        }),
      });
    } catch (error) {
      console.error('Failed to update progress:', error);
      // Fallback to localStorage
      const stored = localStorage.getItem('continueWatching');
      if (stored) {
        const parsed = JSON.parse(stored);
        const updated = parsed.map((item: any) =>
          item.movieId === movieId
            ? { ...item, progress, duration, lastWatched: new Date().toISOString() }
            : item
        );
        localStorage.setItem('continueWatching', JSON.stringify(updated));
      }
    }
  }, [items]);

  // Remove item
  const removeItem = useCallback(async (movieId: string) => {
    setItems(prev => prev.filter(i => i.movieId !== movieId));

    try {
      await fetch(`/api/watch-history?movieId=${movieId}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Failed to remove watch history:', error);
      // Fallback to localStorage
      const stored = localStorage.getItem('continueWatching');
      if (stored) {
        const parsed = JSON.parse(stored);
        localStorage.setItem('continueWatching', JSON.stringify(
          parsed.filter((item: any) => item.movieId !== movieId)
        ));
      }
    }
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  return { items, loading, addItem, updateProgress, removeItem };
}