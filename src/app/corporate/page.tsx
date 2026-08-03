import Link from "next/link";
import { ArrowLeft, Building, Mail, MapPin, Users } from "lucide-react";

export default function CorporatePage() {
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
            Corporate Information
          </h1>
          <p className="mt-4 text-body text-matte-400">
            Official company details for Haapu TV.
          </p>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-matte-800 bg-matte-900 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Building size={24} style={{ color: "#D4AF37" }} />
              <h2 className="font-display text-xl font-semibold text-white">Company Name</h2>
            </div>
            <p className="text-matte-400 leading-relaxed">
              Haapu TV
              <br />
              <span className="text-sm text-matte-500">(RANDOM RANDOM RANDOM)</span>
            </p>
          </div>

          <div className="rounded-xl border border-matte-800 bg-matte-900 p-6">
            <div className="flex items-center gap-3 mb-4">
              <MapPin size={24} style={{ color: "#D4AF37" }} />
              <h2 className="font-display text-xl font-semibold text-white">Registered Address</h2>
            </div>
            <p className="text-matte-400 leading-relaxed">
              <span className="text-matte-500">LONDON</span>
            </p>
          </div>

          <div className="rounded-xl border border-matte-800 bg-matte-900 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Mail size={24} style={{ color: "#D4AF37" }} />
              <h2 className="font-display text-xl font-semibold text-white">Contact</h2>
            </div>
            <p className="text-matte-400 leading-relaxed">
              Email: <a href="mailto:hello@haapu.tv" className="hover:underline" style={{ color: "#D4AF37" }}>hello@haapu.tv</a>
            </p>
          </div>

          <div className="rounded-xl border border-matte-800 bg-matte-900 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Users size={24} style={{ color: "#D4AF37" }} />
              <h2 className="font-display text-xl font-semibold text-white">Registration Details</h2>
            </div>
            <p className="text-matte-400 leading-relaxed">
              <span className="text-matte-500">Random random random random</span>
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