"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Edit, Trash2, Eye, Search, Plus } from "lucide-react";

export default function MovieTableClient({ movies }: { movies: any[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [movieList, setMovieList] = useState(movies);
  const [updating, setUpdating] = useState<Record<string, boolean>>({});
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  const filteredMovies = movieList.filter((movie) =>
    movie.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    
    try {
      const response = await fetch(`/api/admin/movies/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setMovieList(movieList.filter(m => m.id !== id));
      } else {
        alert('Failed to delete');
      }
    } catch (err) {
      alert('Failed to delete');
    }
  };

  const updateFlag = async (id: string, field: string, currentValue: boolean) => {
    const newValue = !currentValue;
    const key = `${id}-${field}`;
    
    console.log(`🔄 Updating ${field} for movie ${id} from ${currentValue} to ${newValue}`);
    
    setUpdating(prev => ({ ...prev, [key]: true }));
    
    try {
      const response = await fetch(`/api/admin/movies/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: newValue }),
      });
      
      const data = await response.json();
      
      console.log(`📡 Response status: ${response.status}`);
      console.log(`📡 Response data:`, data);
      
      if (response.ok) {
        setMovieList(prev => prev.map(movie => 
          movie.id === id ? { ...movie, [field]: newValue } : movie
        ));
        console.log(`✅ Successfully updated ${field} to ${newValue} for movie ${id}`);
      } else {
        console.error(`❌ Update failed:`, data.error);
        alert(data.error || 'Failed to update');
      }
    } catch (err) {
      console.error(`❌ Network error:`, err);
      alert('Network error - check console');
    } finally {
      setUpdating(prev => ({ ...prev, [key]: false }));
    }
  };

  const updateHeroOrder = async (id: string, order: number) => {
    if (isNaN(order)) return;
    
    try {
      const response = await fetch(`/api/admin/movies/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hero_order: order }),
      });
      
      if (response.ok) {
        setMovieList(prev => prev.map(movie => 
          movie.id === id ? { ...movie, hero_order: order } : movie
        ));
      }
    } catch (err) {
      console.error('Failed to update hero order');
    }
  };

  const featuredCount = movieList.filter(m => m.is_featured).length;

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white sm:text-3xl">Movies</h1>
          <p className="mt-1 text-sm text-matte-400 sm:text-base">Manage your movie catalog</p>
        </div>
        <Link
          href="/admin/movies/add"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-crimson-DEFAULT px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-crimson-dark sm:text-base"
        >
          <Plus size={18} />
          Add Movie
        </Link>
      </div>

      {/* Featured count info - MOVED INSIDE THE RETURN */}
      <div className="mb-4 text-sm text-matte-400">
        Featured movies: {featuredCount} total (all will show in hero carousel)
      </div>

      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-matte-500" />
          <input
            type="text"
            placeholder="Search movies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-matte-800 bg-matte-900 py-2 pl-10 pr-4 text-sm text-white placeholder:text-matte-500 focus:border-crimson-DEFAULT focus:outline-none sm:text-base"
          />
        </div>
      </div>

      {isMobile ? (
        <div className="space-y-3">
          {filteredMovies.map((movie) => (
            <div key={movie.id} className="rounded-lg border border-matte-800 bg-matte-900 p-4">
              <div className="flex gap-3">
                <img src={movie.posterUrl} alt={movie.title} className="h-16 w-12 rounded object-cover" />
                <div className="flex-1">
                  <h3 className="font-medium text-white">{movie.title}</h3>
                  <p className="mt-0.5 text-xs text-matte-400">{movie.genres?.slice(0, 2).join(", ")}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <button 
                      onClick={() => updateFlag(movie.id, 'is_featured', movie.is_featured || false)}
                      disabled={updating[`${movie.id}-is_featured`]}
                      className={`px-2 py-1 rounded text-xs ${movie.is_featured ? 'bg-crimson-DEFAULT text-white' : 'bg-matte-800 text-matte-400'}`}
                    >
                      {updating[`${movie.id}-is_featured`] ? '...' : (movie.is_featured ? '★ Featured' : '☆ Set Featured')}
                    </button>
                    <Link href={`/admin/movies/${movie.id}/edit`} className="text-xs text-blue-400">Edit</Link>
                    <button onClick={() => handleDelete(movie.id, movie.title)} className="text-xs text-red-400">Delete</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-matte-800 bg-matte-900">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-matte-800 bg-matte-800/50">
                <th className="px-4 py-3 text-left text-xs font-medium text-matte-400">Poster</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-matte-400">Title</th>
                <th className="hidden px-4 py-3 text-left text-xs font-medium text-matte-400 sm:table-cell">Genres</th>
                <th className="hidden px-4 py-3 text-left text-xs font-medium text-matte-400 md:table-cell">Duration</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-matte-400">Featured</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-matte-400">Trending</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-matte-400">Recommended</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-matte-400">Hero Order</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-matte-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMovies.map((movie) => (
                <tr key={movie.id} className="border-b border-matte-800 hover:bg-matte-800/30">
                  <td className="px-4 py-3">
                    <img src={movie.posterUrl} alt={movie.title} className="h-12 w-8 rounded object-cover" />
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-white">{movie.title}</td>
                  <td className="hidden px-4 py-3 text-xs text-matte-400 sm:table-cell">
                    {movie.genres?.slice(0, 2).join(", ")}
                  </td>
                  <td className="hidden px-4 py-3 text-xs text-matte-400 md:table-cell">{movie.duration}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => updateFlag(movie.id, 'is_featured', movie.is_featured || false)}
                      disabled={updating[`${movie.id}-is_featured`]}
                      className={`px-2 py-1 rounded text-xs cursor-pointer transition-colors ${movie.is_featured ? 'bg-crimson-DEFAULT text-white' : 'bg-matte-800 text-matte-400 hover:bg-matte-700'}`}
                    >
                      {updating[`${movie.id}-is_featured`] ? '...' : (movie.is_featured ? 'Yes' : 'No')}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => updateFlag(movie.id, 'is_trending', movie.is_trending || false)}
                      disabled={updating[`${movie.id}-is_trending`]}
                      className={`px-2 py-1 rounded text-xs cursor-pointer transition-colors ${movie.is_trending ? 'bg-crimson-DEFAULT text-white' : 'bg-matte-800 text-matte-400 hover:bg-matte-700'}`}
                    >
                      {updating[`${movie.id}-is_trending`] ? '...' : (movie.is_trending ? 'Yes' : 'No')}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => updateFlag(movie.id, 'is_recommended', movie.is_recommended || false)}
                      disabled={updating[`${movie.id}-is_recommended`]}
                      className={`px-2 py-1 rounded text-xs cursor-pointer transition-colors ${movie.is_recommended ? 'bg-crimson-DEFAULT text-white' : 'bg-matte-800 text-matte-400 hover:bg-matte-700'}`}
                    >
                      {updating[`${movie.id}-is_recommended`] ? '...' : (movie.is_recommended ? 'Yes' : 'No')}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={movie.hero_order || ''}
                      onChange={(e) => updateHeroOrder(movie.id, parseInt(e.target.value))}
                      className="w-16 rounded border border-matte-800 bg-matte-900 px-2 py-1 text-sm text-white"
                      placeholder="—"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/movies/${movie.id}/edit`} className="rounded p-1 text-matte-400 hover:text-blue-400">
                        <Edit size={16} />
                      </Link>
                      <Link href={`/movie/${movie.slug}`} target="_blank" className="rounded p-1 text-matte-400 hover:text-green-400">
                        <Eye size={16} />
                      </Link>
                      <button onClick={() => handleDelete(movie.id, movie.title)} className="rounded p-1 text-matte-400 hover:text-red-400">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {filteredMovies.length === 0 && (
        <div className="rounded-lg border border-matte-800 bg-matte-900 p-8 text-center sm:p-12">
          <p className="text-sm text-matte-400 sm:text-base">
            {searchTerm ? "No movies match your search." : "No movies found. Click 'Add Movie' to get started."}
          </p>
        </div>
      )}
    </div>
  );
}