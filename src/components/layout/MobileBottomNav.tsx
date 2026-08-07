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
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-matte-800 bg-matte-black/95 backdrop-blur-md lg:hidden">
      <div className="flex items-center justify-around py-2">
        <Link
          href="/"
          className={`flex flex-col items-center gap-0.5 px-3 py-1 text-xs transition-colors ${
            isActive("/") ? "text-white" : "text-matte-500 hover:text-white"
          }`}
        >
          <Home size={20} strokeWidth={1.5} />
          <span className="text-[10px]">Home</span>
        </Link>

        <Link
          href="/movies"
          className={`flex flex-col items-center gap-0.5 px-3 py-1 text-xs transition-colors ${
            isActive("/movies") ? "text-white" : "text-matte-500 hover:text-white"
          }`}
        >
          <Film size={20} strokeWidth={1.5} />
          <span className="text-[10px]">Movies</span>
        </Link>

        <Link
          href="/watchlist"
          className={`flex flex-col items-center gap-0.5 px-3 py-1 text-xs transition-colors ${
            isActive("/watchlist") ? "text-white" : "text-matte-500 hover:text-white"
          }`}
        >
          <Bookmark size={20} strokeWidth={1.5} />
          <span className="text-[10px]">My List</span>
        </Link>

        <Link
          href="/account"
          className={`flex flex-col items-center gap-0.5 px-3 py-1 text-xs transition-colors ${
            isActive("/account") ? "text-white" : "text-matte-500 hover:text-white"
          }`}
        >
          <User size={20} strokeWidth={1.5} />
          <span className="text-[10px]">Account</span>
        </Link>
      </div>
    </div>
  );
}