"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
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

  // No chrome at all on watch or admin pages
  if (isWatchPage || isAdminPage) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      {/* pb-16 on mobile so content doesn't hide behind the bottom nav */}
      <div className="pb-16 lg:pb-0">
        {children}
      </div>
      <Footer />
      <MobileBottomNav />
    </>
  );
}