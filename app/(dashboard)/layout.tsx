"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LoadingSpinner } from "@/components/loading-spinner";
import { AppDrawer } from "@/components/app-drawer";
import { getFirestore, doc, getDoc } from "firebase/firestore";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, loading, role } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [applicationStartTime, setApplicationStartTime] = useState<Date | null>(null);

  const db = getFirestore();
  const settingsDocRef = doc(db, "Settings", "ApplicationLimits");

  useEffect(() => {
    const checkApplicationTime = async () => {
      if (!loading && user) {
        try {
          // Fetch application start time from Firestore
          const docSnapshot = await getDoc(settingsDocRef);
          if (docSnapshot.exists()) {
            const data = docSnapshot.data();
            const startDateTime = data.startDateTime;

            if (startDateTime) {
              setApplicationStartTime(new Date(startDateTime));
            }
          } else {
            console.error("Start time not found in settings.");
          }
        } catch (error) {
          console.error("Error fetching application time:", error);
        }
      }

      // If the user is not loading and is authenticated
      if (!loading && user) {
        if (role !== "admin" && !user) {
          router.push("/login");
        } else {
          setIsAuthorized(true);
        }
      }
    };

    checkApplicationTime();
  }, [user, loading, router]);

  useEffect(() => {
    if (applicationStartTime && role !== "admin") {
      const now = new Date();
      // Redirect to countdown page if the application has not started and the user is not an admin
      if (now < applicationStartTime) {
        router.push("/countdown");
      }
    }
  }, [applicationStartTime, router, role]);

  if (loading || !isAuthorized) {
    return <LoadingSpinner />;
  }

  return (
    <SidebarProvider>
      {/* Show AppDrawer only on small screens (e.g., screens < 768px) */}
      <div className="block sm:hidden">
        {/* You can add your mobile drawer component here */}
      </div>

      {/* Show AppSidebar only on medium and larger screens (e.g., screens >= 768px) */}
      <div className="hidden sm:block">
        <AppSidebar />
      </div>

      <main className="w-full h-screen">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg mt-2">
          <AppDrawer>{children}</AppDrawer>
        </div>
      </main>
    </SidebarProvider>
  );
}
