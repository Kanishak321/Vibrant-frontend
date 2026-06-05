"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { buttonVariants } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-b from-background to-secondary/20 pt-20 pb-16 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-4xl mx-auto space-y-8"
      >
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
          Complete Hospitality <br className="hidden md:block" />
          <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Operating System
          </span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Manage POS, Inventory, CRM, Billing, Analytics and Staff from a single
          platform. Built for modern enterprise hospitality.
        </p>
        <div className="flex items-center justify-center gap-4 pt-4">
          <Link href="/register" className={buttonVariants({ variant: 'default', size: 'lg', className: 'h-12 px-8 text-lg' })}>
            Register Now
          </Link>
          <Link href="/login" className={buttonVariants({ variant: 'outline', size: 'lg', className: 'h-12 px-8 text-lg' })}>
            Login
          </Link>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="mt-20 w-full max-w-6xl relative"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-10 h-32 bottom-0 top-auto" />
        <div className="rounded-xl border bg-card text-card-foreground shadow-2xl overflow-hidden ring-1 ring-white/10">
          <div className="h-12 border-b bg-muted/50 flex items-center px-4 gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <div className="mx-auto bg-background rounded-md px-3 py-1 text-xs text-muted-foreground flex items-center gap-2 border">
              vibrnd.com
            </div>
          </div>
          <div className="p-8 grid grid-cols-4 gap-6 bg-background aspect-video md:aspect-auto md:h-[600px]">
            <div className="col-span-1 border-r space-y-4 pr-6 hidden md:block">
              <div className="h-8 w-3/4 bg-muted rounded-md mb-8" />
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-10 w-full bg-muted/50 rounded-md" />
              ))}
            </div>
            <div className="col-span-4 md:col-span-3 space-y-6">
              <div className="flex justify-between items-center">
                <div className="h-8 w-48 bg-muted rounded-md" />
                <div className="h-8 w-24 bg-primary/20 rounded-md" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-32 bg-card border rounded-xl p-4 flex flex-col justify-between">
                    <div className="h-4 w-24 bg-muted rounded" />
                    <div className="h-8 w-32 bg-primary/10 rounded" />
                  </div>
                ))}
              </div>
              <div className="h-64 bg-card border rounded-xl" />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
