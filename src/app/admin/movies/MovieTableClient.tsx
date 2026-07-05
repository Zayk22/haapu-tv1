"use client";

import { useState } from "react";
import Link from "next/link";
import { Edit, Trash2, Eye, Search, Plus } from "lucide-react";

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
      type="button"
      onClick={onChange}
      disabled={disabled}
      className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 focus:outline-none disabled:opacity-40 ${
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

  const filtered = movieList.filter((m) =>
    m.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (deleteConfirm !== id) {
      setDeleteConfirm(id);
      setTimeout(() => setDeleteConfirm(null), 3000);
      return;
    }
    setDeleteConfirm(null);
    try {
      const res = await fetch(`/api/admin/movies/${id}`, { method: "DELETE" });
      if (res.ok) setMovieList((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      console.error("Delete failed", err);
    }
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
    } catch (err) {
      console.error("Update failed", err);
    }
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
    } catch (err) {
      console.error("Hero order update failed", err);
    }
  };

  return (
    <div>
      {/* Page header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white sm:text-3xl">
            Movies
          </h1>
          <p className="mt-1 text-sm text-matte-400">
            {movieList.length} title{movieList.length !== 1 ? "s" : ""} in your catalog
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
        {filtered.map((movie) => (
          <div
            key={movie.id}
            className="rounded-xl border border-matte-800 bg-matte-900 p-4"
          >
            <div className="flex gap-3">
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="h-16 w-12 flex-shrink-0 rounded object-cover bg-matte-800"
              />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white truncate">{movie.title}</p>
                <p className="mt-0.5 text-xs text-matte-500">
                  {movie.genres?.slice(0, 2).join(", ")} • {movie.duration}
                </p>
                <div className="mt-3 space-y-2">
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
                    className="rounded-lg bg-matte-800 px-3 py-1.5 text-xs font-medium text-white hover:bg-matte-700"
                  >
                    Edit
                  </Link>
                  <Link
                    href={`/movie/${movie.slug}`}
                    target="_blank"
                    className="rounded-lg bg-matte-800 px-3 py-1.5 text-xs font-medium text-matte-300 hover:bg-matte-700"
                  >
                    View
                  </Link>
                  <button
                    onClick={() => handleDelete(movie.id)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                      deleteConfirm === movie.id
                        ? "bg-red-500/20 text-red-400"
                        : "bg-matte-800 text-matte-400 hover:text-red-400"
                    }`}
                  >
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
              {[
                "Movie",
                "Duration",
                "Featured",
                "Trending",
                "Recommended",
                "Hero Order",
                "Actions",
              ].map((h) => (
                <th
                  key={h}
                  className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-matte-500"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-matte-800 bg-matte-900">
            {filtered.map((movie) => (
              <tr
                key={movie.id}
                className="transition-colors hover:bg-matte-800/40"
              >
                {/* Movie */}
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={movie.posterUrl}
                      alt={movie.title}
                      className="h-12 w-9 flex-shrink-0 rounded object-cover bg-matte-800"
                    />
                    <div className="min-w-0">
                      <p className="truncate max-w-[180px] font-semibold text-white">
                        {movie.title}
                      </p>
                      <p className="truncate max-w-[180px] text-xs text-matte-500">
                        {movie.genres?.slice(0, 2).join(", ")}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Duration */}
                <td className="px-5 py-4 text-sm text-matte-400">
                  {movie.duration || "—"}
                </td>

                {/* Toggles */}
                {["is_featured", "is_trending", "is_recommended"].map((field) => (
                  <td key={field} className="px-5 py-4">
                    <Toggle
                      value={movie[field] || false}
                      onChange={() =>
                        updateFlag(movie.id, field, movie[field] || false)
                      }
                      disabled={updating[`${movie.id}-${field}`]}
                    />
                  </td>
                ))}

                {/* Hero order */}
                <td className="px-5 py-4">
                  <input
                    type="number"
                    min="1"
                    max="20"
                    defaultValue={movie.hero_order || ""}
                    onBlur={(e) =>
                      updateHeroOrder(movie.id, parseInt(e.target.value))
                    }
                    className="w-16 rounded-lg border border-matte-700 bg-matte-800 px-2 py-1.5 text-center text-sm text-white focus:border-crimson-DEFAULT focus:outline-none"
                    placeholder="—"
                  />
                </td>

                {/* Actions */}
                <td className="px-5 py-4">
                  <div className="flex items-center gap-1">
                    <Link
                      href={`/admin/movies/${movie.id}/edit`}
                      className="rounded-lg p-2 text-matte-400 transition-colors hover:bg-matte-800 hover:text-white"
                      title="Edit"
                    >
                      <Edit size={15} />
                    </Link>
                    <Link
                      href={`/movie/${movie.slug}`}
                      target="_blank"
                      className="rounded-lg p-2 text-matte-400 transition-colors hover:bg-matte-800 hover:text-white"
                      title="View on site"
                    >
                      <Eye size={15} />
                    </Link>
                    <button
                      onClick={() => handleDelete(movie.id)}
                      className={`rounded-lg p-2 transition-colors ${
                        deleteConfirm === movie.id
                          ? "bg-red-500/10 text-red-400"
                          : "text-matte-400 hover:bg-matte-800 hover:text-red-400"
                      }`}
                      title={
                        deleteConfirm === movie.id
                          ? "Click again to confirm"
                          : "Delete"
                      }
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="rounded-xl border border-matte-800 bg-matte-900 py-16 text-center">
          <p className="text-sm text-matte-400">
            {searchTerm ? (
              "No movies match your search."
            ) : (
              <>
                No movies yet.{" "}
                <Link href="/admin/movies/add" className="text-crimson-DEFAULT">
                  Add your first movie.
                </Link>
              </>
            )}
          </p>
        </div>
      )}
    </div>
  );
}