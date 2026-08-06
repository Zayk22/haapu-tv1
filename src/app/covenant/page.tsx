"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronDown, Heart } from "lucide-react";
import FeaturedMovie from "@/components/covenant/FeaturedMovie";

// ── FAQ ITEM COMPONENT ──────────────────────────────────────────────
function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/10 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-4 py-6 text-left"
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
          open ? "max-h-96 pb-6" : "max-h-0"
        }`}
      >
        <p className="text-body leading-relaxed text-white/70">{a}</p>
      </div>
    </div>
  );
}

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

export default function CovenantPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const faqs = [
    {
      q: "What is a Covenant Member?",
      a: "A Covenant Member is a financial partner who believes in free, faith-forward entertainment for every family. Covenant Members provide the foundation that keeps Haapu TV free for everyone.",
    },
    {
      q: "What do Covenant Members get?",
      a: "Covenant Members get exclusive early access to new releases, a vote in shaping what gets made next, behind-the-scenes content, and the satisfaction of knowing they're making a difference.",
    },
    {
      q: "How much does it cost to become a Covenant Member?",
      a: "Covenant Members contribute at whatever level feels right for them. Every contribution, no matter the size, helps keep Haapu TV free for the community.",
    },
    {
      q: "How is Haapu TV different from other streaming platforms?",
      a: "Haapu TV is community-powered. Covenant Members decide which films and shows are made and distributed. Your voice shapes the screen. Plus, it's always free to watch.",
    },
  ];

  return (
    <div className="bg-black">

      {/* ── NAVBAR ──────────────────────────────────────────────── */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-black/95 backdrop-blur-sm' : 'bg-gradient-to-b from-black/60 to-transparent'
        }`}
      >
        <div className="mx-auto flex max-w-screen-xl items-center justify-between px-6 py-4 sm:px-12">
          <Link href="/">
            <img src="/logo.png" alt="Haapu TV" className="h-10 w-auto object-contain sm:h-12" />
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm font-medium text-white/80 hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/covenant" className="text-sm font-medium text-white transition-colors" style={{ color: "#D4AF37" }}>
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

          <Link
            href="/sign-up"
            className="rounded-lg px-5 py-2.5 text-sm font-bold text-white transition-all hover:opacity-90 hover:scale-105"
            style={{ backgroundColor: "#E50914" }}
          >
            Watch TV
          </Link>
        </div>
      </header>

      {/* ── SECTION 1: HERO ────────────────────────────────────── */}
      <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden px-6 text-center sm:px-12">
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
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-4xl"
        >
          <div
            className="mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5"
            style={{
              borderColor: "rgba(212,175,55,0.4)",
              backgroundColor: "rgba(212,175,55,0.1)",
            }}
          >
            <span
              className="text-xs font-medium uppercase tracking-widest"
              style={{ color: "#D4AF37" }}
            >
              Join the Amazing
            </span>
          </div>

          <h1 className="font-display text-5xl font-bold leading-tight text-white sm:text-6xl lg:text-7xl xl:text-8xl">
            Become A <br />
            <span style={{ color: "#D4AF37" }}>Covenant Member</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/80 sm:text-xl">
            Join a community of believers shaping the future of faith-forward entertainment.
            Your support keeps Haapu TV free for every family.
          </p>

          <Link
            href="https://haapu.tv/give"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-10 inline-flex items-center gap-3 rounded-lg px-10 py-4 text-lg font-bold transition-all duration-300 hover:opacity-90 hover:scale-105"
            style={{ backgroundColor: "#D4AF37", color: "#0A0A0A" }}
          >
            <Heart size={20} fill="currentColor" />
            Join Now
          </Link>
        </motion.div>

        <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 animate-bounce">
          <div className="h-10 w-6 rounded-full border-2 border-white/30 flex items-start justify-center p-1">
            <div className="h-2 w-1 rounded-full bg-white/50" />
          </div>
        </div>
      </section>

      {/* ── SECTION 2: FEATURED MOVIE ──────────────────────────── */}
      <FeaturedMovie
        title="African Rhapsody"
        description="Experience the rhythm of faith and culture in this powerful cinematic journey. African Rhapsody celebrates the beauty of worship, community, and the unbreakable spirit of a people united in faith."
        videoId="4kvvngejl9"
        posterUrl="/images/african-rhapsody.jpg"
        backdropUrl="/images/marketing/hero-background.jpg"
        year={2024}
        rating={8.7}
        duration="1h 45min"
        genre="Drama • Music"
        slug="african-rhapsody"
      />

      {/* ── SECTION 3: MISSION STATEMENT ───────────────────────── */}
      <section className="relative overflow-hidden px-6 py-24 sm:px-12 sm:py-32" style={{ backgroundColor: "#1a1410" }}>
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
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
                Our Mission
              </span>
            </div>

            <h2 className="font-display text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
              YOUR GIVING <br />
              <span style={{ color: "#D4AF37" }}>MAKES A DIFFERENCE</span>
            </h2>

            <div className="mt-8 space-y-6 text-center">
              <p className="text-lg leading-relaxed text-white/70 sm:text-xl">
                Covenant Members are the heartbeat of Haapu TV. Your generous support 
                ensures that faith-forward, family-friendly entertainment remains 
                free for everyone, everywhere.
              </p>

              <p className="text-lg leading-relaxed text-white/60 sm:text-xl">
                When you become a Covenant Member, you're not just giving — you're 
                shaping the stories that inspire, uplift, and unite families around 
                the world.
              </p>

              <p className="text-lg leading-relaxed text-white/50 sm:text-xl">
                Every contribution, no matter the size, helps keep Haapu TV free 
                and empowers us to create more life-changing content.
              </p>
            </div>

            <Link
              href="https://haapu.tv/give"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-10 inline-flex items-center gap-3 rounded-lg px-10 py-4 text-lg font-bold transition-all duration-300 hover:opacity-90 hover:scale-105"
              style={{ backgroundColor: "#D4AF37", color: "#0A0A0A" }}
            >
              <Heart size={20} fill="currentColor" />
              Become a Covenant Member
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── SECTION 4: FAQ ──────────────────────────────────────── */}
      <section className="px-6 py-24 sm:px-12 sm:py-32">
        <div className="mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-12 text-left">
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
                  Got Questions?
                </span>
              </div>
              <h2 className="font-display text-4xl font-bold text-white sm:text-5xl">
                Frequently Asked Questions
              </h2>
              <p className="mt-4 text-lg text-white/40">
                Everything you need to know about becoming a Covenant Member
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 px-6 sm:px-8">
              {faqs.map((faq) => (
                <FAQItem key={faq.q} q={faq.q} a={faq.a} />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────── */}
      <footer className="border-t border-white/10 px-6 py-12 sm:px-12 sm:py-16">
        <div className="mx-auto max-w-screen-xl">
          <div className="flex flex-col items-center gap-8">
            <img
              src="/logo.png"
              alt="Haapu TV"
              className="h-12 w-auto object-contain sm:h-14"
            />
            
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/40">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <Link href="/covenant" className="hover:text-white transition-colors" style={{ color: "#D4AF37" }}>Covenant Member</Link>
              <Link href="/watch" className="hover:text-white transition-colors">Watch</Link>
              <Link href="/faq" className="hover:text-white transition-colors">FAQs</Link>
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            </div>

            <div className="flex items-center gap-6">
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

            <div className="mt-6 border-t border-white/10 pt-6 text-center text-sm text-white/30">
              © {new Date().getFullYear()} Haapu TV. All Rights Reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}