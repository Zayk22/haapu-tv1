"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import {
  LayoutDashboard, Film, Image as ImageIcon,
  Settings, Menu, LogOut, ChevronRight,
  Tv, Layout, Users,
} from "lucide-react";

const navItems = [
  { href: "/admin",           label: "Dashboard",         icon: LayoutDashboard, exact: true },
  { href: "/admin/movies",    label: "Movies",             icon: Film },
  { href: "/admin/hero",      label: "Hero Carousel",      icon: Tv },
  { href: "/admin/homepage",  label: "Homepage Sections",  icon: Layout },
  { href: "/admin/users",     label: "Users",              icon: Users },
  { href: "/admin/media",     label: "Media Library",      icon: ImageIcon },
  { href: "/admin/settings",  label: "Settings",           icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { userId, isLoaded } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (isLoaded && !userId) router.push("/sign-in?redirect_url=/admin");
  }, [isLoaded, userId, router]);

  if (!isLoaded || !userId) return null;

  const isActive = (item: typeof navItems[0]) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href);

  const Sidebar = () => (
    <div className="flex h-full flex-col bg-matte-900 border-r border-matte-800">
      {/* Logo only — no text needed */}
      <div className="flex items-center border-b border-matte-800 px-5 py-4">
        <Link href="/" target="_blank">
          <img src="/logo.png" alt="Haapu TV" className="h-10 w-auto object-contain" />
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {navItems.map((item) => {
          const active = isActive(item);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-crimson-DEFAULT/15 text-crimson-DEFAULT"
                  : "text-matte-400 hover:bg-matte-800 hover:text-white"
              }`}
            >
              <item.icon size={17} />
              <span>{item.label}</span>
              {active && <ChevronRight size={14} className="ml-auto opacity-60" />}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-matte-800 px-3 py-3 space-y-1">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-matte-400 hover:bg-matte-800 hover:text-white transition-colors"
        >
          <Tv size={17} />
          <span>View Site</span>
        </Link>
        <button
          onClick={() => router.push("/sign-out")}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-matte-400 hover:bg-matte-800 hover:text-red-400 transition-colors"
        >
          <LogOut size={17} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-matte-950 overflow-hidden">
      <div className="hidden lg:block w-60 flex-shrink-0 h-full">
        <Sidebar />
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-64">
            <Sidebar />
          </div>
        </div>
      )}

      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex items-center gap-4 border-b border-matte-800 bg-matte-900 px-4 py-3 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 text-matte-400 hover:bg-matte-800 hover:text-white"
          >
            <Menu size={20} />
          </button>
          <span className="font-semibold text-white">Admin Panel</span>
        </div>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}