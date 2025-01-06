"use client";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import AppNavBar from "@/components/app-navbar";
import { AuthProvider } from "@/components/auth-provider";
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import {LoadingSpinner} from '@/components/loading-spinner';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, loading, role } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (role !== 'admin') {
        router.push('/unauthorized');
      }
    }
  }, [user, loading, role, router]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <AuthProvider>
      <SidebarProvider>
        <AppSidebar />
        <main className="w-full h-screen">
          <div className="h-[98%] w-[99%] bg-white rounded-2xl border border-gray-200 shadow-lg mt-2">
            {children}
          </div>
        </main>
      </SidebarProvider>
    </AuthProvider>
  );
}