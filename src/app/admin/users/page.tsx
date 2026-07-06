"use client";

import { useState } from "react";
import { Search, ShieldCheck, ShieldOff, Loader2, UserCircle } from "lucide-react";

type ClerkUser = {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string;
  role: string | null;
};

export default function UsersPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ClerkUser[]>([]);
  const [searching, setSearching] = useState(false);
  const [updating, setUpdating] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const flash = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setSearching(true);
    setHasSearched(true);
    try {
      const res = await fetch(`/api/admin/users?query=${encodeURIComponent(query.trim())}`);
      const data = await res.json();
      if (res.ok) setResults(data.users || []);
      else flash("error", data.error || "Search failed");
    } catch {
      flash("error", "Search failed. Try again.");
    }
    setSearching(false);
  };

  const setRole = async (userId: string, role: "admin" | null) => {
    setUpdating(userId);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role }),
      });
      const data = await res.json();
      if (res.ok) {
        setResults((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, role } : u))
        );
        flash(
          "success",
          role === "admin"
            ? "User promoted to admin. They need to sign out and back in for it to take effect."
            : "Admin access removed."
        );
      } else {
        flash("error", data.error || "Update failed");
      }
    } catch {
      flash("error", "Update failed. Try again.");
    }
    setUpdating(null);
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-white sm:text-3xl">
          User Management
        </h1>
        <p className="mt-1 text-sm text-matte-400">
          Search for users and manage admin access.
        </p>
      </div>

      {/* Info banner */}
      <div className="mb-6 rounded-xl border border-matte-800 bg-matte-900 p-4 text-sm text-matte-400">
        <p className="font-medium text-white mb-1">How this works</p>
        After promoting a user to admin, they need to{" "}
        <span className="text-white font-medium">sign out and sign back in</span>{" "}
        before their access takes effect. This is a Clerk session requirement.
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="mb-6 flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-matte-500" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by email address..."
            className="w-full rounded-lg border border-matte-700 bg-matte-800 py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-matte-500 focus:border-crimson-DEFAULT focus:outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={searching}
          className="flex items-center gap-2 rounded-lg bg-crimson-DEFAULT px-5 py-2.5 text-sm font-semibold text-white hover:bg-crimson-dark disabled:opacity-60"
        >
          {searching ? <Loader2 size={15} className="animate-spin" /> : <Search size={15} />}
          Search
        </button>
      </form>

      {/* Flash message */}
      {message && (
        <div className={`mb-4 rounded-lg border px-4 py-3 text-sm ${
          message.type === "error"
            ? "border-red-500/30 bg-red-500/10 text-red-400"
            : "border-green-500/30 bg-green-500/10 text-green-400"
        }`}>
          {message.text}
        </div>
      )}

      {/* Results */}
      {hasSearched && !searching && (
        results.length === 0 ? (
          <div className="rounded-xl border border-matte-800 bg-matte-900 py-12 text-center">
            <p className="text-sm text-matte-500">No users found for "{query}"</p>
          </div>
        ) : (
          <div className="rounded-xl border border-matte-800 bg-matte-900 divide-y divide-matte-800">
            {results.map((user) => (
              <div key={user.id} className="flex items-center gap-4 p-4">
                {user.imageUrl ? (
                  <img
                    src={user.imageUrl}
                    alt={user.email}
                    className="h-10 w-10 flex-shrink-0 rounded-full object-cover bg-matte-800"
                  />
                ) : (
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-matte-800">
                    <UserCircle size={24} className="text-matte-600" />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white truncate">
                    {[user.firstName, user.lastName].filter(Boolean).join(" ") || "No name"}
                  </p>
                  <p className="text-xs text-matte-500 truncate">{user.email}</p>
                </div>

                <div className="flex flex-shrink-0 items-center gap-3">
                  {user.role === "admin" && (
                    <span className="rounded-full border border-crimson-DEFAULT/40 bg-crimson-DEFAULT/10 px-2.5 py-1 text-xs font-medium text-crimson-DEFAULT">
                      Admin
                    </span>
                  )}
                  {user.role === "admin" ? (
                    <button
                      onClick={() => setRole(user.id, null)}
                      disabled={updating === user.id}
                      className="flex items-center gap-1.5 rounded-lg border border-matte-700 px-3 py-1.5 text-xs font-medium text-matte-400 transition-colors hover:border-red-500/40 hover:text-red-400 disabled:opacity-40"
                    >
                      {updating === user.id ? (
                        <Loader2 size={13} className="animate-spin" />
                      ) : (
                        <ShieldOff size={13} />
                      )}
                      Remove Admin
                    </button>
                  ) : (
                    <button
                      onClick={() => setRole(user.id, "admin")}
                      disabled={updating === user.id}
                      className="flex items-center gap-1.5 rounded-lg border border-crimson-DEFAULT/40 bg-crimson-DEFAULT/10 px-3 py-1.5 text-xs font-medium text-crimson-DEFAULT transition-colors hover:bg-crimson-DEFAULT/20 disabled:opacity-40"
                    >
                      {updating === user.id ? (
                        <Loader2 size={13} className="animate-spin" />
                      ) : (
                        <ShieldCheck size={13} />
                      )}
                      Make Admin
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}