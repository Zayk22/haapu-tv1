import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Terms of Use | Haapu TV",
};

export default function TermsPage() {
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
            Terms of Use
          </h1>
          <p className="mt-3 text-caption text-matte-600">
            Last updated: January 2025
          </p>
        </div>

        <div className="space-y-8 text-matte-300">

          <section>
            <h2 className="font-display text-2xl font-semibold text-white mb-3">
              1. Acceptance of Terms
            </h2>
            <p className="text-body leading-relaxed">
              By accessing or using Haapu TV ("the Service"), you agree to be
              bound by these Terms of Use. If you do not agree to these terms,
              please do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-white mb-3">
              2. Use of the Service
            </h2>
            <p className="text-body leading-relaxed mb-3">
              Haapu TV grants you a limited, non-exclusive, non-transferable
              licence to access and use the Service for personal,
              non-commercial purposes. You agree not to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-body text-matte-400">
              <li>Copy, reproduce, or redistribute any content without permission</li>
              <li>Use the Service for any unlawful purpose</li>
              <li>Attempt to gain unauthorised access to any part of the Service</li>
              <li>Transmit harmful, offensive, or disruptive content</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-white mb-3">
              3. Content
            </h2>
            <p className="text-body leading-relaxed">
              All content available on Haapu TV is provided for personal,
              non-commercial viewing only. Content is protected by copyright and
              other intellectual property rights owned by Haapu TV or its
              content partners. Unauthorised reproduction or distribution is
              strictly prohibited.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-white mb-3">
              4. Accounts
            </h2>
            <p className="text-body leading-relaxed">
              You are responsible for maintaining the confidentiality of your
              account credentials and for all activities that occur under your
              account. Notify us immediately at{" "}
              <a href="mailto:hello@haapu.tv" className="text-crimson-DEFAULT hover:underline">
                hello@haapu.tv
              </a>{" "}
              if you suspect any unauthorised use of your account.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-white mb-3">
              5. Disclaimer of Warranties
            </h2>
            <p className="text-body leading-relaxed">
              The Service is provided "as is" without warranties of any kind.
              Haapu TV does not guarantee that the Service will be uninterrupted,
              error-free, or free of viruses or other harmful components.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-white mb-3">
              6. Limitation of Liability
            </h2>
            <p className="text-body leading-relaxed">
              To the maximum extent permitted by law, Haapu TV shall not be
              liable for any indirect, incidental, special, or consequential
              damages arising from your use of the Service.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-white mb-3">
              7. Changes to Terms
            </h2>
            <p className="text-body leading-relaxed">
              We reserve the right to modify these Terms at any time. Continued
              use of the Service after changes constitutes acceptance of the
              updated Terms.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-white mb-3">
              8. Contact
            </h2>
            <p className="text-body leading-relaxed">
              For questions about these Terms, contact us at{" "}
              <a href="mailto:hello@haapu.tv" className="text-crimson-DEFAULT hover:underline">
                hello@haapu.tv
              </a>
              . © {new Date().getFullYear()} Haapu TV. All Rights Reserved.
            </p>
          </section>
        </div>

        <div className="mt-12 flex gap-4 text-caption">
          <Link href="/privacy" className="text-matte-500 hover:text-white transition-colors">
            Privacy Policy →
          </Link>
          <Link href="/faq" className="text-matte-500 hover:text-white transition-colors">
            FAQ →
          </Link>
        </div>
      </div>
    </main>
  );
}