import Link from "next/link";
import { ArrowLeft, Cookie } from "lucide-react";

export default function CookiePreferencesPage() {
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
          <span
            className="mb-3 inline-block rounded-full border px-3 py-1 text-small font-medium uppercase tracking-widest"
            style={{
              borderColor: "rgba(212,175,55,0.3)",
              backgroundColor: "rgba(212,175,55,0.08)",
              color: "#D4AF37",
            }}
          >
            Legal
          </span>
          <h1 className="font-display text-4xl font-bold text-white sm:text-5xl">
            Cookie Preferences
          </h1>
          <p className="mt-4 text-body text-matte-400">
            How we use cookies to improve your experience.
          </p>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-matte-800 bg-matte-900 p-6">
            <h2 className="font-display text-xl font-semibold text-white mb-4">
              What are cookies?
            </h2>
            <p className="text-matte-400 leading-relaxed">
              Cookies are small text files stored on your device when you visit a website.
              They help us remember your preferences and improve your experience.
            </p>
          </div>

          <div className="rounded-xl border border-matte-800 bg-matte-900 p-6">
            <h2 className="font-display text-xl font-semibold text-white mb-4">
              What cookies we use
            </h2>
            <p className="text-matte-400 leading-relaxed mb-4">
              Haapu TV uses only essential cookies that are necessary for the platform to function:
            </p>
            <ul className="space-y-2 text-matte-400">
              <li>• <span className="font-medium text-white">Session cookies</span> — keep you signed in</li>
              <li>• <span className="font-medium text-white">Preferences cookies</span> — remember your settings</li>
              <li>• <span className="font-medium text-white">Security cookies</span> — protect your account</li>
            </ul>
            <p className="text-matte-500 text-sm mt-4">
              We do not use tracking or advertising cookies. Your privacy is important to us.
            </p>
          </div>

          <div className="rounded-xl border border-matte-800 bg-matte-900 p-6">
            <h2 className="font-display text-xl font-semibold text-white mb-4">
              How to manage cookies
            </h2>
            <p className="text-matte-400 leading-relaxed mb-4">
              You can manage or disable cookies in your browser settings:
            </p>
            <ul className="space-y-2 text-matte-400">
              <li>• <span className="font-medium text-white">Chrome:</span> Settings → Privacy and Security → Cookies</li>
              <li>• <span className="font-medium text-white">Firefox:</span> Options → Privacy & Security → Cookies</li>
              <li>• <span className="font-medium text-white">Safari:</span> Preferences → Privacy → Cookies</li>
              <li>• <span className="font-medium text-white">Edge:</span> Settings → Privacy → Cookies</li>
            </ul>
          </div>

          <div className="rounded-xl border border-matte-800 bg-matte-900 p-6">
            <h2 className="font-display text-xl font-semibold text-white mb-4">
              Contact us
            </h2>
            <p className="text-matte-400 leading-relaxed">
              If you have any questions about our cookie policy, please{" "}
              <Link href="/contact" className="hover:underline" style={{ color: "#E50914" }}>
                contact us
              </Link>
              .
            </p>
          </div>
        </div>

        <div className="mt-12 border-t border-matte-800 pt-8 flex flex-wrap items-center justify-between gap-4">
          <p className="text-small text-matte-600">
            © {new Date().getFullYear()} Haapu TV. All Rights Reserved.
          </p>
          <div className="flex gap-6 text-small text-matte-500">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Use</Link>
          </div>
        </div>
      </div>
    </main>
  );
}