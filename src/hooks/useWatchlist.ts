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
    
    // Fallback to localStorage
    try {
      const stored = localStorage.getItem('watchlist');
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convert localStorage format to match database format
        const formatted = parsed.map((item: any) => ({
          id: item.movieId || Math.random(),
          movie_id: item.movieId || item.id,
          movie_slug: item.slug || '',
          movie_title: item.title || '',
          poster_url: item.posterUrl || '',
          added_at: item.addedAt || new Date().toISOString(),
        }));
        setWatchlist(formatted);
      }
    } catch {
      setWatchlist([]);
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
    
    // Fallback to localStorage
    const stored = localStorage.getItem('watchlist');
    const current = stored ? JSON.parse(stored) : [];
    const newItem = { 
      movieId: movie.movieId,
      slug: movie.slug,
      title: movie.title,
      posterUrl: movie.posterUrl,
      addedAt: new Date().toISOString(),
    };
    localStorage.setItem('watchlist', JSON.stringify([...current, newItem]));
    // Update state with formatted item
    setWatchlist(prev => [...prev, {
      id: Date.now(),
      movie_id: movie.movieId,
      movie_slug: movie.slug,
      movie_title: movie.title,
      poster_url: movie.posterUrl,
      added_at: new Date().toISOString(),
    }]);
    setIsAdded(true);
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
    
    // Fallback to localStorage
    const stored = localStorage.getItem('watchlist');
    if (stored) {
      const parsed = JSON.parse(stored);
      const filtered = parsed.filter((item: any) => item.movieId !== movieId);
      localStorage.setItem('watchlist', JSON.stringify(filtered));
    }
    setWatchlist(prev => prev.filter(item => item.movie_id !== movieId));
    setIsAdded(false);
  }, []);

  // Toggle watchlist
  const toggle = useCallback((movie: {
    movieId: string;
    slug: string;
    title: string;
    posterUrl: string;
  }) => {
    if (isAdded) {
      remove(movie.movieId);
    } else {
      add(movie);
    }
  }, [isAdded, add, remove]);

  // Load watchlist on mount
  useEffect(() => {
    loadWatchlist();
  }, [loadWatchlist]);

  return { watchlist, loading, isAdded, add, remove, toggle };
}
