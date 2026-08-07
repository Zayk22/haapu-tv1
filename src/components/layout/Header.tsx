"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, Bookmark, ChevronDown, Settings, LogOut, User, Shield } from "lucide-react";
import { useAuth, useUser, useClerk } from "@clerk/nextjs";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import SearchOverlay from "@/components/layout/SearchOverlay";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Movies", href: "/movies" },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useClerk();
  const { userId, sessionClaims } = useAuth();
  const { user } = useUser();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isAdmin = (sessionClaims as any)?.role === "admin";

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setAccountOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "/" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
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

  const displayName = user?.firstName || user?.username || "Account";
  const avatarUrl = user?.imageUrl;
  const initials = (user?.firstName?.[0] || user?.username?.[0] || "U").toUpperCase();

  return (
    <>
      <header
        className={`fixed top-0 z-50 w-full transition-all duration-500 ${
          isScrolled ? "bg-matte-black/95 backdrop-blur-md shadow-elevated" : "bg-gradient-to-b from-matte-black/90 to-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-screen-2xl items-center justify-between px-4 py-3 lg:px-12 lg:py-4">

          {/* LEFT — logo + nav */}
          <div className="flex items-center gap-6 lg:gap-10">
            <Link href="/" className="flex-shrink-0">
              <img src="/logo.png" alt="Haapu TV" className="h-12 w-auto object-contain" />
            </Link>
            <nav className="hidden items-center gap-8 lg:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative text-sm font-medium transition-colors duration-300 ${
                    isActive(link.href) ? "text-white" : "text-matte-400 hover:text-white"
                  }`}
                >
                  {link.label}
                  {isActive(link.href) && (
                    <span className="absolute -bottom-1 left-0 right-0 h-[2px] rounded-full bg-gold" />
                  )}
                </Link>
              ))}
            </nav>
          </div>

          {/* RIGHT — icons + account */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 rounded-full p-2 text-matte-400 transition-all hover:text-white"
              aria-label="Search"
            >
              <Search size={20} strokeWidth={1.5} />
            </button>

            <SignedIn>
              <Link
                href="/watchlist"
                className={`hidden lg:flex h-9 w-9 items-center justify-center rounded-full transition-all ${
                  pathname === "/watchlist" ? "text-white" : "text-matte-400 hover:text-white"
                }`}
                aria-label="My List"
              >
                <Bookmark size={18} strokeWidth={1.5} />
              </Link>

              {/* Netflix-style account dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setAccountOpen(!accountOpen)}
                  className="flex items-center gap-1.5 rounded-md p-1 transition-all hover:bg-white/10"
                  aria-label="Account menu"
                >
                  {/* Avatar */}
                  <div className="relative h-8 w-8 overflow-hidden rounded flex-shrink-0" style={{ backgroundColor: "#E50914" }}>
                    {avatarUrl ? (
                      <img src={avatarUrl} alt={displayName} className="h-full w-full object-cover" />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center text-sm font-bold text-white">
                        {initials}
                      </span>
                    )}
                  </div>
                  <ChevronDown
                    size={14}
                    className={`text-white transition-transform duration-200 ${accountOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {/* Dropdown */}
                {accountOpen && (
                  <div className="absolute right-0 top-full mt-2 w-60 overflow-hidden rounded-lg border border-matte-800 bg-matte-900/98 shadow-2xl backdrop-blur-md z-50">
                    {/* User info header */}
                    <div className="flex items-center gap-3 border-b border-matte-800 px-4 py-3">
                      <div className="h-10 w-10 overflow-hidden rounded flex-shrink-0" style={{ backgroundColor: "#E50914" }}>
                        {avatarUrl ? (
                          <img src={avatarUrl} alt={displayName} className="h-full w-full object-cover" />
                        ) : (
                          <span className="flex h-full w-full items-center justify-center text-sm font-bold text-white">
                            {initials}
                          </span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-white text-sm">{displayName}</p>
                        <p className="truncate text-xs text-matte-500">{user?.primaryEmailAddress?.emailAddress}</p>
                      </div>
                    </div>

                    {/* Menu items */}
                    <div className="py-2">
                      <Link
                        href="/account"
                        onClick={() => setAccountOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-matte-300 transition-colors hover:bg-matte-800 hover:text-white"
                      >
                        <User size={15} />
                        Manage Account
                      </Link>
                      <Link
                        href="/watchlist"
                        onClick={() => setAccountOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-matte-300 transition-colors hover:bg-matte-800 hover:text-white"
                      >
                        <Bookmark size={15} />
                        My List
                      </Link>
                      {isAdmin && (
                        <Link
                          href="/admin"
                          onClick={() => setAccountOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-matte-800"
                          style={{ color: "#D4AF37" }}
                        >
                          <Shield size={15} />
                          Admin Panel
                        </Link>
                      )}
                    </div>

                    {/* Sign out */}
                    <div className="border-t border-matte-800 py-2">
                      <button
                        onClick={() => { setAccountOpen(false); signOut({ redirectUrl: "/" }); }}
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-matte-300 transition-colors hover:bg-matte-800 hover:text-red-400"
                      >
                        <LogOut size={15} />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </SignedIn>

            <SignedOut>
              <Link
                href="/sign-in"
                className="rounded-lg border border-matte-700 px-4 py-2 text-sm font-medium text-matte-300 transition-all hover:border-matte-500 hover:text-white"
              >
                Sign In
              </Link>
            </SignedOut>
          </div>
        </div>
      </header>

      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}