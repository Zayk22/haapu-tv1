"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { AnimatePresence, motion } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import MarketingHeader from "@/components/marketing/MarketingHeader";
import MarketingFooter from "@/components/marketing/MarketingFooter";

// Public marketing routes (EXCLUDING "/" because it's handled separately below)
const PUBLIC_ROUTES = [
  "/faq",
  "/covenant",
  "/contact",
  "/privacy",
  "/terms",
  "/cookie-preferences",
  "/corporate",
  "/quality",
  "/sign-in",
  "/sign-up",
];

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { userId, isLoaded } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isWatchPage = pathname?.startsWith("/watch");
  const isAdminPage = pathname?.startsWith("/admin");

  // 1. Video player and admin pages → no layout at all (they own their own)
  if (isWatchPage || isAdminPage) {
    return <>{children}</>;
  }

  // 2. Root "/" → decide between MarketingPage (logged out) and authenticated app (logged in)
  if (pathname === "/") {
    // Not yet loaded → render children without layout (avoid flash)
    if (!isLoaded) return <>{children}</>;

    if (!userId) {
      // Logged out → MarketingPage renders its own header/footer, so we return children ONLY
      return <>{children}</>;
    }

    // Logged in → authenticated layout with Header, Footer, MobileBottomNav
    return (
      <>
        <Header />
        <div className="pb-16 lg:pb-0">
          <AnimatePresence mode="wait">
            <motion.main
              key={pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
            >
              {children}
            </motion.main>
          </AnimatePresence>
        </div>
        <Footer />
        <MobileBottomNav />
      </>
    );
  }

  // 3. Public marketing routes → shell depends on authentication status
  if (PUBLIC_ROUTES.some((route) => pathname?.startsWith(route))) {
    // Not yet loaded → render children without layout (avoid flash)
    if (!isLoaded) {
      return <>{children}</>;
    }

    // Logged in → authenticated shell
    if (userId) {
      return (
        <>
          <Header />
          <div className="pb-16 lg:pb-0">
            <AnimatePresence mode="wait">
              <motion.main
                key={pathname}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
              >
                {children}
              </motion.main>
            </AnimatePresence>
          </div>
          <Footer />
          <MobileBottomNav />
        </>
      );
    }

    // Logged out → marketing shell
    return (
      <>
        <MarketingHeader />
        <div className="pt-16 md:pt-20">
          <AnimatePresence mode="wait">
            <motion.main
              key={pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
            >
              {children}
            </motion.main>
          </AnimatePresence>
        </div>
        <MarketingFooter />
      </>
    );
  }

  // 4. All other routes (e.g., /movies, /watchlist, /account) → authenticated layout
  return (
    <>
      <Header />
      <div className="pb-16 lg:pb-0">
        <AnimatePresence mode="wait">
          <motion.main
            key={pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            {children}
          </motion.main>
        </AnimatePresence>
      </div>
      <Footer />
      <MobileBottomNav />
    </>
  );
}