"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import { Loader2, ShieldAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const adminLoginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

export default function AdminLoginPage() {
  const router = useRouter();
  const { adminLogin } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof adminLoginSchema>>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: "admin@vibrnd.com",
      password: "password",
    },
  });

  async function onSubmit(values: z.infer<typeof adminLoginSchema>) {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (values.email === "admin@vibrnd.com" && values.password === "password") {
      adminLogin();
      toast.success("Admin login successful");
      router.push("/admin/dashboard");
    } else {
      toast.error("Invalid admin credentials.");
    }
    
    setIsLoading(false);
  }

  return (
    <div className="flex-1 flex items-center justify-center p-4 bg-zinc-950">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <Card className="border-border/10 shadow-2xl bg-zinc-900 text-zinc-100">
          <CardHeader className="space-y-1 text-center pb-8">
            <div className="mx-auto w-12 h-12 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mb-4">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <CardTitle className="text-3xl font-bold tracking-tight">Admin Portal</CardTitle>
            <CardDescription className="text-zinc-400">
              Restricted access. Authorized personnel only.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-zinc-300">Admin Email</FormLabel>
                      <FormControl>
                        <Input className="bg-zinc-800 border-zinc-700" placeholder="admin@vibrnd.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-zinc-300">Password</FormLabel>
                      <FormControl>
                        <Input className="bg-zinc-800 border-zinc-700" type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button className="w-full bg-red-600 hover:bg-red-700 text-white" type="submit" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Access Dashboard
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
