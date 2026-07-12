import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | Haapu TV",
};

export default function PrivacyPage() {
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

        <div className="mb-10">
          <span className="mb-3 inline-block rounded-full border border-gold-DEFAULT/30 bg-gold-DEFAULT/10 px-3 py-1 text-small font-medium uppercase tracking-widest text-gold-soft">
            Legal
          </span>
          <h1 className="font-display text-4xl font-bold text-white sm:text-5xl">
            Privacy Policy
          </h1>
          <p className="mt-3 text-caption text-matte-600">
            Last updated: January 2025
          </p>
        </div>

        <div className="prose prose-invert max-w-none space-y-8 text-matte-300">

          <section>
            <h2 className="font-display text-2xl font-semibold text-white mb-3">
              1. Who We Are
            </h2>
            <p className="text-body leading-relaxed">
              Haapu TV ("we", "us", or "our") is a community-supported streaming
              platform dedicated to providing free, family-friendly entertainment.
              This Privacy Policy explains how we collect, use, and protect your
              personal information when you use our service at{" "}
              <a href="https://haapu.tv" className="text-crimson-DEFAULT hover:underline">
                haapu.tv
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-white mb-3">
              2. Information We Collect
            </h2>
            <p className="text-body leading-relaxed mb-3">
              We collect information you provide directly to us, including:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-body text-matte-400">
              <li>Name and email address when you create an account</li>
              <li>Watch history and preferences to improve your experience</li>
              <li>Device and browser information for technical purposes</li>
              <li>Communications you send to us</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-white mb-3">
              3. How We Use Your Information
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-body text-matte-400">
              <li>To provide and improve the Haapu TV streaming service</li>
              <li>To remember your watch progress and preferences</li>
              <li>To communicate service updates and relevant information</li>
              <li>To ensure the security and integrity of our platform</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-white mb-3">
              4. Data Sharing
            </h2>
            <p className="text-body leading-relaxed">
              We do not sell your personal information. We may share data with
              trusted service providers who assist in operating our platform
              (such as authentication and video hosting services), under strict
              confidentiality agreements.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-white mb-3">
              5. Data Security
            </h2>
            <p className="text-body leading-relaxed">
              We implement appropriate technical and organisational measures to
              protect your personal information against unauthorised access,
              alteration, disclosure, or destruction.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-white mb-3">
              6. Your Rights
            </h2>
            <p className="text-body leading-relaxed">
              You have the right to access, correct, or delete your personal
              information. To exercise these rights or for any privacy-related
              questions, contact us at{" "}
              <a href="mailto:hello@haapu.tv" className="text-crimson-DEFAULT hover:underline">
                hello@haapu.tv
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-white mb-3">
              7. Contact
            </h2>
            <p className="text-body leading-relaxed">
              If you have questions about this Privacy Policy, please contact us
              at{" "}
              <a href="mailto:hello@haapu.tv" className="text-crimson-DEFAULT hover:underline">
                hello@haapu.tv
              </a>
              . © {new Date().getFullYear()} Haapu TV. All Rights Reserved.
            </p>
          </section>
        </div>

        <div className="mt-12 flex gap-4 text-caption">
          <Link href="/terms" className="text-matte-500 hover:text-white transition-colors">
            Terms of Use →
          </Link>
          <Link href="/faq" className="text-matte-500 hover:text-white transition-colors">
            FAQ →
          </Link>
        </div>
      </div>
    </main>
  );
}