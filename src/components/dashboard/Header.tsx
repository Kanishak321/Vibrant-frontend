"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  const { user } = useAuthStore();

  if (!user) return null;

  return (
    <header className="h-16 border-b bg-card flex items-center justify-between px-6">
      <div className="font-medium text-lg">
        {user.outletName}
      </div>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5 text-muted-foreground" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500" />
        </Button>
        <div className="flex items-center gap-2">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-medium">{user.fullName}</div>
            <div className="text-xs text-muted-foreground">{user.role}</div>
          </div>
          <Avatar>
            <AvatarFallback className="bg-primary/10 text-primary">
              {user.fullName.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
