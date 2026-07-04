"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <>{children}</>;

  const isWatchPage = pathname?.startsWith("/watch");
  const isAdminPage = pathname?.startsWith("/admin");

  if (isWatchPage || isAdminPage) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <div className="pb-16 lg:pb-0">
        {/*
          Page transition — 250ms fade + subtle upward rise.
          key={pathname} triggers exit/enter on every route change.
          mode="wait" ensures exit completes before next page enters.
          You feel it, you don't consciously see it — that's the goal.
        */}
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