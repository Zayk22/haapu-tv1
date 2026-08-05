"use client";

import { useEffect, useState } from "react";

interface FullScreenLoaderProps {
  onLoadingComplete?: () => void;
}

export function FullScreenLoader({ onLoadingComplete }: FullScreenLoaderProps) {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Simulate loading time (2-3 seconds)
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => {
        onLoadingComplete?.();
      }, 600); // Wait for fade animation
    }, 2500);

    return () => clearTimeout(timer);
  }, [onLoadingComplete]);

  return (
    <div 
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black transition-opacity duration-700 ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center gap-8">
        {/* Logo */}
        <img 
          src="/logo.png" 
          alt="Haapu TV" 
          className="h-16 w-auto object-contain sm:h-20 md:h-24"
        />
        
        {/* Gold spinner */}
        <div className="relative">
          <div 
            className="h-12 w-12 animate-spin rounded-full border-4 border-t-4 border-white/10"
            style={{ borderTopColor: "#D4AF37" }}
          />
          <div 
            className="absolute inset-0 h-12 w-12 animate-pulse rounded-full"
            style={{ 
              background: "radial-gradient(circle, rgba(212,175,55,0.1) 0%, transparent 70%)",
              filter: "blur(8px)"
            }}
          />
        </div>

        {/* Brand text */}
        <p className="text-sm font-medium tracking-[0.3em] text-white/40 uppercase">
          Loading Experience
        </p>
      </div>
    </div>
  );
}