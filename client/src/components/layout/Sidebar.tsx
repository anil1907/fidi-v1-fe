import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  ClipboardList, 
  Calendar,
  BarChart3,
  Settings,
  Utensils,
  MoreHorizontal
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Genel Bakış", href: "/", icon: LayoutDashboard },
  { name: "Danışanlar", href: "/clients", icon: Users, count: 0 },
  { name: "Şablonlar", href: "/templates", icon: FileText },
  { name: "Diyet Planları", href: "/plans", icon: ClipboardList },
  { name: "Randevular", href: "/appointments", icon: Calendar },
];

const secondaryNavigation = [
  { name: "Analitik", href: "/analytics", icon: BarChart3 },
  { name: "Ayarlar", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <nav className="fixed inset-y-0 left-0 z-50 w-72 bg-card border-r border-border no-print">
      <div className="flex h-full flex-col">
        {/* Logo/Brand */}
        <div className="flex h-16 shrink-0 items-center px-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Utensils className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold">Fidi</span>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 px-4 py-6">
          <nav className="space-y-2">
            {navigation.map((item) => {
              const isActive = location === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    isActive 
                      ? "bg-accent text-accent-foreground" 
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                  data-testid={`nav-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                  {item.count !== undefined && (
                    <span className="ml-auto bg-primary/10 text-primary px-2 py-0.5 text-xs rounded-full">
                      {item.count}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Secondary Navigation */}
          <div className="mt-8 pt-8 border-t border-border">
            <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Araçlar
            </h3>
            <nav className="space-y-1">
              {secondaryNavigation.map((item) => {
                const isActive = location === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                      isActive 
                        ? "bg-accent text-accent-foreground" 
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                    data-testid={`nav-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-primary-foreground">AY</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Ayşe Yılmaz</p>
              <p className="text-xs text-muted-foreground truncate">Diyetisyen</p>
            </div>
            <button className="p-1.5 rounded-md hover:bg-accent transition-colors">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
