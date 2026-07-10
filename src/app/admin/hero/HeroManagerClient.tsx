"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, CheckCircle, GripVertical } from "lucide-react";

const MIN_FEATURED = 4;

export default function HeroManagerClient({ movies }: { movies: any[] }) {
  const router = useRouter();
  const [movieList, setMovieList] = useState(movies);
  const [saving, setSaving]       = useState<string | null>(null);
  const [message, setMessage]     = useState<{ type: "success" | "error"; text: string } | null>(null);

  const featured = movieList
    .filter((m) => m.is_featured)
    .sort((a, b) => (a.hero_order ?? 999) - (b.hero_order ?? 999));
  const notFeatured = movieList.filter((m) => !m.is_featured);
  const count = featured.length;

  const flash = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const toggleFeatured = async (id: string, current: boolean) => {
    if (current && count <= MIN_FEATURED) {
      flash("error", `Carousel needs at least ${MIN_FEATURED} movies. Add another before removing this one.`);
      return;
    }
    setSaving(id);

    const nextOrder = current ? undefined : featured.length + 1;
    const patchBody = current
      ? { is_featured: false }
      : { is_featured: true, hero_order: nextOrder };

    try {
      const res = await fetch(`/api/admin/movies/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patchBody),
      });

      if (res.ok) {
        // Update local state immediately for snappy UI
        setMovieList((prev) =>
          prev.map((m) =>
            m.id === id
              ? { ...m, is_featured: !current, hero_order: nextOrder ?? m.hero_order }
              : m
          )
        );
        flash("success", current ? "Removed from carousel" : "Added to carousel");
        // Re-fetch server data to confirm DB was updated.
        // If the count reverts after this, the SQL UPDATE isn't persisting.
        setTimeout(() => router.refresh(), 1000);
      } else {
        const data = await res.json().catch(() => ({}));
        const errorMsg = `Save failed (HTTP ${res.status}): ${data.error || "unknown"}`;
        flash("error", errorMsg);
        console.error("Hero PATCH failed:", res.status, data);
      }
    } catch (err) {
      flash("error", "Network error — check your connection and try again");
      console.error("Hero PATCH network error:", err);
    }
    setSaving(null);
  };

  const updateOrder = async (id: string, order: number) => {
    if (isNaN(order) || order < 1) return;
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
        setTimeout(() => router.refresh(), 1000);
      } else {
        console.error("Order update failed:", res.status);
      }
    } catch (err) {
      console.error("Order update network error:", err);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-white sm:text-3xl">
          Hero Carousel
        </h1>
        <p className="mt-1 text-sm text-matte-400">
          Control which movies appear in the homepage hero. Minimum {MIN_FEATURED} required.
        </p>
      </div>

      {/* Status */}
      <div className={`mb-6 flex items-center gap-3 rounded-xl border px-5 py-4 ${
        count < MIN_FEATURED
          ? "border-red-500/40 bg-red-500/10"
          : "border-green-500/40 bg-green-500/10"
      }`}>
        {count < MIN_FEATURED
          ? <AlertTriangle size={20} className="flex-shrink-0 text-red-400" />
          : <CheckCircle  size={20} className="flex-shrink-0 text-green-400" />
        }
        <div>
          <p className={`font-semibold ${count < MIN_FEATURED ? "text-red-400" : "text-green-400"}`}>
            {count} movie{count !== 1 ? "s" : ""} in carousel
            {count < MIN_FEATURED && ` — need ${MIN_FEATURED - count} more`}
          </p>
          <p className="mt-0.5 text-xs text-matte-500">
            {count < MIN_FEATURED
              ? `Add ${MIN_FEATURED - count} more below.`
              : "Carousel is healthy."}
          </p>
        </div>
      </div>

      {/* Toast */}
      {message && (
        <div className={`mb-4 rounded-lg border px-4 py-3 text-sm font-medium ${
          message.type === "error"
            ? "border-red-500/30 bg-red-500/10 text-red-400"
            : "border-green-500/30 bg-green-500/10 text-green-400"
        }`}>
          {message.text}
        </div>
      )}

      {/* In Carousel */}
      <div className="mb-6 rounded-xl border border-matte-800 bg-matte-900">
        <div className="border-b border-matte-800 px-5 py-4">
          <h2 className="font-semibold text-white">In Carousel</h2>
          <p className="mt-0.5 text-xs text-matte-500">
            Edit the order number to control which slide appears first.
          </p>
        </div>
        {featured.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-matte-500">
            No movies in carousel yet. Add some below.
          </p>
        ) : (
          <div className="divide-y divide-matte-800">
            {featured.map((movie, i) => (
              <div key={movie.id} className="flex items-center gap-3 px-5 py-3.5">
                <GripVertical size={16} className="flex-shrink-0 text-matte-700" />
                <div className="flex h-10 w-7 flex-shrink-0 items-center justify-center rounded bg-matte-800 text-xs font-bold text-matte-400">
                  {i + 1}
                </div>
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  className="h-12 w-9 flex-shrink-0 rounded object-cover bg-matte-800"
                />
                <p className="flex-1 min-w-0 truncate font-medium text-white">
                  {movie.title}
                </p>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max="20"
                    defaultValue={movie.hero_order ?? i + 1}
                    onBlur={(e) => updateOrder(movie.id, parseInt(e.target.value))}
                    className="w-14 rounded border border-matte-700 bg-matte-800 px-2 py-1 text-center text-xs text-white focus:border-crimson-DEFAULT focus:outline-none"
                  />
                  <button
                    onClick={() => toggleFeatured(movie.id, true)}
                    disabled={saving === movie.id}
                    className="rounded-lg border border-red-500/30 px-3 py-1.5 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/10 disabled:opacity-40"
                  >
                    {saving === movie.id ? "..." : "Remove"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Not in Carousel */}
      {notFeatured.length > 0 && (
        <div className="rounded-xl border border-matte-800 bg-matte-900">
          <div className="border-b border-matte-800 px-5 py-4">
            <h2 className="font-semibold text-white">Not in Carousel</h2>
            <p className="mt-0.5 text-xs text-matte-500">
              Click Add to feature a movie.
            </p>
          </div>
          <div className="divide-y divide-matte-800">
            {notFeatured.map((movie) => (
              <div key={movie.id} className="flex items-center gap-3 px-5 py-3.5">
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  className="h-12 w-9 flex-shrink-0 rounded object-cover bg-matte-800"
                />
                <p className="flex-1 min-w-0 truncate text-sm text-matte-300">
                  {movie.title}
                </p>
                <button
                  onClick={() => toggleFeatured(movie.id, false)}
                  disabled={saving === movie.id}
                  className="rounded-lg border border-crimson-DEFAULT/40 bg-crimson-DEFAULT/10 px-3 py-1.5 text-xs font-medium text-crimson-DEFAULT transition-colors hover:bg-crimson-DEFAULT/20 disabled:opacity-40"
                >
                  {saving === movie.id ? "..." : "+ Add"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}