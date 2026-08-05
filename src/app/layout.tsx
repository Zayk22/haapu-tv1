"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import "./globals.css";
import { useState, useEffect } from "react";
import { FullScreenLoader } from "@/components/ui/FullScreenLoader";
import { PageLoader } from "@/components/ui/PageLoader";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isFirstVisit, setIsFirstVisit] = useState(true);
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
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
        <body className={`${inter.className} antialiased bg-black`}>
          {isFirstVisit && showLoader && (
            <FullScreenLoader onLoadingComplete={handleLoadingComplete} />
          )}
          
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