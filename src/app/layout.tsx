"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { useState, useEffect } from "react";
import { FullScreenLoader } from "@/components/ui/FullScreenLoader";
import { PageLoader } from "@/components/ui/PageLoader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isFirstVisit, setIsFirstVisit] = useState(true);
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    // Check if this is the first visit
    const hasVisited = sessionStorage.getItem("hasVisited");
    if (hasVisited) {
      setIsFirstVisit(false);
      setShowLoader(false);
    }
  }, []);

  const handleLoadingComplete = () => {
    sessionStorage.setItem("hasVisited", "true");
    setShowLoader(false);
  };

  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black`}>
          {/* Full-screen loader on first visit */}
          {isFirstVisit && showLoader && (
            <FullScreenLoader onLoadingComplete={handleLoadingComplete} />
          )}
          
          {/* Page loader for subsequent visits */}
          {!showLoader && (
            <PageLoader>
              {children}
            </PageLoader>
          )}
        </body>
      </html>
    </ClerkProvider>
  );
}