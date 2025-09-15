import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen">
      {/* Desktop Sidebar - Hidden on mobile */}
      <Sidebar className="hidden md:block" />
      
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
