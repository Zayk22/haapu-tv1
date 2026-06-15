"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Film, 
  Image, 
  Settings,
  LogOut,
  Menu,
  X
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // ALL hooks must be called BEFORE any conditional returns
  const { userId, isLoaded } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const checkScreenSize = () => {
      const desktop = window.innerWidth >= 1024;
      setIsDesktop(desktop);
      if (!desktop) {
        setIsSidebarCollapsed(true);
      } else {
        setIsSidebarCollapsed(false);
      }
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    if (isLoaded && !userId) {
      router.push('/sign-in?redirect_url=/admin');
    }
  }, [isLoaded, userId, router]);

  // NOW we can do conditional returns AFTER all hooks
  if (!isLoaded) {
    return (
      <div className="flex h-screen items-center justify-center bg-matte-950">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-matte-700 border-t-crimson-DEFAULT" />
      </div>
    );
  }

  if (!userId) {
    return null;
  }

  const isActive = (href: string) => {
    if (href === "/admin" && pathname === "/admin") return true;
    if (href !== "/admin" && pathname?.startsWith(href)) return true;
    return false;
  };

  const SidebarLink = ({ href, icon: Icon, label, collapsed }: { href: string; icon: any; label: string; collapsed: boolean }) => {
    const active = isActive(href);
    
    return (
      <Link
        href={href}
        onClick={() => setIsMobileMenuOpen(false)}
        className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-200 ${
          active 
            ? "bg-crimson-DEFAULT text-white shadow-glow-sm" 
            : "text-matte-300 hover:bg-matte-800 hover:text-white"
        }`}
        title={collapsed ? label : ""}
      >
        <Icon size={18} />
        {!collapsed && <span>{label}</span>}
      </Link>
    );
  };

  const SidebarContent = ({ collapsed = false }: { collapsed?: boolean }) => (
    <>
      <div className={`flex h-16 items-center border-b border-matte-800 ${collapsed ? 'justify-center px-2' : 'px-4'}`}>
        {!collapsed ? (
          <h1 className="font-display text-xl font-bold">
            <span className="text-white">Admin</span>
            <span className="text-gradient ml-1">haapu</span>
          </h1>
        ) : (
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-crimson-DEFAULT to-crimson-dark" />
        )}
      </div>
      
      <nav className="flex-1 space-y-1 p-3">
        <SidebarLink href="/admin" icon={LayoutDashboard} label="Dashboard" collapsed={collapsed} />
        <SidebarLink href="/admin/movies" icon={Film} label="Movies" collapsed={collapsed} />
        <SidebarLink href="/admin/media" icon={Image} label="Media" collapsed={collapsed} />
        <SidebarLink href="/admin/settings" icon={Settings} label="Settings" collapsed={collapsed} />
      </nav>
      
      <div className={`border-t border-matte-800 p-3 ${collapsed ? 'text-center' : ''}`}>
        <Link
          href="/"
          onClick={() => setIsMobileMenuOpen(false)}
          className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-matte-300 transition-colors hover:bg-matte-800 hover:text-white ${collapsed ? 'justify-center' : ''}`}
          title={collapsed ? "Back to Site" : ""}
        >
          <LogOut size={18} />
          {!collapsed && <span>Back to Site</span>}
        </Link>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-matte-950">
      {/* Mobile Header */}
      <div className="fixed left-0 right-0 top-0 z-50 flex h-14 items-center justify-between border-b border-matte-800 bg-matte-900 px-4 lg:hidden">
        <h1 className="font-display text-lg font-bold">
          <span className="text-white">Admin</span>
          <span className="text-gradient ml-1">haapu</span>
        </h1>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="rounded-lg p-2 text-matte-400 transition-colors hover:bg-matte-800 hover:text-white"
        >
          <Menu size={22} />
        </button>
      </div>

      {/* Mobile Slide-out Menu */}
      {isMobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/60 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <aside className="fixed bottom-0 left-0 top-0 z-50 w-64 border-r border-matte-800 bg-matte-900 lg:hidden">
            <div className="flex h-full flex-col">
              <div className="flex h-14 items-center justify-between border-b border-matte-800 px-4">
                <h1 className="font-display text-lg font-bold">
                  <span className="text-white">Admin</span>
                  <span className="text-gradient ml-1">haapu</span>
                </h1>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="rounded-lg p-2 text-matte-400 transition-colors hover:bg-matte-800 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>
              <SidebarContent collapsed={false} />
            </div>
          </aside>
        </>
      )}

      {/* Desktop Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-30 hidden h-screen border-r border-matte-800 bg-matte-900 transition-all duration-300 lg:block ${
          isSidebarCollapsed ? "w-16" : "w-64"
        }`}
      >
        <div className="flex h-full flex-col">
          <SidebarContent collapsed={isSidebarCollapsed} />
        </div>
      </aside>

      {/* Collapse Toggle Button */}
      <button
        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        className="fixed bottom-4 left-4 z-40 hidden rounded-full bg-matte-800 p-2 text-matte-400 transition-all hover:bg-matte-700 hover:text-white lg:block"
        title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isSidebarCollapsed ? "→" : "←"}
      </button>
      
      {/* Main Content */}
      <main
        className={`min-h-screen transition-all duration-300 lg:ml-16 ${
          !isSidebarCollapsed && isDesktop ? "lg:ml-64" : "lg:ml-16"
        }`}
      >
        <div className="pt-14 lg:pt-0">
          <div className="p-4 md:p-6 lg:p-8">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}