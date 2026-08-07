"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

export default function MarketingHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Covenant Member", href: "/covenant" },
    { label: "Watch", href: "/sign-up" },
    { label: "FAQs", href: "/faq" },
    { label: "Sign Up", href: "/sign-up" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-black/95 backdrop-blur-sm"
          : "bg-gradient-to-b from-black/60 to-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-screen-xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
        <Link href="/">
          <img src="/logo.png" alt="Haapu TV" className="h-8 w-auto object-contain sm:h-10 md:h-12" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          {navLinks.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="text-sm font-medium text-white/80 hover:text-white transition-colors"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Right side: Watch TV CTA + Mobile toggle */}
        <div className="flex items-center gap-3">
          <Link
            href="/sign-up"
            className="rounded-lg px-4 py-2 text-xs font-bold text-white transition-all hover:opacity-90 hover:scale-105 sm:px-5 sm:py-2.5 sm:text-sm"
            style={{ backgroundColor: "#E50914" }}
          >
            Watch TV
          </Link>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex flex-col gap-1.5 p-1 text-white transition-colors hover:text-[#D4AF37]"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X size={24} />
            ) : (
              <>
                <span className="block h-0.5 w-6 bg-current" />
                <span className="block h-0.5 w-6 bg-current" />
                <span className="block h-0.5 w-6 bg-current" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-black/95 backdrop-blur-sm border-b border-white/10"
          >
            <div className="flex flex-col space-y-1 px-4 py-4">
              {navLinks.map(({ label, href }) => (
                <Link
                  key={href}
                  href={href}
                  className="px-3 py-2.5 text-sm font-medium text-white/80 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}