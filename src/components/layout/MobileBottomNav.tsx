"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Film, Bookmark, User } from "lucide-react";
import { useAuth } from "@clerk/nextjs";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { userId } = useAuth();

  // Only show on authenticated pages, not on marketing, admin, or watch pages
  if (!userId) return null;
  if (pathname === "/" && !userId) return null;
  if (pathname?.startsWith("/admin")) return null;
  if (pathname?.startsWith("/watch")) return null;

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname?.startsWith(href);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-matte-800/60 bg-matte-black/95 backdrop-blur-lg lg:hidden safe-bottom">
      <div className="flex items-center justify-around py-1.5">
        <Link
          href="/"
          className={`relative flex flex-col items-center gap-0.5 px-3 py-1 text-xs transition-colors ${
            isActive("/") ? "text-white" : "text-matte-500 hover:text-white"
          }`}
        >
          <Home size={22} strokeWidth={1.5} className={isActive("/") ? "text-gold" : ""} />
          <span className="text-[10px] font-medium tracking-wide">Home</span>
          {isActive("/") && (
            <span className="absolute -top-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-gold" />
          )}
        </Link>

        <Link
          href="/movies"
          className={`relative flex flex-col items-center gap-0.5 px-3 py-1 text-xs transition-colors ${
            isActive("/movies") ? "text-white" : "text-matte-500 hover:text-white"
          }`}
        >
          <Film size={22} strokeWidth={1.5} className={isActive("/movies") ? "text-gold" : ""} />
          <span className="text-[10px] font-medium tracking-wide">Movies</span>
          {isActive("/movies") && (
            <span className="absolute -top-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-gold" />
          )}
        </Link>

        <Link
          href="/watchlist"
          className={`relative flex flex-col items-center gap-0.5 px-3 py-1 text-xs transition-colors ${
            isActive("/watchlist") ? "text-white" : "text-matte-500 hover:text-white"
          }`}
        >
          <Bookmark size={22} strokeWidth={1.5} className={isActive("/watchlist") ? "text-gold" : ""} />
          <span className="text-[10px] font-medium tracking-wide">My List</span>
          {isActive("/watchlist") && (
            <span className="absolute -top-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-gold" />
          )}
        </Link>

        <Link
          href="/account"
          className={`relative flex flex-col items-center gap-0.5 px-3 py-1 text-xs transition-colors ${
            isActive("/account") ? "text-white" : "text-matte-500 hover:text-white"
          }`}
        >
          <User size={22} strokeWidth={1.5} className={isActive("/account") ? "text-gold" : ""} />
          <span className="text-[10px] font-medium tracking-wide">Account</span>
          {isActive("/account") && (
            <span className="absolute -top-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-gold" />
          )}
        </Link>
      </div>
    </div>
  );
}