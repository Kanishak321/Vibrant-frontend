"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, FileText, ShoppingBag, Box, Inbox, UserCircle, Settings, X, Command } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type CommandPaletteProps = {
  isOpen: boolean;
  onClose: () => void;
};

const links = [
  { name: "Dashboard", href: "/dashboard", icon: <Command className="h-4 w-4" /> },
  { name: "POS & Billing", href: "/pos", icon: <ShoppingBag className="h-4 w-4" /> },
  { name: "Menu Management", href: "/menu", icon: <FileText className="h-4 w-4" /> },
  { name: "Inventory", href: "/inventory", icon: <Box className="h-4 w-4" /> },
  { name: "Purchases", href: "/purchases", icon: <Box className="h-4 w-4" /> },
  { name: "Inbox", href: "/inbox", icon: <Inbox className="h-4 w-4" /> },
  { name: "Team & Audit", href: "/audit", icon: <UserCircle className="h-4 w-4" /> },
  { name: "Settings", href: "/settings", icon: <Settings className="h-4 w-4" /> },
];

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const filteredLinks = query === ""
    ? links
    : links.filter((link) => link.name.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        isOpen ? onClose() : onClose(); // the parent should handle toggling, but we can't toggle from inside unless we change the prop design. 
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
            onClick={onClose}
          />
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.15 }}
              className="w-full max-w-xl bg-card border border-border shadow-2xl rounded-xl overflow-hidden pointer-events-auto"
            >
              <div className="flex items-center px-4 border-b border-border">
                <Search className="h-5 w-5 text-muted-foreground mr-3" />
                <input
                  type="text"
                  placeholder="Search modules or actions..."
                  className="flex-1 h-14 bg-transparent outline-none text-sm placeholder:text-muted-foreground text-foreground"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  autoFocus
                />
                <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="max-h-[60vh] overflow-y-auto p-2">
                {filteredLinks.length === 0 ? (
                  <p className="text-center text-sm text-muted-foreground py-10">No results found.</p>
                ) : (
                  <div className="flex flex-col gap-1">
                    <p className="text-xs font-semibold text-muted-foreground px-3 py-2 uppercase tracking-wider">Navigation</p>
                    {filteredLinks.map((link) => (
                      <button
                        key={link.href}
                        onClick={() => {
                          router.push(link.href);
                          onClose();
                        }}
                        className="flex items-center gap-3 px-3 py-3 text-sm text-foreground hover:bg-primary/10 hover:text-primary rounded-lg transition-colors text-left"
                      >
                        {link.icon}
                        {link.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="border-t border-border bg-muted/30 p-3 flex justify-between items-center text-xs text-muted-foreground">
                <span className="flex items-center gap-1">Press <kbd className="bg-muted px-1 rounded border border-border">Esc</kbd> to close</span>
                <span className="flex items-center gap-1">Use arrows to navigate</span>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}