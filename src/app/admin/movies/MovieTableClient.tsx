"use client";

import { useState } from "react";
import Link from "next/link";
import { Edit, Trash2, Eye, Search, Plus, ExternalLink } from "lucide-react";

function Toggle({
  value,
  onChange,
  disabled,
}: {
  value: boolean;
  onChange: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onChange}
      disabled={disabled}
      className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 focus:outline-none disabled:opacity-50 ${
        value ? "bg-crimson-DEFAULT" : "bg-matte-700"
      }`}
    >
      <span
        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform duration-200 ${
          value ? "translate-x-4" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

export default function MovieTableClient({ movies }: { movies: any[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [movieList, setMovieList] = useState(movies);
  const [updating, setUpdating] = useState<Record<string, boolean>>({});
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const filteredMovies = movieList.filter((movie) =>
    movie.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: string, title: string) => {
    if (deleteConfirm !== id) {
      setDeleteConfirm(id);
      setTimeout(() => setDeleteConfirm(null), 3000);
      return;
    }
    setDeleteConfirm(null);
    try {
      const res = await fetch(`/api/admin/movies/${id}`, { method: "DELETE" });
      if (res.ok) setMovieList((prev) => prev.filter((m) => m.id !== id));
    } catch {}
  };

  const updateFlag = async (id: string, field: string, current: boolean) => {
    const key = `${id}-${field}`;
    setUpdating((prev) => ({ ...prev, [key]: true }));
    try {
      const res = await fetch(`/api/admin/movies/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: !current }),
      });
      if (res.ok) {
        setMovieList((prev) =>
          prev.map((m) => (m.id === id ? { ...m, [field]: !current } : m))
        );
      }
    } catch {}
    setUpdating((prev) => ({ ...prev, [key]: false }));
  };

  const updateHeroOrder = async (id: string, order: number) => {
    if (isNaN(order)) return;
    try {
      const res = await fetch(`/api/admin/movies/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hero_order: order }),
      });
      if (res.ok) {
        setMovieList((prev) =>
          prev.map((m) => (m.id === id ? { ...m, hero_order: order } : m))
        );
      }
    } catch {}
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white sm:text-3xl">
            Movies
          </h1>
          <p className="mt-1 text-sm text-matte-400">
            {movieList.length} title{movieList.length !== 1 ? "s" : ""} in
            your catalog
          </p>
        </div>
        <Link
          href="/admin/movies/add"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-crimson-DEFAULT px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-crimson-dark"
        >
          <Plus size={16} />
          Add Movie
        </Link>
      </div>

      {/* Search */}
      <div className="mb-6 max-w-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-matte-500" />
          <input
            type="text"
            placeholder="Search movies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-matte-700 bg-matte-800 py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-matte-500 focus:border-crimson-DEFAULT focus:outline-none"
          />
        </div>
      </div>

      {/* Mobile cards */}
      <div className="space-y-3 lg:hidden">
        {filteredMovies.map((movie) => (
          <div
            key={movie.id}
            className="rounded-xl border border-matte-800 bg-matte-900 p-4"
          >
            <div className="flex gap-3">
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="h-18 w-14 flex-shrink-0 rounded-lg object-cover"
                style={{ height: "72px", width: "56px" }}
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white truncate">
                  {movie.title}
                </h3>
                <p className="mt-0.5 text-xs text-matte-500">
                  {movie.genres?.slice(0, 2).join(", ")} • {movie.duration}
                </p>

                <div className="mt-3 grid grid-cols-2 gap-2">
                  {[
                    { field: "is_featured", label: "Featured" },
                    { field: "is_trending", label: "Trending" },
                    { field: "is_recommended", label: "Recommended" },
                  ].map(({ field, label }) => (
                    <div key={field} className="flex items-center gap-2">
                      <Toggle
                        value={movie[field] || false}
                        onChange={() =>
                          updateFlag(movie.id, field, movie[field] || false)
                        }
                        disabled={updating[`${movie.id}-${field}`]}
                      />
                      <span className="text-xs text-matte-400">{label}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <Link
                    href={`/admin/movies/${movie.id}/edit`}
                    className="flex items-center gap-1 rounded-lg bg-matte-800 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-matte-700"
                  >
                    <Edit size={12} /> Edit
                  </Link>
                  <Link
                    href={`/movie/${movie.slug}`}
                    target="_blank"
                    className="flex items-center gap-1 rounded-lg bg-matte-800 px-3 py-1.5 text-xs font-medium text-matte-300 transition-colors hover:bg-matte-700"
                  >
                    <ExternalLink size={12} /> View
                  </Link>
                  <button
                    onClick={() => handleDelete(movie.id, movie.title)}
                    className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                      deleteConfirm === movie.id
                        ? "bg-red-500/20 text-red-400"
                        : "bg-matte-800 text-matte-400 hover:text-red-400"
                    }`}
                  >
                    <Trash2 size={12} />
                    {deleteConfirm === movie.id ? "Confirm?" : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-xl border border-matte-800 lg:block">
        <table className="w-full">
          <thead>
            <tr className="border-b border-matte-800 bg-matte-900/80">
              <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-matte-500">
                Movie
              </th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-matte-500">
                Duration
              </th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-matte-500">
                Featured
              </th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-matte-500">
                Trending
              </th>
              <th className="px-5 py-3.5