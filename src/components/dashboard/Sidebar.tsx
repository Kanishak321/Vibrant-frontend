"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  Banknote, 
  Utensils, 
  PackageSearch, 
  ShieldCheck,
  LogOut
} from "lucide-react";

const roleLinks = {
  Manager: [
    { name: "Dashboard", href: "/manager/dashboard", icon: LayoutDashboard },
    { name: "Staff", href: "#", icon: Users },
  ],
  Cashier: [
    { name: "Dashboard", href: "/cashier/dashboard", icon: LayoutDashboard },
    { name: "Billing", href: "#", icon: Banknote },
  ],
  Captain: [
    { name: "Dashboard", href: "/captain/dashboard", icon: LayoutDashboard },
    { name: "Orders", href: "#", icon: Utensils },
  ],
  "Inventory Manager": [
    { name: "Dashboard", href: "/inventory/dashboard", icon: LayoutDashboard },
    { name: "Stock", href: "#", icon: PackageSearch },
  ],
  Auditor: [
    { name: "Dashboard", href: "/auditor/dashboard", icon: LayoutDashboard },
    { name: "Reports", href: "#", icon: ShieldCheck },
  ],
  Admin: [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Settings", href: "#", icon: Settings },
  ]
};

export function Sidebar() {
  const { user, logout } = useAuthStore();
  const pathname = usePathname();

  if (!user) return null;

  const links = roleLinks[user.role] || [];

  return (
    <div className="w-64 border-r bg-card flex flex-col">
      <div className="h-16 flex items-center px-6 border-b">
        <Link href="/" className="text-xl font-bold tracking-tighter bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          kcpl
        </Link>
      </div>
      <div className="p-4 flex-1 space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="w-4 h-4" />
              {link.name}
            </Link>
          );
        })}
      </div>
      <div className="p-4 border-t">
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );
}
