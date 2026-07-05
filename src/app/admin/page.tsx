import { sql } from "@/lib/db";
import Link from "next/link";
import { Film, Plus, Eye, Users, Bookmark, TrendingUp } from "lucide-react";

export default async function AdminDashboard() {
  const [movieCount, watchlistCount, watchHistoryCount, recentMovies, featuredMovies] =
    await Promise.all([
      sql`SELECT COUNT(*) as count FROM movies`,
      sql`SELECT COUNT(*) as count FROM watchlist`,
      sql`SELECT COUNT(DISTINCT user_id) as count FROM watch_history`,
      sql`SELECT id, title, poster_url, slug FROM movies ORDER BY id DESC LIMIT 4`,
      sql`SELECT COUNT(*) as count FROM movies WHERE is_featured = true`,
    ]);

  const stats = [
    {
      label: "Total Movies",
      value: movieCount[0].count,
      icon: Film,
      color: "text-crimson-DEFAULT",
      bg: "bg-crimson-DEFAULT/10",
    },
    {
      label: "Featured in Hero",
      value: featuredMovies[0].count,
      icon: TrendingUp,
      color: "text-gold-DEFAULT",
      bg: "bg-gold-DEFAULT/10",
    },
    {
      label: "Watchlist Saves",
      value: watchlistCount[0].count,
      icon: Bookmark,
      color: "text-blue-400",
      bg: "bg-blue-400/10",
    },
    {
      label: "Unique Viewers",
      value: watchHistoryCount[0].count,
      icon: Users,
      color: "text-green-400",
      bg: "bg-green-400/10",
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white sm:text-3xl">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-matte-400">
            Welcome back. Here's what's happening on Haapu TV.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 rounded-lg border border-matte-700 px-4 py-2 text-sm font-medium text-matte-300 transition-colors hover:border-matte-500 hover:text-white"
          >
            <Eye size={16} />
            View Site
          </Link>
          <Link
            href="/admin/movies/add"
            className="flex items-center gap-2 rounded-lg bg-crimson-DEFAULT px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-crimson-dark"
          >
            <Plus size={16} />
            Add Movie
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-matte-800 bg-matte-900 p-5"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-matte-400">{stat.label}</p>
              <div className={`rounded-lg ${stat.bg} p-2`}>
                <stat.icon size={16} className={stat.color} />
              </div>
            </div>
            <p className="mt-3 font-display text-3xl font-bold text-white">
              {String(stat.value)}
            </p>
          </div>
        ))}
      </div>

      {/* Recent additions */}
      <div className="rounded-xl border border-matte-800 bg-matte-900">
        <div className="flex items-center justify-between border-b border-matte-800 px-6 py-4">
          <h2 className="font-semibold text-white">Recently Added</h2>
          <Link
            href="/admin/movies"
            className="text-sm text-crimson-DEFAULT hover:text-crimson-dark transition-colors"
          >
            View all →
          </Link>
        </div>
        <div className="divide-y divide-matte-800">
          {recentMovies.length === 0 ? (
            <div className="px-6 py-8 text-center text-sm text-matte-500">
              No movies yet.{" "}
              <Link href="/admin/movies/add" className="text-crimson-DEFAULT">
                Add your first one.
              </Link>
            </div>
          ) : (
            recentMovies.map((movie: any) => (
              <div key={movie.id} className="flex items-center gap-4 px-6 py-4">
                {/*
                  No onError here — server components can't have event handlers.
                  Wrap image in a div with a dark background as the fallback.
                  If the image fails to load, the dark bg shows through.
                */}
                <div className="h-12 w-9 flex-shrink-0 rounded bg-matte-800 overflow-hidden">
                  <img
                    src={movie.poster_url}
                    alt={movie.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate font-medium text-white">{movie.title}</p>
                  <p className="text-xs text-matte-500">/{movie.slug}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/movies/${movie.id}/edit`}
                    className="rounded-lg px-3 py-1.5 text-xs font-medium text-matte-400 transition-colors hover:bg-matte-800 hover:text-white"
                  >
                    Edit
                  </Link>
                  <Link
                    href={`/movie/${movie.slug}`}
                    target="_blank"
                    className="rounded-lg px-3 py-1.5 text-xs font-medium text-matte-400 transition-colors hover:bg-matte-800 hover:text-white"
                  >
                    View
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}