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

  // Load watch history from database
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
    const stored = localStorage.getItem('continueWatching');
    if (stored) {
      try {
        setItems(JSON.parse(stored));
      } catch {
        setItems([]);
      }
    } else {
      setItems([]);
    }
    setLoading(false);
  }, []);

  // Save item to watch history
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

    // Update local state
    setItems(prev => {
      const existing = prev.find(i => i.movieId === movie.movieId);
      if (existing) return prev;
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
      return;
    } catch (error) {
      console.error('Failed to save watch progress:', error);
    }

    // Fallback to localStorage
    localStorage.setItem('continueWatching', JSON.stringify(
      [newItem, ...items.filter(i => i.movieId !== movie.movieId)]
    ));
  }, [items]);

  // Update progress for a movie
  const updateProgress = useCallback(async (movieId: string, progress: number, duration?: string) => {
    // Update local state
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
      return;
    } catch (error) {
      console.error('Failed to update progress:', error);
    }

    // Fallback to localStorage
    localStorage.setItem('continueWatching', JSON.stringify(
      items.map(item =>
        item.movieId === movieId
          ? { ...item, progress, duration, lastWatched: new Date().toISOString() }
          : item
      )
    ));
  }, [items]);

  // Remove an item from watch history
  const removeItem = useCallback(async (movieId: string) => {
    setItems(prev => prev.filter(i => i.movieId !== movieId));

    try {
      await fetch(`/api/watch-history?movieId=${movieId}`, {
        method: 'DELETE',
      });
      return;
    } catch (error) {
      console.error('Failed to remove watch history:', error);
    }

    localStorage.setItem('continueWatching', JSON.stringify(
      items.filter(i => i.movieId !== movieId)
    ));
  }, [items]);

  // Load history on mount
  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  return { items, loading, addItem, updateProgress, removeItem };
}