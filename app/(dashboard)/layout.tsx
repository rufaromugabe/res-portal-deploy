"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import AppNavBar from "@/components/app-navbar";
import { AuthProvider } from "@/components/auth-provider";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LoadingSpinner } from "@/components/loading-spinner";
import { AppDrawer } from "@/components/app-drawer";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, loading, role } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else {
        setIsAuthorized(true);
      }
    }
  }, [user, loading, role, router]);

  if (loading || !isAuthorized) {
    return <LoadingSpinner />;
  }

  return (
    <SidebarProvider>
      {/* Show AppDrawer only on small screens (e.g., screens < 768px) */}
      <div className="block sm:hidden">
        
      </div>

      {/* Show AppSidebar only on medium and larger screens (e.g., screens >= 768px) */}
      <div className="hidden sm:block">
        <AppSidebar />
      </div>

      <main className="w-full h-screen">
        <div className=" bg-white rounded-2xl border border-gray-200 shadow-lg mt-2">
        <AppDrawer >{children} </AppDrawer>
        </div>
      </main>
    </SidebarProvider>
  );
}
