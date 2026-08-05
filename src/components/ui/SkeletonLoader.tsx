"use client";

export function HeroSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 sm:px-12">
      <div className="w-full max-w-5xl text-center">
        <div className="mx-auto h-8 w-32 rounded-full bg-white/5 animate-pulse mb-8" />
        <div className="mx-auto h-16 w-3/4 rounded-lg bg-white/5 animate-pulse mb-6" />
        <div className="mx-auto h-6 w-1/2 rounded-lg bg-white/5 animate-pulse mb-10" />
        <div className="mx-auto flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <div className="h-14 w-48 rounded-lg bg-white/5 animate-pulse" />
          <div className="h-14 w-48 rounded-lg bg-white/5 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export function SectionSkeleton() {
  return (
    <div className="py-24 sm:py-32 px-6 sm:px-12">
      <div className="mx-auto max-w-4xl text-center">
        <div className="mx-auto h-8 w-40 rounded-full bg-white/5 animate-pulse mb-6" />
        <div className="mx-auto h-12 w-3/4 rounded-lg bg-white/5 animate-pulse mb-6" />
        <div className="mx-auto h-20 w-full max-w-2xl rounded-lg bg-white/5 animate-pulse mb-10" />
        <div className="mx-auto h-14 w-48 rounded-lg bg-white/5 animate-pulse" />
      </div>
    </div>
  );
}

export function FeatureCardSkeleton() {
  return (
    <div className="rounded-xl border border-white/5 bg-white/5 p-6">
      <div className="mb-4 h-12 w-12 rounded-xl bg-white/5 animate-pulse" />
      <div className="h-6 w-3/4 rounded-lg bg-white/5 animate-pulse mb-2" />
      <div className="h-4 w-full rounded-lg bg-white/5 animate-pulse" />
      <div className="h-4 w-2/3 rounded-lg bg-white/5 animate-pulse mt-1" />
    </div>
  );
}

export function FAQSkeleton() {
  return (
    <div className="py-24 sm:py-32 px-6 sm:px-12">
      <div className="mx-auto max-w-3xl">
        <div className="text-center mb-12">
          <div className="mx-auto h-12 w-64 rounded-lg bg-white/5 animate-pulse mb-4" />
          <div className="mx-auto h-6 w-48 rounded-lg bg-white/5 animate-pulse" />
        </div>
        <div className="rounded-2xl border border-white/5 bg-white/5 px-6 sm:px-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="border-b border-white/5 last:border-0 py-5">
              <div className="h-6 w-3/4 rounded-lg bg-white/5 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function FooterSkeleton() {
  return (
    <div className="border-t border-white/5 px-6 py-8 sm:px-12 sm:py-10">
      <div className="mx-auto max-w-screen-xl">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
          <div className="h-12 w-32 rounded-lg bg-white/5 animate-pulse" />
          <div className="flex gap-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-4 w-16 rounded-lg bg-white/5 animate-pulse" />
            ))}
          </div>
          <div className="flex gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-5 w-5 rounded-full bg-white/5 animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}