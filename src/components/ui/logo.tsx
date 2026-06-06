import * as React from "react"
import { cn } from "@/lib/utils"

export function Logo({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex items-center select-none font-black tracking-tight", className)} {...props}>
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-900 via-indigo-600 to-violet-600 dark:from-white dark:via-indigo-400 dark:to-violet-400">
        kcpl
      </span>
    </div>
  )
}