import Link from "next/link";
import { ArrowLeft, Film, Tv, MonitorPlay, ShieldCheck } from "lucide-react";

export default function QualityPage() {
  return (
    <>
      <div className="mx-auto max-w-3xl px-4 pt-28 pb-20">
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
            Streaming Quality
          </h1>
          <p className="mt-4 text-body text-matte-400">
            Everything you need to know about video quality on Haapu TV.
          </p>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-matte-800 bg-matte-900 p-6">
            <div className="flex items-center gap-3 mb-4">
              <MonitorPlay size={24} style={{ color: "#D4AF37" }} />
              <h2 className="font-display text-xl font-semibold text-white">Quality Options</h2>
            </div>
            <ul className="space-y-4 text-matte-400">
              <li>
                <span className="font-medium text-white">HD (720p)</span>
                <p className="text-sm">Standard definition. Works on all devices and internet connections.</p>
              </li>
              <li>
                <span className="font-medium text-white">Full HD (1080p)</span>
                <p className="text-sm">Recommended for the best balance of quality and performance.</p>
              </li>
              <li>
                <span className="font-medium text-white">4K Ultra HD</span>
                <p className="text-sm">Available on select titles. Requires a 4K-compatible device and fast internet.</p>
              </li>
            </ul>
          </div>

          <div className="rounded-xl border border-matte-800 bg-matte-900 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Tv size={24} style={{ color: "#D4AF37" }} />
              <h2 className="font-display text-xl font-semibold text-white">Adaptive Bitrate</h2>
            </div>
            <p className="text-matte-400">
              Haapu TV automatically adjusts video quality based on your internet speed.
              This ensures smooth playback with minimal buffering, even on slower connections.
            </p>
          </div>

          <div className="rounded-xl border border-matte-800 bg-matte-900 p-6">
            <div className="flex items-center gap-3 mb-4">
              <ShieldCheck size={24} style={{ color: "#D4AF37" }} />
              <h2 className="font-display text-xl font-semibold text-white">Internet Speed Requirements</h2>
            </div>
            <ul className="space-y-2 text-matte-400">
              <li>• <span className="font-medium text-white">HD (720p):</span> 5 Mbps minimum</li>
              <li>• <span className="font-medium text-white">Full HD (1080p):</span> 10 Mbps minimum</li>
              <li>• <span className="font-medium text-white">4K Ultra HD:</span> 25 Mbps minimum</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}