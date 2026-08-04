"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { AnimatePresence, motion } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileBottomNav from "@/components/layout/MobileBottomNav";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { userId, isLoaded } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <>{children}</>;

  const isWatchPage  = pathname?.startsWith("/watch");
  const isAdminPage  = pathname?.startsWith("/admin");

  // Marketing page — unauthenticated users on "/".
  // MarketingPage renders its own complete layout (header nav, footer, social links).
  // Don't wrap with the shared chrome to avoid duplicate footer.
  const isMarketingPage = pathname === "/" && isLoaded && !userId;

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