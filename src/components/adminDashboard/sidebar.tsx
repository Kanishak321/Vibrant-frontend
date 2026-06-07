"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard, ShoppingCart, UtensilsCrossed, Package, Truck,
  Users, Settings, BarChart3, Inbox, FileText, Heart, ChevronDown, LogOut, User, LifeBuoy
} from "lucide-react";
import { Logo } from "@/components/ui/logo";

// const navigation = [
//   { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
//   { name: "POS & Billing", href: "/pos", icon: ShoppingCart },
//   { name: "Menu Management", href: "/menu", icon: UtensilsCrossed },
//   { name: "Recipes & Inventory", href: "/inventory", icon: Package },
//   { name: "Purchases", href: "/purchases", icon: Truck },
//   { name: "Aggregator Inbox", href: "/inbox", icon: Inbox },
//   { name: "Roles & Audit", href: "/roles", icon: Users },
//   { name: "Staff Approvals", href: "/dashboard/manager/approvals", icon: Users },
//   { name: "Owner Cockpit", href: "/cockpit", icon: BarChart3 },
//   { name: "CRM", href: "/crm", icon: Heart },
//   { name: "Reports", href: "/reports", icon: FileText },
//   { name: "Settings", href: "/settings", icon: Settings },
// ];
const navigation = [
  {
    name: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "POS & Billing",
    href: "/admin/dashboard/pos",
    icon: ShoppingCart,
  },
  {
    name: "Menu Management",
    href: "/admin/dashboard/menu",
    icon: UtensilsCrossed,
  },
  {
    name: "Recipes & Inventory",
    href: "/admin/dashboard/inventory",
    icon: Package,
  },
  {
    name: "Purchases",
    href: "/admin/dashboard/purchases",
    icon: Truck,
  },
  {
    name: "Aggregator Inbox",
    href: "/admin/dashboard/inbox",
    icon: Inbox,
  },
  {
    name: "Roles & Audit",
    href: "/admin/dashboard/roles",
    icon: Users,
  },
  {
    name: "CRM",
    href: "/admin/dashboard/crm",
    icon: Heart,
  },
  {
    name: "Settings",
    href: "/admin/dashboard/settings",
    icon: Settings,
  }

];
export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  return (
    <div className="flex h-full w-[260px] flex-col bg-sidebar border-r border-sidebar-border">
      {/* Logo */}
      <div className="flex h-16 items-center px-5 border-b border-sidebar-border">
        <div className="flex items-center gap-2.5">
          <Logo className="text-[15px]" />
          <span className="text-[10px] font-medium text-primary bg-primary/10 px-1.5 py-0.5 rounded-full ml-1">PRO</span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex flex-1 flex-col overflow-y-auto pt-3 pb-3">
        <nav className="flex-1 space-y-0.5 px-2.5">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-all duration-150 ${
                  isActive
                    ? "bg-sidebar-accent text-sidebar-foreground shadow-sm"
                    : "text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                }`}
              >
                <Icon className={`h-4 w-4 flex-shrink-0 transition-colors ${
                  isActive ? "text-primary" : "text-muted-foreground group-hover:text-sidebar-foreground"
                }`} />
                {item.name}
                {item.name === "Aggregator Inbox" && (
                  <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500/20 text-red-500 text-[10px] font-bold px-1.5">
                    3
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Profile */}
      <div className="border-t border-sidebar-border p-3 relative">
        <button 
          onClick={() => setIsProfileOpen(!isProfileOpen)}
          className="w-full flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-sidebar-accent/50 cursor-pointer transition-colors text-left"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold ring-2 ring-primary/20 shrink-0">
            RS
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-medium text-sidebar-foreground truncate">Rahul Sharma</p>
            <p className="text-[11px] text-muted-foreground truncate">Owner • HSR Layout</p>
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
        </button>

        {isProfileOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
            <div className="absolute bottom-[60px] left-3 w-[236px] bg-background border border-border rounded-xl shadow-lg shadow-black/5 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="p-3 border-b border-border bg-muted/30">
                <p className="text-[13px] font-semibold text-foreground">Rahul Sharma</p>
                <p className="text-[11px] text-muted-foreground">rahul@kcpl.com</p>
              </div>
              <div className="p-1.5">
                <button 
                  onClick={() => {
                    setIsProfileOpen(false);
                    router.push("/settings");
                  }}
                  className="w-full flex items-center gap-2 p-2 text-[13px] text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                >
                  <User className="w-4 h-4" /> My Profile
                </button>
              </div>
              <div className="p-1.5 border-t border-border">
                <button 
                  onClick={async () => {
                    setIsLoggingOut(true);
                    try {
                      localStorage.removeItem("token");
                      localStorage.removeItem("user");
                      
                      const { useAuthStore } = await import("@/store/useAuthStore");
                      useAuthStore.getState().logout();
                      
                      router.push('/adminLogin');
                    } catch (e) {
                      console.error(e);
                    }
                  }}
                  disabled={isLoggingOut}
                  className="w-full flex items-center gap-2 p-2 text-[13px] font-medium text-red-500 hover:text-red-600 hover:bg-red-500/10 rounded-md transition-colors disabled:opacity-50"
                >
                  <LogOut className={`w-4 h-4 ${isLoggingOut ? "animate-pulse" : ""}`} /> 
                  {isLoggingOut ? "Logging out..." : "Log out"}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}