import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Terms of Use | Haapu TV",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 pt-28 pb-20">
      {/* Back to Home */}
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-2 text-sm text-matte-500 transition-colors hover:text-white"
      >
        <ArrowLeft size={16} />
        Back to Home
      </Link>

      {/* Header */}
      <div className="mb-12">
        <span className="mb-3 inline-block text-xs font-medium uppercase tracking-widest text-gold">
          Legal
        </span>
        <h1 className="font-display text-4xl font-bold text-white sm:text-5xl">
          Terms of Use
        </h1>
        <p className="mt-2 text-sm text-matte-500">
          Last updated: January 2025
        </p>
      </div>

      {/* Content */}
      <div className="space-y-10 text-matte-300">
        <section>
          <h2 className="mb-3 font-display text-2xl font-semibold text-white">
            1. Acceptance of Terms
          </h2>
          <p className="leading-relaxed">
            By accessing or using Haapu TV ("the Service"), you agree to be
            bound by these Terms of Use. If you do not agree to these terms,
            please do not use the Service.
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-display text-2xl font-semibold text-white">
            2. Use of the Service
          </h2>
          <p className="leading-relaxed">
            Haapu TV grants you a limited, non-exclusive, non-transferable
            licence to access and use the Service for personal,
            non-commercial purposes. You agree not to:
          </p>
          <ul className="mt-2 list-disc pl-6 space-y-1 leading-relaxed text-matte-400">
            <li>Copy, reproduce, or redistribute any content without permission</li>
            <li>Use the Service for any unlawful purpose</li>
            <li>Attempt to gain unauthorised access to any part of the Service</li>
            <li>Transmit harmful, offensive, or disruptive content</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 font-display text-2xl font-semibold text-white">
            3. Accounts
          </h2>
          <p className="leading-relaxed">
            You are responsible for maintaining the confidentiality of your
            account credentials and for all activities that occur under your
            account. Notify us immediately at{" "}
            <a href="mailto:hello@haapu.tv" className="text-crimson hover:underline">
              hello@haapu.tv
            </a>{" "}
            if you suspect any unauthorised use of your account.
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-display text-2xl font-semibold text-white">
            4. Content and Intellectual Property
          </h2>
          <p className="leading-relaxed">
            All content available on Haapu TV is provided for personal,
            non-commercial viewing only. Content is protected by copyright and
            other intellectual property rights owned by Haapu TV or its
            content partners. Unauthorised reproduction or distribution is
            strictly prohibited.
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-display text-2xl font-semibold text-white">
            5. Prohibited Conduct
          </h2>
          <p className="leading-relaxed">
            You agree not to engage in any of the following prohibited activities:
          </p>
          <ul className="mt-2 list-disc pl-6 space-y-1 leading-relaxed text-matte-400">
            <li>Violating any applicable law or regulation</li>
            <li>Infringing the rights of others, including intellectual property rights</li>
            <li>Interfering with or disrupting the Service or its infrastructure</li>
            <li>Attempting to gain unauthorised access to any part of the Service</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 font-display text-2xl font-semibold text-white">
            6. Disclaimer of Warranties
          </h2>
          <p className="leading-relaxed">
            The Service is provided "as is" without warranties of any kind.
            Haapu TV does not guarantee that the Service will be uninterrupted,
            error-free, or free of viruses or other harmful components.
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-display text-2xl font-semibold text-white">
            7. Limitation of Liability
          </h2>
          <p className="leading-relaxed">
            To the maximum extent permitted by law, Haapu TV shall not be
            liable for any indirect, incidental, special, or consequential
            damages arising from your use of the Service.
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-display text-2xl font-semibold text-white">
            8. Changes to These Terms
          </h2>
          <p className="leading-relaxed">
            We reserve the right to modify these Terms at any time. Continued
            use of the Service after changes constitutes acceptance of the
            updated Terms.
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-display text-2xl font-semibold text-white">
            9. Governing Law
          </h2>
          <p className="leading-relaxed">
            These Terms shall be governed by and construed in accordance with
            the laws of the United Kingdom, without regard to its conflict of
            law principles.
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-display text-2xl font-semibold text-white">
            10. Contact Us
          </h2>
          <p className="leading-relaxed">
            For questions about these Terms, contact us at{" "}
            <a href="mailto:hello@haapu.tv" className="text-crimson hover:underline">
              hello@haapu.tv
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}