"use client";

import { Search, Bell, Sun, Moon, Command, ShoppingBag, AlertTriangle, Info, ShieldAlert, Store, ChevronDown, Check } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { CommandPalette } from "./command-palette";
import Link from "next/link";

export function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isOutletDropdownOpen, setIsOutletDropdownOpen] = useState(false);

  const [activeOutlet, setActiveOutlet] = useState({ id: 1, name: "HSR Layout", code: "Outlet #1" });
  
  const outlets = [
    { id: 1, name: "HSR Layout", code: "Outlet #1" },
    { id: 2, name: "Indiranagar", code: "Outlet #2" },
    { id: 3, name: "Koramangala", code: "Outlet #3" },
  ];

  const [notifications, setNotifications] = useState([
    { id: 1, type: "order", title: "New Zomato Order", message: "Order #4529 received for ₹850", time: "2 min ago", unread: true },
    { id: 2, type: "stock", title: "Low Stock Alert", message: "Tomato ketchup is running low (under 5 units)", time: "1 hour ago", unread: true },
    { id: 3, type: "system", title: "System Update", message: "POS software updated to v2.4.1", time: "3 hours ago", unread: false },
    { id: 4, type: "alert", title: "Void Action", message: "Manager PIN used for 15% discount on Bill #892", time: "Yesterday", unread: false },
  ]);

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  // Avoid hydration mismatch — only render theme-dependent UI after mount
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const toggleTheme = () => {
    // Add transition class for smooth animation
    document.documentElement.classList.add("transitioning");
    setTheme(theme === "dark" ? "light" : "dark");
    setTimeout(() => document.documentElement.classList.remove("transitioning"), 300);
  };

  return (
    <>
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-background/80 backdrop-blur-xl px-6 sticky top-0 z-30">
        {/* Search */}
        <div className="flex flex-1 max-w-md">
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-3 w-full h-9 rounded-lg border border-border bg-muted/30 px-3 text-sm text-muted-foreground hover:bg-muted/50 hover:border-border transition-all"
          >
            <Search className="h-3.5 w-3.5" />
            <span className="flex-1 text-left text-[13px]">Search everything...</span>
            <kbd className="hidden md:inline-flex h-5 items-center gap-0.5 rounded border border-border bg-muted/50 px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
              <Command className="h-2.5 w-2.5" />K
            </kbd>
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            aria-label="Toggle theme"
          >
            {mounted ? (
              theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" /> // Default icon before hydration
            )}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button 
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            >
              <Bell className="h-4 w-4" />
              {notifications.some(n => n.unread) && (
                <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-background" />
              )}
            </button>

            {isNotificationsOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setIsNotificationsOpen(false)} 
                />
                <div className="absolute right-0 mt-2 w-80 bg-background border border-border rounded-xl shadow-lg shadow-black/5 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                  <div className="p-4 border-b border-border flex justify-between items-center bg-muted/30">
                    <h3 className="font-semibold text-sm">Notifications</h3>
                    <button 
                      onClick={markAllAsRead}
                      className="text-[11px] text-primary hover:underline font-medium"
                    >
                      Mark all as read
                    </button>
                  </div>
                  <div className="max-h-[360px] overflow-y-auto">
                    {notifications.map(notification => (
                      <div key={notification.id} className={`p-4 border-b border-border hover:bg-muted/30 transition-colors cursor-pointer flex gap-3 ${notification.unread ? 'bg-primary/5' : ''}`}>
                        <div className="shrink-0 mt-1">
                          {notification.type === 'order' && <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center"><ShoppingBag className="w-4 h-4 text-orange-600" /></div>}
                          {notification.type === 'stock' && <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center"><AlertTriangle className="w-4 h-4 text-red-600" /></div>}
                          {notification.type === 'system' && <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center"><Info className="w-4 h-4 text-blue-600" /></div>}
                          {notification.type === 'alert' && <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center"><ShieldAlert className="w-4 h-4 text-purple-600" /></div>}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm ${notification.unread ? 'font-semibold text-foreground' : 'font-medium text-foreground'}`}>{notification.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{notification.message}</p>
                          <p className="text-[10px] text-muted-foreground mt-1.5 font-medium">{notification.time}</p>
                        </div>
                        {notification.unread && (
                          <div className="shrink-0 mt-1.5">
                            <div className="w-2 h-2 rounded-full bg-primary" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="p-3 border-t border-border bg-muted/30 text-center">
                    <Link 
                      href="/inbox" 
                      onClick={() => setIsNotificationsOpen(false)}
                      className="text-xs font-medium text-muted-foreground hover:text-foreground inline-block w-full"
                    >
                      View All Activity
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="w-px h-6 bg-border mx-2" />

          <div className="relative">
            <button 
              onClick={() => setIsOutletDropdownOpen(!isOutletDropdownOpen)}
              className="flex items-center gap-2 pl-1 p-1.5 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center text-primary">
                <Store className="w-4 h-4" />
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-[12px] font-semibold text-foreground leading-none">{activeOutlet.name}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{activeOutlet.code}</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground ml-1" />
            </button>

            {isOutletDropdownOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setIsOutletDropdownOpen(false)} 
                />
                <div className="absolute right-0 mt-2 w-56 bg-background border border-border rounded-xl shadow-lg shadow-black/5 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                  <div className="p-3 border-b border-border bg-muted/30">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Switch Outlet</p>
                  </div>
                  <div className="p-1.5">
                    {outlets.map((outlet) => (
                      <button
                        key={outlet.id}
                        onClick={() => {
                          setActiveOutlet(outlet);
                          setIsOutletDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between p-2 rounded-md text-sm transition-colors ${
                          activeOutlet.id === outlet.id 
                            ? "bg-primary/10 text-primary font-medium" 
                            : "hover:bg-muted text-foreground"
                        }`}
                      >
                        <div className="flex flex-col items-start">
                          <span>{outlet.name}</span>
                          <span className="text-[10px] opacity-70">{outlet.code}</span>
                        </div>
                        {activeOutlet.id === outlet.id && <Check className="w-4 h-4" />}
                      </button>
                    ))}
                  </div>
                  <div className="p-2 border-t border-border">
                    <Link 
                      href="/settings"
                      onClick={() => setIsOutletDropdownOpen(false)}
                      className="w-full flex items-center justify-center gap-2 p-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                    >
                      <Store className="w-3.5 h-3.5" />
                      Manage Outlets
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      <CommandPalette 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />
    </>
  );
}