"use client";

import { useState } from "react";
import Link from "next/link";
import { Play, ChevronDown, Tv, Shield, Users, Zap, Heart } from "lucide-react";

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

const FEATURES = [
  {
    icon: Tv,
    title: "Stream Amazing Content for Free",
    description:
      "Brought to you by our incredible Covenant Members. Access movies, shows, and documentaries — no subscription, no credit card. Just great content.",
  },
  {
    icon: Zap,
    title: "Stream Anytime, Anywhere",
    description:
      "Watch on your phone, tablet, laptop, or TV. Haapu TV works on every device so your favourite content is always within reach.",
  },
  {
    icon: Users,
    title: "Community Powered",
    description:
      "Covenant Members decide which films and shows are made and distributed. Your voice shapes what you watch.",
  },
  {
    icon: Shield,
    title: "Trusted Family Entertainment",
    description:
      "Every title is hand-picked for families. Faith-forward, uplifting, and safe for all ages — always.",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-matte-800 last:border-0">
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
      <div className={`overflow-hidden transition-all duration-300 ${open ? "max-h-96 pb-5" : "max-h-0"}`}>
        <p className="text-body leading-relaxed text-matte-400">{a}</p>
      </div>
    </div>
  );
}

function SocialIcon({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="text-matte-600 hover:text-white transition-colors duration-200"
    >
      {children}
    </a>
  );
}

export default function MarketingPage() {
  return (
    <div className="bg-matte-black">

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 text-center">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/3 top-1/3 h-[500px] w-[500px] rounded-full blur-[180px]" style={{ backgroundColor: "rgba(212,175,55,0.05)" }} />
          <div className="absolute right-1/3 bottom-1/3 h-[400px] w-[400px] rounded-full blur-[140px]" style={{ backgroundColor: "rgba(229,9,20,0.04)" }} />
        </div>
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(to right, transparent, rgba(212,175,55,0.4), transparent)" }} />

        <div className="relative z-10 max-w-4xl">
          <div
            className="mb-8 inline-flex items-center gap-2 rounded-full border px-4 py-1.5"
            style={{ borderColor: "rgba(212,175,55,0.3)", backgroundColor: "rgba(212,175,55,0.08)" }}
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ backgroundColor: "#D4AF37" }} />
            <span className="text-small font-medium uppercase tracking-widest" style={{ color: "#D4AF37" }}>
              Faith and Entertainment Comes Alive
            </span>
          </div>

          <h1 className="font-display text-5xl font-bold leading-tight text-white sm:text-6xl lg:text-8xl">
            Join the{" "}
            <span style={{ color: "#D4AF37" }}>Movement</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-body-lg leading-relaxed text-matte-300 sm:text-xl">
            Step into a world where your voice shapes the screen. Discover shows
            and movies powered by you, for your family. Start now — your support
            makes the difference.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/sign-up"
              className="flex w-full items-center justify-center gap-2.5 rounded-lg px-8 py-4 text-body font-bold text-white transition-all duration-300 hover:opacity-90 hover:scale-105 active:scale-95 sm:w-auto"
              style={{ backgroundColor: "#E50914" }}
            >
              <Play size={18} fill="currentColor" />
              Start Watching Free
            </Link>
            <Link
              href="/sign-in"
              className="flex w-full items-center justify-center gap-2.5 rounded-lg border border-matte-700 px-8 py-4 text-body font-semibold text-matte-300 transition-all duration-300 hover:border-matte-500 hover:text-white sm:w-auto"
            >
              Sign In
            </Link>
          </div>

          {/* Partner ask — replaces "Free forever. No credit card required." */}
          <div className="mt-6 flex flex-col items-center gap-1.5">
            <p className="text-small text-matte-600">
              Free forever. No credit card required.
            </p>
            <p className="flex items-center gap-1.5 text-small text-matte-500">
              <Heart size={12} className="text-red-500" fill="currentColor" />
              Enjoy it free. Help keep it free —{" "}
              
                href="https://haapu.tv/give"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-white transition-colors"
                style={{ color: "#D4AF37" }}
              >
                become a Covenant Member
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────────── */}
      <section className="px-4 py-20 sm:py-32">
        <div className="mx-auto max-w-screen-xl">
          <div className="mb-16 text-center">
            <h2 className="font-display text-4xl font-bold text-white sm:text-5xl">
              Everything you need, nothing you don't
            </h2>
            <p className="mt-4 text-body-lg text-matte-400">
              Brought to you by our incredible Covenant Members.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="group rounded-2xl border border-matte-800 bg-matte-900 p-6 transition-all duration-300 hover:border-matte-700 hover:bg-matte-800/50"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl" style={{ backgroundColor: "rgba(212,175,55,0.1)" }}>
                  <Icon size={22} style={{ color: "#D4AF37" }} />
                </div>
                <h3 className="mb-2 font-display text-lg font-semibold text-white">{title}</h3>
                <p className="text-caption leading-relaxed text-matte-500">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COVENANT MEMBERS (typo fixed: Members not Memebers) ──── */}
      <section className="relative overflow-hidden px-4 py-20 sm:py-32">
        <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(135deg, rgba(212,175,55,0.04), transparent, rgba(212,175,55,0.02))" }} />
        <div className="relative mx-auto max-w-3xl text-center">
          <div
            className="mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5"
            style={{ borderColor: "rgba(212,175,55,0.3)", backgroundColor: "rgba(212,175,55,0.08)" }}
          >
            <span className="text-small font-medium uppercase tracking-widest" style={{ color: "#D4AF37" }}>
              Covenant Members
            </span>
          </div>

          <h2 className="font-display text-4xl font-bold text-white sm:text-5xl">
            Your support keeps it free
          </h2>
          <p className="mt-6 text-body-lg leading-relaxed text-matte-300">
            Haapu TV is powered by our Covenant Members — people who believe in
            free, faith-forward entertainment for every family. Covenant Members
            get exclusive early access to new releases and a vote in shaping what
            gets made next.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            
              href="https://haapu.tv/give"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full rounded-lg px-8 py-4 text-center text-body font-bold transition-all duration-300 hover:opacity-90 hover:scale-105 sm:w-auto"
              style={{ backgroundColor: "#D4AF37", color: "#0A0A0A" }}
            >
              Become a Covenant Member
            </a>
            <Link
              href="/sign-up"
              className="w-full rounded-lg border border-matte-700 px-8 py-4 text-center text-body font-semibold text-matte-300 transition-all duration-300 hover:border-matte-500 hover:text-white sm:w-auto"
            >
              Watch for Free
            </Link>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────── */}
      <section className="px-4 py-20 sm:py-32">
        <div className="mx-auto max-w-3xl">
          <div className="mb-12 text-center">
            <h2 className="font-display text-4xl font-bold text-white sm:text-5xl">
              Frequently asked questions
            </h2>
            <p className="mt-4 text-body text-matte-400">
              Everything you need to know about Haapu TV.
            </p>
          </div>
          <div className="rounded-2xl border border-matte-800 bg-matte-900 px-6 sm:px-8">
            {FAQS.map((faq) => (
              <FAQItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────── */}
      <section className="px-4 pb-24 sm:pb-32">
        <div
          className="mx-auto max-w-2xl rounded-2xl border p-10 text-center sm:p-16"
          style={{
            borderColor: "rgba(212,175,55,0.15)",
            background: "linear-gradient(135deg, rgba(212,175,55,0.05), rgba(10,10,10,0.95), rgba(229,9,20,0.03))",
          }}
        >
          <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
            Ready to start watching?
          </h2>
          <p className="mt-4 text-body text-matte-300">
            Join thousands of families already streaming on Haapu TV. Free, forever.
          </p>
          <Link
            href="/sign-up"
            className="mt-8 inline-flex items-center gap-2.5 rounded-lg px-8 py-4 text-body font-bold text-white transition-all duration-300 hover:opacity-90 hover:scale-105"
            style={{ backgroundColor: "#E50914" }}
          >
            <Play size={18} fill="currentColor" />
            Get Started Free
          </Link>
        </div>
      </section>

      {/* ── FOOTER — consistent across all pages ─────────────────── */}
      <footer className="border-t border-matte-800 px-4 py-10">
        <div className="mx-auto max-w-screen-xl">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
            <img src="/logo.png" alt="Haapu TV" className="h-10 w-auto object-contain" />
            <div className="flex flex-wrap items-center justify-center gap-6 text-small text-matte-500">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms of Use</Link>
              <Link href="/faq" className="hover:text-white transition-colors">FAQ</Link>
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
          <div className="mt-6 border-t border-matte-800 pt-6 text-center text-small text-matte-600">
            © {new Date().getFullYear()} Haapu TV. All Rights Reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}