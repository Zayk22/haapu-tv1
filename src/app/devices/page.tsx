import Link from "next/link";
import { ArrowLeft, Monitor, Smartphone, Tv, Tablet } from "lucide-react";

export default function DevicesPage() {
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
            Help Centre
          </span>
          <h1 className="font-display text-4xl font-bold text-white sm:text-5xl">
            Supported Devices
          </h1>
          <p className="mt-4 text-body text-matte-400">
            Watch Haapu TV on any device, anywhere.
          </p>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-matte-800 bg-matte-900 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Monitor size={24} style={{ color: "#D4AF37" }} />
              <h2 className="font-display text-xl font-semibold text-white">Web Browsers</h2>
            </div>
            <ul className="space-y-2 text-matte-400">
              <li>• Google Chrome (version 90+)</li>
              <li>• Mozilla Firefox (version 88+)</li>
              <li>• Apple Safari (version 14+)</li>
              <li>• Microsoft Edge (version 90+)</li>
              <li>• Opera (version 76+)</li>
            </ul>
          </div>

          <div className="rounded-xl border border-matte-800 bg-matte-900 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Smartphone size={24} style={{ color: "#D4AF37" }} />
              <h2 className="font-display text-xl font-semibold text-white">Mobile Devices</h2>
            </div>
            <ul className="space-y-2 text-matte-400">
              <li>• iPhone (iOS 14+)</li>
              <li>• iPad (iPadOS 14+)</li>
              <li>• Android phones (Android 8+)</li>
              <li>• Android tablets (Android 8+)</li>
            </ul>
          </div>

          <div className="rounded-xl border border-matte-800 bg-matte-900 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Tv size={24} style={{ color: "#D4AF37" }} />
              <h2 className="font-display text-xl font-semibold text-white">Smart TVs</h2>
            </div>
            <ul className="space-y-2 text-matte-400">
              <li>• Samsung Smart TV (2021+)</li>
              <li>• LG Smart TV (WebOS 6.0+)</li>
              <li>• Sony Google TV (Android TV 10+)</li>
              <li>• Hisense Smart TV (Vidaa OS 4.0+)</li>
            </ul>
          </div>

          <div className="rounded-xl border border-matte-800 bg-matte-900 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Tablet size={24} style={{ color: "#D4AF37" }} />
              <h2 className="font-display text-xl font-semibold text-white">Streaming Devices</h2>
            </div>
            <ul className="space-y-2 text-matte-400">
              <li>• Roku (Roku OS 10+)</li>
              <li>• Amazon Fire TV (Fire OS 7+)</li>
              <li>• Apple TV (tvOS 14+)</li>
              <li>• Chromecast with Google TV</li>
            </ul>
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