export const metadata = {
  title: "Privacy Policy | Haapu TV",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 pt-28 pb-20">
      <div className="mb-12">
        <h1 className="font-display text-4xl font-bold text-white sm:text-5xl">
          Privacy Policy
        </h1>
        <p className="mt-2 text-sm text-matte-500">
          Last updated: January 2025
        </p>
      </div>

      <div className="space-y-10 text-matte-300">
        <section>
          <h2 className="mb-3 font-display text-2xl font-semibold text-white">
            1. Who We Are
          </h2>
          <p className="leading-relaxed">
            Haapu TV ("we", "us", or "our") is a community-supported streaming
            platform dedicated to providing free, family-friendly entertainment.
            This Privacy Policy explains how we collect, use, and protect your
            personal information when you use our service at{" "}
            <a href="https://haapu.tv" className="text-crimson hover:underline">
              haapu.tv
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-display text-2xl font-semibold text-white">
            2. Information We Collect
          </h2>
          <p className="leading-relaxed">
            We collect information you provide directly to us, including:
          </p>
          <ul className="mt-2 list-disc pl-6 space-y-1 leading-relaxed text-matte-400">
            <li>Name and email address when you create an account</li>
            <li>Watch history and preferences to improve your experience</li>
            <li>Device and browser information for technical purposes</li>
            <li>Communications you send to us</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 font-display text-2xl font-semibold text-white">
            3. How We Use Your Information
          </h2>
          <ul className="list-disc pl-6 space-y-1 leading-relaxed text-matte-400">
            <li>To provide and improve the Haapu TV streaming service</li>
            <li>To remember your watch progress and preferences</li>
            <li>To communicate service updates and relevant information</li>
            <li>To ensure the security and integrity of our platform</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 font-display text-2xl font-semibold text-white">
            4. Data Sharing
          </h2>
          <p className="leading-relaxed">
            We do not sell your personal information. We may share data with
            trusted service providers who assist in operating our platform
            (such as authentication and video hosting services), under strict
            confidentiality agreements.
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-display text-2xl font-semibold text-white">
            5. Data Security
          </h2>
          <p className="leading-relaxed">
            We implement appropriate technical and organisational measures to
            protect your personal information against unauthorised access,
            alteration, disclosure, or destruction.
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-display text-2xl font-semibold text-white">
            6. Your Rights
          </h2>
          <p className="leading-relaxed">
            You have the right to access, correct, or delete your personal
            information. To exercise these rights or for any privacy-related
            questions, contact us at{" "}
            <a href="mailto:hello@haapu.tv" className="text-crimson hover:underline">
              hello@haapu.tv
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-display text-2xl font-semibold text-white">
            7. Contact
          </h2>
          <p className="leading-relaxed">
            If you have questions about this Privacy Policy, please contact us
            at{" "}
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