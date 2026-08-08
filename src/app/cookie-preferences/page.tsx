import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";

export default function CookiePreferencesPage() {
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
      <div className="mb-10">
        <span className="mb-3 inline-block text-xs font-medium uppercase tracking-widest text-gold">
          Legal
        </span>
        <h1 className="font-display text-4xl font-bold text-white sm:text-5xl">
          Cookie Preferences
        </h1>
        <p className="mt-2 max-w-2xl text-base text-matte-400">
          Haapu TV uses minimal cookies to ensure the platform works properly.
          We do not use tracking, advertising, or analytics cookies.
        </p>
      </div>

      {/* Strictly Necessary Cookies */}
      <div className="rounded-xl border border-matte-800 bg-matte-900 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-xl font-semibold text-white">
              Strictly Necessary Cookies
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-matte-400">
              These cookies are essential for the platform to function properly.
              They enable authentication, security, session management, and basic
              operation of the service. They cannot be disabled.
            </p>
            <ul className="mt-3 space-y-1 text-sm text-matte-400">
              <li>• <span className="text-white">Session cookies</span> — keep you signed in</li>
              <li>• <span className="text-white">Security cookies</span> — protect your account</li>
              <li>• <span className="text-white">Preferences cookies</span> — remember your settings</li>
            </ul>
          </div>
          <div className="flex-shrink-0">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gold/20 px-3 py-1 text-xs font-medium text-gold">
              <span className="h-1.5 w-1.5 rounded-full bg-gold" />
              Always Active
            </span>
          </div>
        </div>
      </div>

      {/* Optional categories – transparent, not currently in use */}
      <div className="mt-6 space-y-4">
        <div className="rounded-xl border border-matte-800/50 bg-matte-900/50 p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-display text-lg font-semibold text-white/60">
                Performance & Analytics Cookies
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-matte-500">
                Haapu TV does not currently use analytics or performance cookies.
                This category is reserved for potential future use, but we are
                committed to preserving your privacy and will only add such
                cookies with your explicit consent.
              </p>
            </div>
            <span className="flex-shrink-0 text-xs font-medium text-matte-500">
              Not in use
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-matte-800/50 bg-matte-900/50 p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-display text-lg font-semibold text-white/60">
                Functional & Preferences Cookies
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-matte-500">
                Haapu TV does not currently use functional or preference cookies
                beyond the essential ones listed above. This category is reserved
                for potential future features that would remember your choices
                such as language or video quality preferences.
              </p>
            </div>
            <span className="flex-shrink-0 text-xs font-medium text-matte-500">
              Not in use
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-matte-800/50 bg-matte-900/50 p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-display text-lg font-semibold text-white/60">
                Advertising & Targeting Cookies
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-matte-500">
                Haapu TV does not use advertising or targeting cookies. We do not
                track your activity across websites or serve targeted ads. Your
                privacy is important to us, and we intend to keep it that way.
              </p>
            </div>
            <span className="flex-shrink-0 text-xs font-medium text-matte-500">
              Not in use
            </span>
          </div>
        </div>
      </div>

      {/* How to manage cookies */}
      <div className="mt-6 rounded-xl border border-matte-800 bg-matte-900 p-6">
        <h2 className="font-display text-xl font-semibold text-white mb-4">
          How to manage cookies
        </h2>
        <p className="text-sm text-matte-400 leading-relaxed mb-4">
          You can manage or disable cookies in your browser settings:
        </p>
        <ul className="space-y-1 text-sm text-matte-400">
          <li>• <span className="text-white">Chrome:</span> Settings → Privacy and Security → Cookies</li>
          <li>• <span className="text-white">Firefox:</span> Options → Privacy & Security → Cookies</li>
          <li>• <span className="text-white">Safari:</span> Preferences → Privacy → Cookies</li>
          <li>• <span className="text-white">Edge:</span> Settings → Privacy → Cookies</li>
        </ul>
        <p className="mt-4 text-xs text-matte-500">
          Note: Disabling essential cookies may affect the functionality of the
          service, including your ability to stay signed in.
        </p>
      </div>

      {/* Contact */}
      <div className="mt-6 rounded-xl border border-matte-800 bg-matte-900 p-6">
        <h2 className="font-display text-xl font-semibold text-white mb-2">
          Contact us
        </h2>
        <p className="text-sm text-matte-400">
          If you have any questions about our cookie policy, please{" "}
          <Link href="/contact" className="text-gold hover:underline">
            contact us
          </Link>
          .
        </p>
      </div>
    </div>
  );
}