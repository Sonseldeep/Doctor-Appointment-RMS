"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/features/dashboard/components/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { data, isLoading, isError } = useCurrentUser();

  const [mounted, setMounted] = useState(false);
  // Interactive navbar scrolling states
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Sync component mounting state to safely bypass Next.js SSR hydration checks
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isLoading && (isError || !data)) {
      router.replace("/login");
    }
  }, [isLoading, isError, data, router, mounted]);

  // Track scroll direction to hide/show navbar dynamically
  useEffect(() => {
    if (!mounted) return;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Hide navbar if scrolling down past its height threshold (64px)
      if (currentScrollY > lastScrollY && currentScrollY > 64) {
        setIsNavbarVisible(false);
      } 
      // Show navbar instantly when scrolling up
      else if (currentScrollY < lastScrollY) {
        setIsNavbarVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, mounted]);

  
  // By checking '!mounted' along with auth states, the server and client initial pass 
  // will render a uniform loading screen. This satisfies Next.js DOM matching rules 
  // while completely hiding the Sidebar, Navbar, and private children from leaking.
  if (!mounted || isLoading || isError || !data) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50 text-sm text-gray-500 font-medium">
        Loading session...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 flex">
      
      {/* 1. SIDEBAR POSITION */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* 2. INTERACTIVE NAVBAR POSITION */}
      <div 
        className={`fixed top-0 right-0 left-0 md:left-64 z-40 transition-transform duration-300 ease-in-out ${
          isNavbarVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <Navbar />
      </div>

      {/* 3. CONTENT CONTAINER POSITION */}
      <div className="flex-1 min-w-0 md:pl-64 pt-16 flex flex-col">
        <main className="flex-1 w-full flex flex-col items-center justify-start">
          <div className="w-full max-w-7xl p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
      
    </div>
  );
}