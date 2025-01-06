import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import AppNavBar from "@/components/app-navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full h-screen">
        <div className="h-[98%]  w-[99%] bg-white  rounded-2xl border border-gray-200 shadow-lg mt-2 ">
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}
