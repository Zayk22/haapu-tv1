"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Play, ChevronDown, Heart, Smartphone, Laptop, Tv, ArrowUp } from "lucide-react";

const FAQS = [
  {
    q: "What is Haapu TV?",
    a: "Haapu TV is a free, community-supported, trusted family friendly streaming platform, offering exceptional movies, shows, and documentaries for all ages. Haapu TV offers unlimited access to viewer-supported Haapu Original entertainment designed to inspire, uplift, and unite through meaningful storytelling. Each Haapu TV title is chosen and refined by the Covenant Members — a body of members that decides which films and shows are made and distributed by Haapu TV.",
  },
  {
    q: "How much does Haapu TV cost?",
    a: "Haapu TV offers free access to its entertainment — no payment or credit card required. Enjoy meaningful storytelling without any barriers. You can help keep Haapu TV free by becoming a Covenant Member, investing, or choosing to Pay As You Like. While all shows will eventually be available to everyone, Covenant Members get exclusive early access to new movies and TV shows during a special release window.",
  },
  {
    q: "How is Haapu TV able to offer free streaming?",
    a: "Haapu TV is dedicated to making life-changing content accessible to everyone. Our free service is made possible through the generous support of Covenant Members, Pay As You Like contributions, and sponsorships. Your support helps us stay committed to providing uplifting, family-friendly entertainment for audiences around the globe.",
  },
  {
    q: "What can I watch on Haapu TV?",
    a: "Haapu TV offers a variety of inspiring, family-friendly entertainment, including original series, movies, unique comedy shows, and live music events. We're constantly adding new, compelling projects to our lineup. Want a voice in shaping Haapu TV's content? Become a Covenant Member and influence the films and shows added to our platform.",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/10 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-4 py-5 text-left"
      >
        <span className="font-display text-lg font-semibold text-white sm:text-xl">
          {q}
        </span>
        <ChevronDown
          size={20}
          className={`flex-shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          style={{ color: "#D4AF37" }}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          open ? "max-h-96 pb-5" : "max-h-0"
        }`}
      >
        <p className="text-body leading-relaxed text-white/70">{a}</p>
      </div>
    </div>
  );
}

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

// ── BACK TO TOP BUTTON ──────────────────────────────────────────────
function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-8 right-8 z-50 flex h-12 w-12 items-center justify-center rounded-full transition-all duration-300 hover:scale-110 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
      }`}
      style={{ backgroundColor: "#D4AF37", color: "#0A0A0A" }}
      aria-label="Back to top"
    >
      <ArrowUp size={20} />
    </button>
  );
}

export default function MarketingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="bg-black">

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
    
    {/* Desktop Navigation - Hidden on mobile */}
    <div className="hidden md:flex items-center gap-6 lg:gap-8">
      <Link href="/" className="text-sm font-medium text-white/80 hover:text-white transition-colors">
        Home
      </Link>
      <Link href="/covenant" className="text-sm font-medium text-white/80 hover:text-white transition-colors">
        Covenant Member
      </Link>
      <Link href="/watch" className="text-sm font-medium text-white/80 hover:text-white transition-colors">
        Watch
      </Link>
      <Link href="/faq" className="text-sm font-medium text-white/80 hover:text-white transition-colors">
        FAQs
      </Link>
      <Link href="/sign-up" className="text-sm font-medium text-white/80 hover:text-white transition-colors">
        Sign Up
      </Link>
    </div>

    {/* Right side - Watch TV button + Mobile Menu Toggle */}
    <div className="flex items-center gap-3">
      <Link
        href="/sign-up"
        className="rounded-lg px-4 py-2 text-xs font-bold text-white transition-all hover:opacity-90 hover:scale-105 sm:px-5 sm:py-2.5 sm:text-sm"
        style={{ backgroundColor: "#E50914" }}
      >
        Watch TV
      </Link>
      
      {/* Mobile Hamburger Menu */}
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

  {/* Mobile Menu Dropdown */}
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
            className="px-3 py-2.5 text-sm font-medium text-white/80 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
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

      {/* ── SECTION 1: HERO ────────────────────────────────────── */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 text-center sm:px-12">
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "url('/images/marketing/haapu-tv.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-4xl"
        >
          <div className="mb-8 flex justify-center">
            <img
              src="/logo.png"
              alt="Haapu TV"
              className="h-24 w-auto object-contain sm:h-32 md:h-40 lg:h-48"
            />
          </div>

          <h1 className="font-display text-4xl font-bold text-white sm:text-5xl lg:text-6xl xl:text-7xl">
            We Are Haapu
          </h1>

          <p className="mx-auto mt-4 max-w-3xl text-base leading-relaxed text-white/80 sm:text-lg lg:text-xl">
            A Platform Where Faith and Entertainment Comes Alive!
          </p>

          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/sign-up"
              className="flex w-full items-center justify-center gap-2.5 rounded-lg px-8 py-4 text-base font-bold text-white transition-all duration-300 hover:opacity-90 hover:scale-105 active:scale-95 sm:w-auto sm:px-10 sm:py-4 sm:text-lg"
              style={{ backgroundColor: "#E50914" }}
            >
              <Play size={20} fill="currentColor" />
              WATCH NOW
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ── SECTION 2: JOIN THE MOVEMENT ───────────────────────── */}
      <section className="relative overflow-hidden w-full py-0">
        <div className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
          <div className="relative w-full min-h-[80vh] lg:min-h-[90vh]">
            
            <div className="absolute inset-0 w-full h-full">
              <img
                src="/images/marketing/hero-background.jpg"
                alt="Join the Movement"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            </div>

            <div className="relative z-10 flex items-end h-full min-h-[80vh] lg:min-h-[90vh]">
              <div className="w-full max-w-4xl px-6 pb-16 sm:px-12 sm:pb-20 lg:pb-24">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="text-left"
                >
                  <div
                    className="mb-4 inline-flex items-center gap-2 rounded-full border px-4 py-1.5"
                    style={{
                      borderColor: "rgba(212,175,55,0.3)",
                      backgroundColor: "rgba(212,175,55,0.08)",
                    }}
                  >
                    <span
                      className="text-xs font-medium uppercase tracking-widest"
                      style={{ color: "#D4AF37" }}
                    >
                      Join the Movement
                    </span>
                  </div>

                  <h2 className="font-display text-4xl font-bold text-white sm:text-5xl lg:text-6xl leading-tight max-w-3xl">
                    JOIN THE <span style={{ color: "#D4AF37" }}>MOVEMENT</span>
                  </h2>

                  <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
                    Step into a world where your voice shapes the screen. Discover shows 
                    and movies powered by you, for your family. Start now. Your support 
                    makes the difference.
                  </p>

                  <Link
                    href="/covenant"
                    className="mt-8 inline-flex items-center gap-3 rounded-lg px-8 py-4 text-base font-bold transition-all duration-300 hover:opacity-90 hover:scale-105"
                    style={{ backgroundColor: "#D4AF37", color: "#0A0A0A" }}
                  >
                    <Heart size={20} fill="currentColor" />
                    COVENANT MEMBER
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 3: STREAM AMAZING CONTENT FOR FREE ────────── */}
      <section className="relative overflow-hidden px-6 py-24 sm:px-12 sm:py-32">
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "url('/images/marketing/features-collage.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative z-10 mx-auto max-w-4xl text-center"
        >
          <div
            className="mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5"
            style={{
              borderColor: "rgba(212,175,55,0.3)",
              backgroundColor: "rgba(212,175,55,0.08)",
            }}
          >
            <span
              className="text-xs font-medium uppercase tracking-widest"
              style={{ color: "#D4AF37" }}
            >
              Stream Amazing Content
            </span>
          </div>

          <h2 className="font-display text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
            STREAM AMAZING <br />
            <span style={{ color: "#D4AF37" }}>CONTENT FOR FREE!</span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/80 sm:text-xl">
            Brought to you by our incredible Covenant Members.
          </p>

          <p className="mt-2 text-base text-white/60">
            Not a member yet? Start now and join us in this journey.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-5">
            <Link
              href="/covenant"
              className="w-full rounded-lg px-8 py-4 text-center text-base font-bold transition-all duration-300 hover:opacity-90 hover:scale-105 sm:w-auto sm:px-10 sm:py-4 sm:text-lg"
              style={{ backgroundColor: "#D4AF37", color: "#0A0A0A" }}
            >
              COVENANT MEMBER
            </Link>
            <Link
              href="/sign-up"
              className="w-full rounded-lg border-2 border-white/30 px-8 py-4 text-center text-base font-semibold text-white transition-all duration-300 hover:border-white/60 hover:text-white sm:w-auto sm:px-10 sm:py-4 sm:text-lg"
            >
              SIGN UP FOR FREE
            </Link>
          </div>

          <p className="mt-8 text-sm text-white/40">
            <span className="text-white/50">ALADE WURA</span> · FAITHWIRE
          </p>
        </motion.div>
      </section>

      {/* ── SECTION 4: STREAM ANYTIME, ANYWHERE ────────────────── */}
      <section className="relative overflow-hidden px-6 py-32 sm:px-12 sm:py-40">
        <div className="w-full">
          <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-10">
            
            <div className="w-full lg:w-[65%] flex-shrink-0 lg:pl-0">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="w-full"
              >
                <div className="relative w-full">
                  <img
                    src="/images/marketing/covenant-bg.jpg"
                    alt="Stream Anytime, Anywhere"
                    className="w-full h-auto object-contain"
                  />
                </div>
              </motion.div>
            </div>

            <div className="w-full lg:w-[35%] flex-shrink-0 lg:pr-4 flex items-center">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="w-full mx-auto lg:mx-0"
              >
                <div
                  className="mb-5 inline-flex items-center gap-2 rounded-full border px-4 py-1.5"
                  style={{
                    borderColor: "rgba(212,175,55,0.3)",
                    backgroundColor: "rgba(212,175,55,0.08)",
                  }}
                >
                  <span
                    className="text-xs font-medium uppercase tracking-widest"
                    style={{ color: "#D4AF37" }}
                  >
                    Stream Anytime, Anywhere
                  </span>
                </div>

                <h2 className="font-display text-4xl font-bold text-white sm:text-5xl lg:text-5xl leading-tight">
                  STREAM ANYTIME, <br />
                  <span style={{ color: "#D4AF37" }}>ANYWHERE!</span>
                </h2>

                <p className="mt-4 text-base leading-relaxed text-white/80 sm:text-lg">
                  Watch on your phone, tablet, laptop, or TV. Haapu TV works on every 
                  device so your favourite content is always within reach.
                </p>

                <div className="mt-6 flex gap-10 text-white/60">
                  <div className="flex flex-col items-center gap-2 transition-all duration-300 hover:text-[#D4AF37] cursor-pointer">
                    <Smartphone size={36} className="transition-colors duration-300" />
                    <span className="text-sm">Phone</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 transition-all duration-300 hover:text-[#D4AF37] cursor-pointer">
                    <Laptop size={36} className="transition-colors duration-300" />
                    <span className="text-sm">Laptop</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 transition-all duration-300 hover:text-[#D4AF37] cursor-pointer">
                    <Tv size={36} className="transition-colors duration-300" />
                    <span className="text-sm">TV</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────── */}
      <section className="px-6 py-24 sm:px-12 sm:py-32">
        <div className="mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-12 text-center">
              <h2 className="font-display text-4xl font-bold text-white sm:text-5xl">
                Frequently asked questions
              </h2>
              <p className="mt-4 text-lg text-white/50">
                Everything you need to know
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm px-6 sm:px-8">
              {FAQS.map((faq) => (
                <FAQItem key={faq.q} q={faq.q} a={faq.a} />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────── */}
      <section className="px-6 pb-24 sm:px-12 sm:pb-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl rounded-2xl border p-10 text-center sm:p-16"
          style={{
            borderColor: "rgba(212,175,55,0.15)",
            background:
              "linear-gradient(135deg, rgba(212,175,55,0.05), rgba(10,10,10,0.95), rgba(229,9,20,0.03))",
          }}
        >
          <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
            Ready to start watching?
          </h2>
          <p className="mt-4 text-lg text-white/60">
            Join thousands of families already streaming on Haapu TV.
          </p>
          <Link
            href="/sign-up"
            className="mt-8 inline-flex items-center gap-3 rounded-lg px-10 py-4 text-lg font-bold text-white transition-all duration-300 hover:opacity-90 hover:scale-105 sm:px-12 sm:py-5"
            style={{ backgroundColor: "#E50914" }}
          >
            <Play size={20} fill="currentColor" />
            Get Started Free
          </Link>
        </motion.div>
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

      {/* ── BACK TO TOP BUTTON ──────────────────────────────────── */}
      <BackToTopButton />
    </div>
  );
}