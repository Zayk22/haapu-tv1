"use client";

import { useState } from "react";
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

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const leftColumnFAQs = FAQS.slice(0, 4);
  const rightColumnFAQs = FAQS.slice(4);

  return (
    <div className="bg-black min-h-screen">
      {/* Hero Section */}
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

      {/* FAQ Accordion */}
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

      {/* Contact CTA */}
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
    </div>
  );
}