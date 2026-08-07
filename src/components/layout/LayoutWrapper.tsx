"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { AnimatePresence, motion } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileBottomNav from "@/components/layout/MobileBottomNav";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { userId, isLoaded } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isWatchPage = pathname?.startsWith("/watch");
  const isAdminPage = pathname?.startsWith("/admin");

  // Only strip shared layout on the homepage AFTER Clerk has confirmed
  // the user is NOT logged in. While loading, always show the full layout
  // so authenticated users never flash a missing navbar.
  const isMarketingPage = mounted && isLoaded && !userId && pathname === "/";

  if (isWatchPage || isAdminPage || isMarketingPage) {
    return <>{children}</>;
  }

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