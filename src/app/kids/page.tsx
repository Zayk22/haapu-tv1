import { Metadata } from "next";
import Link from "next/link";
import { Star } from "lucide-react";

export const metadata: Metadata = {
  title: "Kids | Haapu TV",
  description: "Family-friendly content coming soon on Haapu TV.",
};

export default function KidsPage() {
  return (
    <main className="min-h-screen bg-matte-black">
      <div className="pt-24 pb-6 px-4 sm:px-6 lg:px-12 mx-auto max-w-screen-2xl">
        <h1 className="font-display text-display text-white">Kids</h1>
      </div>

      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-matte-800 mb-6">
          <Star size={36} className="text-matte-500" />
        </div>
        <h2 className="font-display text-heading-1 text-white mb-3">
          Coming Soon
        </h2>
        <p className="text-body text-matte-500 max-w-sm mb-8">
          Family-friendly content is on its way to Haapu TV. Stay tuned!
        </p>
        <Link
          href="/movies"
          className="rounded-lg bg-crimson-DEFAULT px-8 py-3 text-body font-semibold text-white transition-colors hover:bg-crimson-dark"
        >
          Browse Movies Instead
        </Link>
      </div>
    </main>
  );
}