"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Plus } from "lucide-react";

// ── FAQ DATA ──────────────────────────────────────────────────────────
const FAQS = [
  {
    q: "What is Haapu TV?",
    a: (
      <>
        <p className="mb-3">
          Haapu TV is a free, community-supported, trusted family friendly streaming platform, offering exceptional movies, shows, and documentaries for all ages. Haapu TV will in the future be offering unlimited access to viewer-supported Haapu Original entertainment designed to inspire, uplift, and unite through meaningful storytelling.
        </p>
        <p className="mb-3">
          Each Haapu TV title will be chosen and refined by the Covenant Members, a body of members that decides which films and shows are made and distributed by Haapu TV.
        </p>
        <p>
          <Link href="/covenant" className="underline underline-offset-2 transition-colors hover:text-[#D4AF37]" style={{ color: "#D4AF37" }}>
            Click here to learn more about the Covenant Membership
          </Link>
          , and join today!
        </p>
      </>
    ),
  },
  {
    q: "How much does Haapu TV cost?",
    a: (
      <>
        <p className="mb-3">
          Haapu TV offers free access to its entertainment—no payment or credit card required. Enjoy meaningful storytelling without any barriers.
        </p>
        <p className="mb-3">
          You can help keep Haapu TV free by becoming a Covenant Member, investing, or choosing to Pay As You Like.
        </p>
        <p>
          While all shows will eventually be available to everyone, Covenant Members get exclusive early access to new movies and TV shows during a special release window.
        </p>
      </>
    ),
  },
  {
    q: "How is Haapu TV able to offer free streaming?",
    a: (
      <>
        <p className="mb-3">
          Haapu TV is dedicated to making life changing content accessible to everyone.
        </p>
        <p className="mb-3">
          Our free service is made possible through the generous support of Covenant Members, Pay As You Like, and sponsorships.
        </p>
        <p>
          Your support helps us stay committed to providing uplifting, family-friendly entertainment for audiences around the globe.
        </p>
      </>
    ),
  },
  {
    q: "What can I watch on Haapu TV?",
    a: (
      <>
        <p className="mb-3">
          Haapu TV offers a variety of inspiring, family-friendly entertainment, including original series, movies, unique comedy shows, and live music events.
        </p>
        <p className="mb-3">
          We're constantly adding new, compelling projects to our lineup.
        </p>
        <p className="mb-3">
          Visit <Link href="/" className="underline underline-offset-2 transition-colors hover:text-[#D4AF37]" style={{ color: "#D4AF37" }}>haapu.tv</Link> to explore our full catalog.
        </p>
        <p>
          Want a voice in shaping Haapu TV's content?{' '}
          <Link href="/covenant" className="underline underline-offset-2 transition-colors hover:text-[#D4AF37]" style={{ color: "#D4AF37" }}>
            Become a Covenant Member
          </Link>
          {' '}and influence the films and shows added to our platform.
        </p>
      </>
    ),
  },
  {
    q: "Where can I stream Haapu TV?",
    a: (
      <>
        <p className="mb-3">
          You can stream Haapu TV's movies and shows on any internet-connected device.
        </p>
        <p className="mb-3">
          Simply visit our website at <Link href="/" className="underline underline-offset-2 transition-colors hover:text-[#D4AF37]" style={{ color: "#D4AF37" }}>haapu.tv</Link>.
        </p>
        <p className="mb-3">
          For added convenience, download and install our web app directly from the site.
        </p>
        <p>
          The Haapu TV web app is designed for seamless use across computers and mobile devices. Access it through your device's Launcher or home screen for easy streaming anytime, anywhere.
        </p>
      </>
    ),
  },
  {
    q: "How do I sign up for Haapu TV?",
    a: (
      <>
        <p className="mb-3">
          Signing up for Haapu TV is simple and free.
        </p>
        <p className="mb-3">
          Just visit <Link href="/" className="underline underline-offset-2 transition-colors hover:text-[#D4AF37]" style={{ color: "#D4AF37" }}>haapu.tv</Link> or download the Haapu TV web app.
        </p>
        <p className="mb-3">
          Click Login, then Create an Account. Register using your email address and password.
        </p>
        <p className="mb-3">
          Once signed up, you'll have instant access to our inspiring entertainment.
        </p>
        <p>
          For exclusive perks like Power to Choose voting, Early Access to new titles, and helping support our mission, consider joining the{' '}
          <Link href="/covenant" className="underline underline-offset-2 transition-colors hover:text-[#D4AF37]" style={{ color: "#D4AF37" }}>
            Covenant Member
          </Link>
          {' '}program.
        </p>
      </>
    ),
  },
  {
    q: "How can I support Haapu TV?",
    a: (
      <>
        <p className="mb-3">
          There are several ways to support Haapu TV and help us continue our mission.
        </p>
        <p className="mb-3">
          Join the{' '}
          <Link href="/covenant" className="underline underline-offset-2 transition-colors hover:text-[#D4AF37]" style={{ color: "#D4AF37" }}>
            Covenant Member
          </Link>
          {' '}program to become part of the decision-making process as a film executive.
        </p>
        <p className="mb-3">Members enjoy:</p>
        <ul className="mb-3 list-disc pl-6 text-white/70 space-y-1">
          <li>Voting rights</li>
          <li>Early access</li>
          <li>Complimentary pay-per-view tickets</li>
          <li>Exclusive benefits</li>
        </ul>
        <p className="mb-3">You can also support Haapu TV through:</p>
        <ul className="list-disc pl-6 text-white/70 space-y-1">
          <li>Pay As You Like</li>
          <li>Watching livestreams</li>
          <li>Sharing our content</li>
          <li>Investing in Haapu Original projects</li>
        </ul>
        <p className="mt-3">Every bit of support helps amplify light.</p>
      </>
    ),
  },
  {
    q: "Does Haapu TV offer child-friendly content?",
    a: (
      <>
        <p className="mb-3">Absolutely!</p>
        <p className="mb-3">
          Haapu TV is committed to providing entertainment suitable for all ages.
        </p>
        <p className="mb-3">
          Children's movies and shows emphasize positive family values.
        </p>
        <p className="mb-3">
          Parents can also create dedicated child profiles with customizable viewing controls.
        </p>
        <p>
          Want to help shape children's entertainment?{' '}
          <Link href="/covenant" className="underline underline-offset-2 transition-colors hover:text-[#D4AF37]" style={{ color: "#D4AF37" }}>
            Join the Covenant Member
          </Link>
          {' '}program.
        </p>
      </>
    ),
  },
  {
    q: "How can I get in touch with Haapu TV?",
    a: (
      <>
        <p className="mb-3">We'd love to hear from you!</p>
        <p className="mb-3">
          For inquiries, feedback or suggestions, reach out through our{' '}
          <Link href="/contact" className="underline underline-offset-2 transition-colors hover:text-[#D4AF37]" style={{ color: "#D4AF37" }}>
            Contact page
          </Link>
          , connect with us on social media, or join one of our livestreams.
        </p>
      </>
    ),
  },
];

// ── FAQ ITEM COMPONENT ──────────────────────────────────────────────
function FAQItem({ q, a, isOpen, onClick }: { q: string; a: React.ReactNode; isOpen: boolean; onClick: () => void }) {
  return (
    <div className="border-b border-white/10 last:border-0">
      <button
        onClick={onClick}
        className="flex w-full items-center justify-between gap-4 py-5 text-left transition-colors hover:text-white"
      >
        <span className="font-display text-base font-semibold text-white/80 sm:text-lg">
          {q}
        </span>
        <div
          className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
            isOpen ? 'rotate-45' : 'rotate-0'
          }`}
          style={{ color: "#D4AF37" }}
        >
          <Plus size={20} />
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pb-5 text-sm leading-relaxed text-white/70 sm:text-base">
              {a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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

export default function FAQPage() {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Split FAQs into two columns for desktop
  const leftColumnFAQs = FAQS.slice(0, 4);
  const rightColumnFAQs = FAQS.slice(4);

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
            <Link href="/faq" className="text-sm font-medium text-white transition-colors" style={{ color: "#D4AF37" }}>
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
                  className="px-3 py-2.5 text-sm font-medium text-white hover:bg-white/5 rounded-lg transition-colors"
                  style={{ color: "#D4AF37" }}
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

      {/* ── HERO SECTION ────────────────────────────────────────── */}
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
            THE ANSWERS TO <br />
            <span style={{ color: "#D4AF37" }}>ALL YOUR QUESTIONS</span>
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base text-white/60 sm:text-lg">
            All your questions about the Haapu TV answered.
          </p>
        </motion.div>
      </section>

      {/* ── FAQ ACCORDION ────────────────────────────────────────── */}
      <section className="px-6 pb-16 sm:px-12 sm:pb-24">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
              {/* Left Column - First 4 FAQs */}
              <div className="space-y-0 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm px-6 py-2 sm:px-8">
                {leftColumnFAQs.map((faq, index) => (
                  <FAQItem
                    key={index}
                    q={faq.q}
                    a={faq.a}
                    isOpen={openIndex === index}
                    onClick={() => toggleFAQ(index)}
                  />
                ))}
              </div>

              {/* Right Column - Last 5 FAQs */}
              <div className="space-y-0 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm px-6 py-2 sm:px-8">
                {rightColumnFAQs.map((faq, index) => (
                  <FAQItem
                    key={index + 4}
                    q={faq.q}
                    a={faq.a}
                    isOpen={openIndex === index + 4}
                    onClick={() => toggleFAQ(index + 4)}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── CONTACT CTA ──────────────────────────────────────────── */}
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
            If you have any questions <br />
            <span style={{ color: "#D4AF37" }}>let us know</span>
          </h2>

          <p className="mt-4 text-base text-white/60 sm:text-lg">
            Do you have any questions? Write to us and our specialists will answer you.
          </p>

          <Link
            href="/contact"
            className="mt-8 inline-flex items-center gap-3 rounded-lg px-10 py-4 text-lg font-bold transition-all duration-300 hover:opacity-90 hover:scale-105"
            style={{ backgroundColor: "#D4AF37", color: "#0A0A0A" }}
          >
            CONTACT US
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
              <Link href="/faq" className="hover:text-white transition-colors" style={{ color: "#D4AF37" }}>FAQ</Link>
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