"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Film, Bookmark, User } from "lucide-react";
import { SignedIn, SignedOut } from "@clerk/nextjs";

const items = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/movies", icon: Film, label: "Movies" },
  { href: "/watchlist", icon: Bookmark, label: "My List" },
  { href: "/account", icon: User, label: "Profile" },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname?.startsWith(href);
  };

  return (
    // Only visible on mobile — desktop uses the header nav
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-matte-black/95 backdrop-blur-md border-t border-matte-800">
      <div className="flex items-center justify-around px-2 py-2 safe-area-pb">
        {items.map(({ href, icon: Icon, label }) => {
          // Hide "My List" and "Profile" when not signed in — show sign in instead
          if (href === "/watchlist" || href === "/account") {
            return (
              <SignedIn key={href}>
                <Link
                  href={href}
                  className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg transition-colors duration-200 min-w-[56px] ${
                    isActive(href)
                      ? "text-white"
                      : "text-matte-600 hover:text-matte-400"
                  }`}
                >
                  <Icon
                    size={22}
                    strokeWidth={isActive(href) ? 2 : 1.5}
                    className={isActive(href) ? "text-white" : ""}
                  />
                  <span className="text-[10px] font-medium leading-none">
                    {label}
                  </span>
                  {isActive(href) && (
                    <span className="absolute bottom-1.5 w-1 h-1 rounded-full bg-crimson-DEFAULT" />
                  )}
                </Link>
              </SignedIn>
            );
          }

          return (
            <Link
              key={href}
              href={href}
              className={`relative flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg transition-colors duration-200 min-w-[56px] ${
                isActive(href)
                  ? "text-white"
                  : "text-matte-600 hover:text-matte-400"
              }`}
            >
              <Icon
                size={22}
                strokeWidth={isActive(href) ? 2 : 1.5}
              />
              <span className="text-[10px] font-medium leading-none">
                {label}
              </span>
              {isActive(href) && (
                <span className="absolute bottom-1 w-1 h-1 rounded-full bg-crimson-DEFAULT" />
              )}
            </Link>
          );
        })}

        {/* Show sign-in shortcut when logged out */}
        <SignedOut>
          <Link
            href="/sign-in"
            className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg text-matte-600 hover:text-matte-400 transition-colors duration-200 min-w-[56px]"
          >
            <User size={22} strokeWidth={1.5} />
            <span className="text-[10px] font-medium leading-none">Sign In</span>
          </Link>
        </SignedOut>
      </div>
    </nav>
  );
}