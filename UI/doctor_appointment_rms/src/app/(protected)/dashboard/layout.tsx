// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
// import { Navbar } from "@/components/layout/navbar";
// import { Sidebar } from "@/features/dashboard/components/sidebar";

// export default function DashboardLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const router = useRouter();
//   const { data, isLoading, isError } = useCurrentUser();

//   const [mounted, setMounted] = useState(false);
//   // Interactive navbar scrolling states
//   const [isNavbarVisible, setIsNavbarVisible] = useState(true);
//   const [lastScrollY, setLastScrollY] = useState(0);

//   // Sync component mounting state to safely bypass Next.js SSR hydration checks
//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   useEffect(() => {
//     if (mounted && !isLoading && (isError || !data)) {
//       router.replace("/login");
//     }
//   }, [isLoading, isError, data, router, mounted]);

//   // Track scroll direction to hide/show navbar dynamically
//   useEffect(() => {
//     if (!mounted) return;

//     const handleScroll = () => {
//       const currentScrollY = window.scrollY;

//       // Hide navbar if scrolling down past its height threshold (64px)
//       if (currentScrollY > lastScrollY && currentScrollY > 64) {
//         setIsNavbarVisible(false);
//       } 
//       // Show navbar instantly when scrolling up
//       else if (currentScrollY < lastScrollY) {
//         setIsNavbarVisible(true);
//       }

//       setLastScrollY(currentScrollY);
//     };

//     window.addEventListener("scroll", handleScroll, { passive: true });
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, [lastScrollY, mounted]);

  
//   // By checking '!mounted' along with auth states, the server and client initial pass 
//   // will render a uniform loading screen. This satisfies Next.js DOM matching rules 
//   // while completely hiding the Sidebar, Navbar, and private children from leaking.
//   if (!mounted || isLoading || isError || !data) {
//     return (
//       <div className="h-screen flex items-center justify-center bg-slate-50 text-sm text-gray-500 font-medium">
//         Loading session...
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-slate-50/50 flex">
      
//       {/* 1. SIDEBAR POSITION */}
//       <div className="hidden md:block">
//         <Sidebar />
//       </div>

//       {/* 2. INTERACTIVE NAVBAR POSITION */}
//       <div 
//         className={`fixed top-0 right-0 left-0 md:left-64 z-40 transition-transform duration-300 ease-in-out ${
//           isNavbarVisible ? "translate-y-0" : "-translate-y-full"
//         }`}
//       >
//         <Navbar />
//       </div>

//       {/* 3. CONTENT CONTAINER POSITION */}
//       <div className="flex-1 min-w-0 md:pl-64 pt-16 flex flex-col">
//         <main className="flex-1 w-full flex flex-col items-center justify-start">
//           <div className="w-full max-w-7xl p-6 lg:p-8">
//             {children}
//           </div>
//         </main>
//       </div>
      
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/features/dashboard/components/sidebar";
import Link from "next/link";
import { RiFlaskLine, RiLogoutBoxRLine } from "@remixicon/react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
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

  //Safely extract the role using type casting to bypass the strict enum warning
  const rawRole = (data as any)?.role;
  const isLabTech = rawRole === "LabTechnician";

  // 🛠️ Functional Logout Handler
  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    
    // Clear cookies or call any auth cleanup methods here if needed
    
    router.replace("/login");
  };

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
        {isLabTech ? (
          /* Isolated Sidebar for Lab Technicians */
          <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between fixed h-full z-50 left-0 top-0">
            <div className="p-6">
              {/* Brand Logo */}
              <div className="flex items-center gap-2 text-blue-600 font-bold text-xl tracking-tight mb-1">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                  <path d="M13 3V11H21V3H13ZM11 3H3V13H11V3ZM13 13V21H21V13H13ZM11 15H3V21H11V15Z"></path>
                </svg>
                <span>MediLink</span>
              </div>
              
              {/* Subtitle Header */}
              <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-8">
                LAB PORTAL
              </p>

              {/* Single Navigation Route */}
              <nav className="space-y-1">
                <Link
                  href="/dashboard/lab"
                  className={`flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all ${
                    pathname === "/dashboard/lab"
                      ? "bg-blue-600 text-white shadow-md shadow-blue-100"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                  }`}
                >
                  <RiFlaskLine className={`w-5 h-5 ${pathname === "/dashboard/lab" ? "text-white" : "text-slate-400"}`} />
                  <span>Lab Portal</span>
                </Link>
              </nav>
            </div>

            {/* Permanent Footer Logout Trigger */}
            <div className="p-6 border-t border-slate-100">
              <button 
                onClick={handleLogout} 
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors text-left"
              >
                <RiLogoutBoxRLine className="w-5 h-5 text-red-500" />
                <span>Logout</span>
              </button>
            </div>
          </aside>
        ) : (
          /*  Render regular sidebar config for Doctor/Admin/Registered profiles */
          <Sidebar />
        )}
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