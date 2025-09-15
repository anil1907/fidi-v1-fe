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
  LogOut,
  User
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth, useAuthActions } from "@/store/auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  const { user } = useAuth();
  const { logout } = useAuthActions();

  const handleLogout = () => {
    logout();
  };

  const getUserInitials = (firstName?: string, lastName?: string) => {
    if (!firstName || !lastName) return "U";
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <nav className="fixed inset-y-0 left-0 z-50 w-72 bg-card border-r border-border no-print">
      <div className="flex h-full flex-col">
        {/* Logo/Brand */}
        <div className="flex h-16 shrink-0 items-center px-6 border-b border-border">
          <div className="flex items-center gap-3">
            <img 
              src="/attached_assets/fidi-logo_1757925085635.jpg" 
              alt="Fidi Logo" 
              className="w-8 h-8 object-contain"
            />
            <span className="text-xl font-semibold text-primary">Fidi</span>
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="w-full justify-start h-auto p-0 hover:bg-accent"
                data-testid="user-menu-trigger"
              >
                <div className="flex items-center gap-3 w-full p-2">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-primary-foreground">
                      {getUserInitials(user?.firstName, user?.lastName)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-sm font-medium truncate">
                      {user ? `${user.firstName} ${user.lastName}` : "Kullanıcı"}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user?.title || "Diyetisyen"}
                    </p>
                  </div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              className="w-56 ml-4 mb-2" 
              align="start" 
              side="top"
              data-testid="user-menu-content"
            >
              <div className="flex items-center gap-2 p-2">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-primary-foreground">
                    {getUserInitials(user?.firstName, user?.lastName)}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    {user ? `${user.firstName} ${user.lastName}` : "Kullanıcı"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer" data-testid="menu-profile">
                <User className="mr-2 h-4 w-4" />
                Profil
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" data-testid="menu-settings">
                <Settings className="mr-2 h-4 w-4" />
                Ayarlar
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="cursor-pointer text-destructive focus:text-destructive" 
                onClick={handleLogout}
                data-testid="menu-logout"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Çıkış Yap
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
