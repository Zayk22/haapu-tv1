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

// Public marketing routes that should use marketing header/footer
const PUBLIC_ROUTES = [
  "/",
  "/faq",
  "/covenant",
  "/contact",
  "/privacy",
  "/terms",
  "/cookie-preferences",
  "/corporate",
  "/sign-in",
  "/sign-up",
];

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { userId, isLoaded, sessionId } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Helper to check if current path is a public marketing route
  const isPublicRoute = (path: string) => {
    return PUBLIC_ROUTES.some((route) => {
      if (route === "/") return path === "/";
      return path?.startsWith(route);
    });
  };

  // Watch pages (video player) and admin have their own minimal layout
  const isWatchPage = pathname?.startsWith("/watch");
  const isAdminPage = pathname?.startsWith("/admin");

  // Special: root "/" when NOT logged in → MarketingPage renders its own header/footer
  const isMarketingRoot = pathname === "/" && isLoaded && !userId;

  // For public routes (except the marketing root), we render marketing header/footer
  const shouldUseMarketingLayout = !isWatchPage && !isAdminPage && !isMarketingRoot && isPublicRoute(pathname);

  if (isWatchPage || isAdminPage || isMarketingRoot) {
    return <>{children}</>;
  }

  if (shouldUseMarketingLayout) {
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

  // Authenticated layout (for all other routes, e.g., /, /movies, /watchlist, /account)
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