"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Bell, User, Bookmark } from "lucide-react";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import SearchOverlay from "@/components/layout/SearchOverlay";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Movies", href: "/movies" },
  { label: "Account", href: "/account" },
];

export default function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (
      e.key === "/" &&
      document.activeElement?.tagName !== "INPUT" &&
      document.activeElement?.tagName !== "TEXTAREA"
    ) {
      e.preventDefault();
      setIsSearchOpen(true);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  if (pathname?.startsWith("/admin")) return null;

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname?.startsWith(href);
  };

  return (
    <>
      <header
        className={`fixed top-0 z-50 w-full transition-all duration-500 ${
          isScrolled
            ? "bg-matte-black/95 backdrop-blur-md shadow-elevated"
            : "bg-gradient-to-b from-matte-black/80 to-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-screen-2xl items-center justify-between px-4 py-3 lg:px-12 lg:py-4">

          {/* LEFT — logo + desktop nav */}
          <div className="flex items-center gap-6 lg:gap-10">
            <Link href="/" className="flex-shrink-0">
              <img
                src="/logo.png"
                alt="Haapu TV"
                className="h-12 w-auto object-contain"
              />
            </Link>

            {/* Desktop nav only — mobile uses bottom nav */}
            <nav className="hidden items-center gap-8 lg:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative text-caption font-medium transition-colors duration-300 ${
                    isActive(link.href)
                      ? "text-white"
                      : "text-matte-500 hover:text-white"
                  }`}
                >
                  {link.label}
                  {/* Gold underline on active link */}
                  {isActive(link.href) && (
                    <span className="absolute -bottom-1 left-0 right-0 h-[2px] rounded-full bg-gold-DEFAULT" />
                  )}
                </Link>
              ))}
            </nav>
          </div>

          {/* RIGHT — icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 rounded-full p-2 text-matte-500 transition-all duration-300 hover:bg-white/5 hover:text-white"
              aria-label="Search"
            >
              <Search size={20} strokeWidth={1.5} />
              <kbd className="hidden rounded border border-matte-700 px-1.5 py-0.5 text-small text-matte-600 lg:inline-block">
                /
              </kbd>
            </button>

            {/* Watchlist — desktop only, bottom nav handles mobile */}
            <Link
              href="/watchlist"
              className={`hidden lg:flex h-9 w-9 items-center justify-center rounded-full transition-all duration-300 ${
                pathname === "/watchlist"
                  ? "text-white"
                  : "text-matte-500 hover:text-white"
              }`}
              aria-label="My List"
            >
              <Bookmark size={18} strokeWidth={1.5} />
            </Link>

            <button
              className="hidden text-matte-500 transition-colors duration-300 hover:text-white lg:block"
              aria-label="Notifications"
            >
              <Bell size={20} strokeWidth={1.5} />
            </button>

            <SignedIn>
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: "h-8 w-8 lg:h-9 lg:w-9",
                    userButtonTrigger: "focus:shadow-none",
                  },
                }}
                afterSignOutUrl="/"
              />
            </SignedIn>

            <SignedOut>
              <Link
                href="/sign-in"
                className="hidden sm:flex items-center gap-2 rounded-lg border border-matte-700 px-4 py-2 text-caption font-medium text-white transition-all hover:border-white/40 hover:bg-white/5"
              >
                Sign In
              </Link>
              {/* Mobile — just icon */}
              <Link
                href="/sign-in"
                className="sm:hidden flex h-9 w-9 items-center justify-center rounded-full bg-matte-800 text-matte-500 transition-all hover:text-white"
                aria-label="Sign in"
              >
                <User size={18} strokeWidth={1.5} />
              </Link>
            </SignedOut>
          </div>
        </div>
      </header>

      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
}