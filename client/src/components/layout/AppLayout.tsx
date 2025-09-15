import { useEffect } from "react";
import { useLocation } from "wouter";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import { useUIStore } from "@/store/ui";
import {
  Sheet,
  SheetContent,
} from "@/components/ui/sheet";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [location] = useLocation();
  const { mobileSidebarOpen, setMobileSidebarOpen } = useUIStore();

  // Auto-close mobile sidebar on route change
  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [location, setMobileSidebarOpen]);

  return (
    <div className="min-h-screen">
      {/* Desktop Sidebar - Hidden on mobile */}
      <Sidebar className="hidden md:block" />
      
      {/* Mobile Sidebar Sheet */}
      <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
        <SheetContent side="left" className="p-0 w-72">
          <Sidebar />
        </SheetContent>
      </Sheet>
      
      {/* Main content with responsive padding */}
      <main className="pl-0 md:pl-72">
        <TopBar />
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
