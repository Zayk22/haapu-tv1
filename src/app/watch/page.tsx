"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

// ── SOCIAL ICON COMPONENT ───────────────────────────────────────────
function SocialIcon({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="text-white/40 hover:text-white transition-colors duration-200"
    >
      {children}
    </a>
  );
}

export default function WatchPage() {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Redirect to home if not signed in
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/");
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded || !isSignedIn) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-[#E50914]" />
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen">

      {/* ── NAVBAR ──────────────────────────────────────────────── */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-black/95 backdrop-blur-sm' : 'bg-gradient-to-b from-black/60 to-transparent'
        }`}
      >
        <div className="mx-auto flex max-w-screen-xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
          <Link href="/">
            <img src="/logo.png" alt="Haapu TV" className="h-8 w-auto object-contain sm:h-10 md:h-12" />
          </Link>
          
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            <Link href="/" className="text-sm font-medium text-white/80 hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/covenant" className="text-sm font-medium text-white/80 hover:text-white transition-colors">
              Covenant Member
            </Link>
            <Link href="/watch" className="text-sm font-medium text-white transition-colors" style={{ color: "#D4AF37" }}>
              Watch
            </Link>
            <Link href="/faq" className="text-sm font-medium text-white/80 hover:text-white transition-colors">
              FAQs
            </Link>
            <Link href="/sign-up" className="text-sm font-medium text-white/80 hover:text-white transition-colors">
              Sign Up
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/sign-up"
              className="rounded-lg px-4 py-2 text-xs font-bold text-white transition-all hover:opacity-90 hover:scale-105 sm:px-5 sm:py-2.5 sm:text-sm"
              style={{ backgroundColor: "#E50914" }}
            >
              Watch TV
            </Link>
            
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden flex flex-col gap-1.5 p-1 text-white transition-colors hover:text-[#D4AF37]"
              aria-label="Toggle menu"
            >
              <span className={`block h-0.5 w-6 bg-current transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block h-0.5 w-6 bg-current transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`} />
              <span className={`block h-0.5 w-6 bg-current transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="md:hidden bg-black/95 backdrop-blur-sm border-b border-white/10"
            >
              <div className="flex flex-col space-y-1 px-4 py-4">
                <Link
                  href="/"
                  className="px-3 py-2.5 text-sm font-medium text-white/80 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  href="/covenant"
                  className="px-3 py-2.5 text-sm font-medium text-white/80 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Covenant Member
                </Link>
                <Link
                  href="/watch"
                  className="px-3 py-2.5 text-sm font-medium text-white hover:bg-white/5 rounded-lg transition-colors"
                  style={{ color: "#D4AF37" }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Watch
                </Link>
                <Link
                  href="/faq"
                  className="px-3 py-2.5 text-sm font-medium text-white/80 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  FAQs
                </Link>
                <Link
                  href="/sign-up"
                  className="px-3 py-2.5 text-sm font-medium text-white/80 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ── WATCH PAGE CONTENT ──────────────────────────────────── */}
      <section className="relative overflow-hidden px-6 pt-32 pb-16 sm:px-12 sm:pt-40 sm:pb-24">
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0"
            style={{
              background: "radial-gradient(ellipse at center, rgba(212,175,55,0.08) 0%, rgba(0,0,0,0.95) 70%)",
            }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 mx-auto max-w-4xl text-center"
        >
          <h1 className="font-display text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
            Welcome to <br />
            <span style={{ color: "#D4AF37" }}>Haapu TV</span>
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base text-white/60 sm:text-lg">
            Start watching your favourite shows and movies.
          </p>
        </motion.div>
      </section>

      {/* ── MOVIE GRID ───────────────────────────────────────────── */}
      <section className="px-6 pb-24 sm:px-12 sm:pb-32">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
              Coming Soon
            </h2>
            <p className="mt-2 text-white/40">
              New content is being added regularly. Check back soon!
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
              <div
                key={i}
                className="aspect-[2/3] rounded-lg bg-white/5 animate-pulse border border-white/5"
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────── */}
      <footer className="border-t border-white/10 px-6 py-8 sm:px-12 sm:py-10">
        <div className="mx-auto max-w-screen-xl">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
            <img
              src="/logo.png"
              alt="Haapu TV"
              className="h-10 w-auto object-contain sm:h-12"
            />
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-white/40 sm:gap-6">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
              <Link href="/faq" className="hover:text-white transition-colors">FAQ</Link>
              <Link href="/cookie-preferences" className="hover:text-white transition-colors">Cookies</Link>
              <Link href="/corporate" className="hover:text-white transition-colors">Corporate</Link>
            </div>
            <div className="flex items-center gap-4">
              <SocialIcon href="https://www.facebook.com/haaputv" label="Facebook">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </SocialIcon>
              <SocialIcon href="https://www.twitter.com/haaputv" label="X / Twitter">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </SocialIcon>
              <SocialIcon href="https://www.instagram.com/haaputv" label="Instagram">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </SocialIcon>
            </div>
          </div>
          <div className="mt-6 border-t border-white/10 pt-6 text-center text-sm text-white/30">
            © {new Date().getFullYear()} Haapu TV. All Rights Reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}