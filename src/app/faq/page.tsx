"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ArrowLeft } from "lucide-react";

const FAQS = [
  {
    category: "Getting Started",
    questions: [
      {
        q: "What is Haapu TV?",
        a: "Haapu TV is a free, community-supported, trusted family friendly streaming platform, offering exceptional movies, shows, and documentaries for all ages. Haapu TV offers unlimited access to viewer-supported Haapu Original entertainment designed to inspire, uplift, and unite through meaningful storytelling. Each Haapu TV title is chosen and refined by the Covenant Members — a body of members that decides which films and shows are made and distributed by Haapu TV.",
      },
      {
        q: "How much does Haapu TV cost?",
        a: "Haapu TV offers free access to its entertainment — no payment or credit card required. Enjoy meaningful storytelling without any barriers. You can help keep Haapu TV free by becoming a Covenant Member, investing, or choosing to Pay As You Like. While all shows will eventually be available to everyone, Covenant Members get exclusive early access to new movies and TV shows during a special release window.",
      },
      {
        q: "How do I create an account?",
        a: "Creating an account is free and only takes a moment. Click 'Get Started Free' on the homepage, enter your name, email address, and a password, then verify your email. Once verified you'll have instant access to the full catalog.",
      },
    ],
  },
  {
    category: "Content",
    questions: [
      {
        q: "What can I watch on Haapu TV?",
        a: "Haapu TV offers a variety of inspiring, family-friendly entertainment, including original series, movies, unique comedy shows, and live music events. We're constantly adding new, compelling projects to our lineup. Want a voice in shaping Haapu TV's content? Become a Covenant Member and influence the films and shows added to our platform.",
      },
      {
        q: "Is all content free?",
        a: "Yes — all content on Haapu TV is free to watch. Covenant Members receive exclusive early access to new releases during a special release window, but every title eventually becomes available to all viewers at no cost.",
      },
      {
        q: "How often is new content added?",
        a: "We're constantly adding new titles. Our Covenant Members play an active role in selecting and prioritising what gets added next, so the catalog evolves based on community input.",
      },
    ],
  },
  {
    category: "Covenant Members",
    questions: [
      {
        q: "How is Haapu TV able to offer free streaming?",
        a: "Haapu TV is dedicated to making life-changing content accessible to everyone. Our free service is made possible through the generous support of Covenant Members, Pay As You Like contributions, and sponsorships. Your support helps us stay committed to providing uplifting, family-friendly entertainment for audiences around the globe.",
      },
      {
        q: "What is a Covenant Member?",
        a: "Covenant Members are the backbone of Haapu TV. They support the platform financially and in return receive exclusive early access to new movies and TV shows, plus a vote in deciding which films and shows get made and distributed. Without Covenant Members, free streaming for everyone wouldn't be possible.",
      },
      {
        q: "How do I become a Covenant Member?",
        a: "Visit the Covenant Member page from the navigation menu or contact us for more information. Membership options are available to suit different levels of support.",
      },
    ],
  },
  {
    category: "Technical",
    questions: [
      {
        q: "What devices can I watch Haapu TV on?",
        a: "Haapu TV works on any device with a modern web browser — smartphones, tablets, laptops, and desktop computers. Simply visit the site, sign in, and start watching.",
      },
      {
        q: "I'm having trouble signing in. What should I do?",
        a: "First, make sure you're using the correct email address and password. If you've forgotten your password, use the 'Forgot password' link on the sign-in page. If you still have trouble, contact us at the email below and we'll help you get back in.",
      },
    ],
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
        <span className="font-semibold text-white">{q}</span>
        <ChevronDown
          size={18}
          className={`flex-shrink-0 text-crimson-DEFAULT transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          open ? "max-h-96 pb-5" : "max-h-0"
        }`}
      >
        <p className="text-body leading-relaxed text-matte-400">{a}</p>
      </div>
    </div>
  );
}

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-matte-black pb-20 pt-28 px-4">
      <div className="mx-auto max-w-3xl">

        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-caption text-matte-500 transition-colors hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to Home
        </Link>

        <div className="mb-12">
          <span className="mb-3 inline-block rounded-full border border-gold-DEFAULT/30 bg-gold-DEFAULT/10 px-3 py-1 text-small font-medium uppercase tracking-widest text-gold-soft">
            Help Centre
          </span>
          <h1 className="font-display text-4xl font-bold text-white sm:text-5xl">
            Frequently Asked Questions
          </h1>
          <p className="mt-4 text-body text-matte-400">
            Everything you need to know about Haapu TV. Can't find your answer?{" "}
            <a
              href="mailto:hello@haapu.tv"
              className="text-crimson-DEFAULT hover:underline"
            >
              Contact us
            </a>
            .
          </p>
        </div>

        <div className="space-y-8">
          {FAQS.map((section) => (
            <div key={section.category}>
              <h2 className="mb-1 text-small font-semibold uppercase tracking-widest text-crimson-DEFAULT">
                {section.category}
              </h2>
              <div className="rounded-xl border border-matte-800 bg-matte-900 px-6">
                {section.questions.map((item) => (
                  <FAQItem key={item.q} q={item.q} a={item.a} />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-xl border border-matte-800 bg-matte-900 p-8 text-center">
          <h3 className="font-display text-xl font-semibold text-white">
            Still have questions?
          </h3>
          <p className="mt-2 text-body text-matte-400">
            We're here to help. Reach out and we'll get back to you as soon as possible.
          </p>
          <a
            href="mailto:hello@haapu.tv"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-crimson-DEFAULT px-6 py-3 text-body font-semibold text-white transition-colors hover:bg-crimson-dark"
          >
            Contact Us
          </a>
        </div>
      </div>
    </main>
  );
}