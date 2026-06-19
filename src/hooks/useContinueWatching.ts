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
    }
  }, []);

  // ✅ FIXED: Update progress - simplified and more reliable
  const updateProgress = useCallback(async (movieId: string, progress: number, duration?: string) => {
    console.log(`📝 updateProgress called: movieId=${movieId}, progress=${progress}, duration=${duration}`);
    
    // Find the movie in current items
    const existingItem = items.find(i => i.movieId === movieId);
    
    // Update local state immediately
    setItems(prev => prev.map(item =>
      item.movieId === movieId
        ? { ...item, progress, duration, lastWatched: new Date().toISOString() }
        : item
    ));

    try {
      // If the movie exists in the list, use its data
      if (existingItem) {
        const response = await fetch('/api/watch-history', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            movieId: movieId,
            movieSlug: existingItem.movieSlug,
            movieTitle: existingItem.movieTitle,
            posterUrl: existingItem.posterUrl,
            progress: progress,
            duration: duration || existingItem.duration,
          }),
        });
        
        const data = await response.json();
        console.log(`📡 POST response:`, data);
        
        if (!response.ok) {
          console.error('Failed to update progress:', data);
        }
      } else {
        console.warn(`Movie ${movieId} not found in watch history, cannot update progress`);
      }
    } catch (error) {
      console.error('Error updating progress:', error);
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
    }
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  return { items, loading, addItem, updateProgress, removeItem };
}