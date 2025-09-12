import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <main className="pl-72">
        <TopBar />
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
