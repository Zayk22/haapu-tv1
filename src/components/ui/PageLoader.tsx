"use client";

import { useState, useEffect, ReactNode } from "react";
import { 
  HeroSkeleton, 
  SectionSkeleton, 
  FeatureCardSkeleton, 
  FAQSkeleton,
  FooterSkeleton 
} from "./SkeletonLoader";

interface PageLoaderProps {
  children: ReactNode;
}

export function PageLoader({ children }: PageLoaderProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading for page transitions
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="bg-black min-h-screen">
        <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-sm px-6 py-4 sm:px-12">
          <div className="mx-auto flex max-w-screen-xl items-center justify-between">
            <div className="h-12 w-32 rounded-lg bg-white/5 animate-pulse" />
            <div className="hidden md:flex gap-8">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-4 w-16 rounded-lg bg-white/5 animate-pulse" />
              ))}
            </div>
            <div className="h-10 w-24 rounded-lg bg-white/5 animate-pulse" />
          </div>
        </div>

        <HeroSkeleton />
        <SectionSkeleton />
        
        <div className="py-24 sm:py-32 px-6 sm:px-12">
          <div className="mx-auto max-w-screen-xl">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <FeatureCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>

        <SectionSkeleton />
        <FAQSkeleton />
        <FooterSkeleton />
      </div>
    );
  }

  return <>{children}</>;
}