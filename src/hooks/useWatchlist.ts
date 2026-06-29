"use client";

import { useState, useEffect, useCallback } from "react";

interface WatchlistItem {
  id: number;
  movie_id: string;
  movie_slug: string;
  movie_title: string;
  poster_url: string;
  added_at: string;
}

export function useWatchlist(movieId?: string) {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdded, setIsAdded] = useState(false);

  // Load watchlist from database
  const loadWatchlist = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/watchlist', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setWatchlist(data.watchlist || []);
        setLoading(false);
        return;
      }
    } catch (error) {
      console.error('Failed to fetch watchlist:', error);
    }
    setLoading(false);
  }, []);

  // Check if current movie is in watchlist
  useEffect(() => {
    if (movieId) {
      setIsAdded(watchlist.some(item => item.movie_id === movieId));
    }
  }, [movieId, watchlist]);

  // Add to watchlist
  const add = useCallback(async (movie: {
    movieId: string;
    slug: string;
    title: string;
    posterUrl: string;
  }) => {
    try {
      const response = await fetch('/api/watchlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          movieId: movie.movieId,
          movieSlug: movie.slug,
          movieTitle: movie.title,
          posterUrl: movie.posterUrl,
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setWatchlist(prev => [...prev, data.item]);
        setIsAdded(true);
        return;
      }
    } catch (error) {
      console.error('Failed to add to watchlist:', error);
    }
  }, []);

  // Remove from watchlist
  const remove = useCallback(async (movieId: string) => {
    try {
      const response = await fetch(`/api/watchlist?movieId=${movieId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      
      if (response.ok) {
        setWatchlist(prev => prev.filter(item => item.movie_id !== movieId));
        setIsAdded(false);
        return;
      }
    } catch (error) {
      console.error('Failed to remove from watchlist:', error);
    }
  }, []);

  // Toggle watchlist
  const toggle = useCallback((movie: {
    movieId: string;
    slug: string;
    title: string;
    posterUrl: string;
  }) => {
    const existing = watchlist.find(item => item.movie_id === movie.movieId);
    if (existing) {
      remove(movie.movieId);
    } else {
      add(movie);
    }
  }, [watchlist, add, remove]);

  // Load watchlist on mount
  useEffect(() => {
    loadWatchlist();
  }, [loadWatchlist]);

  return { watchlist, loading, isAdded, add, remove, toggle };
}