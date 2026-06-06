// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";
// import { motion } from "framer-motion";
// import { useAuthStore } from "@/store/useAuthStore";
// import { toast } from "sonner";
// import { Loader2, ShieldAlert } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";

// const adminLoginSchema = z.object({
//   email: z.string().email({ message: "Invalid Login ID" }),
//   password: z.string().min(6, { message: "Password must be at least 6 characters" }),
// });

// export default function AdminLoginPage() {
//   const router = useRouter();
//   const { adminLogin } = useAuthStore();
//   const [isLoading, setIsLoading] = useState(false);

//   const form = useForm<z.infer<typeof adminLoginSchema>>({
//     resolver: zodResolver(adminLoginSchema),
//     defaultValues: {
//       email: "admin@kcpl.com",
//       password: "password",
//     },
//   });

//   async function onSubmit(values: z.infer<typeof adminLoginSchema>) {
//     setIsLoading(true);
//     await new Promise((resolve) => setTimeout(resolve, 800));

//     if (values.email === "admin@kcpl.com" && values.password === "password") {
//       adminLogin();
//       toast.success("Admin login successful");
//       router.push("/admin/dashboard");
//     } else {
//       toast.error("Invalid admin credentials.");
//     }

//     setIsLoading(false);
//   }

//   return (
//     <div className="flex-1 flex items-center justify-center p-4 bg-zinc-950">
//       <motion.div
//         initial={{ opacity: 0, scale: 0.95 }}
//         animate={{ opacity: 1, scale: 1 }}
//         transition={{ duration: 0.3 }}
//         className="w-full max-w-md"
//       >
//         <Card className="border-border/10 shadow-2xl bg-zinc-900 text-zinc-100">
//           <CardHeader className="space-y-1 text-center pb-8">
//             <div className="mx-auto w-12 h-12 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mb-4">
//               <ShieldAlert className="w-6 h-6" />
//             </div>
//             <CardTitle className="text-3xl font-bold tracking-tight">Admin Portal</CardTitle>
//             <CardDescription className="text-zinc-400">
//               Restricted access. Authorized personnel only.
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <Form {...form}>
//               <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//                 <FormField
//                   control={form.control}
//                   name="email"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel className="text-zinc-300">Admin Email</FormLabel>
//                       <FormControl>
//                         <Input className="bg-zinc-800 border-zinc-700" placeholder="admin@kcpl.com" {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name="password"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel className="text-zinc-300">Password</FormLabel>
//                       <FormControl>
//                         <Input className="bg-zinc-800 border-zinc-700" type="password" placeholder="••••••••" {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//                 <Button className="w-full bg-red-600 hover:bg-red-700 text-white" type="submit" disabled={isLoading}>
//                   {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//                   Access Dashboard
//                 </Button>
//               </form>
//             </Form>
//           </CardContent>
//         </Card>
//       </motion.div>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import { Loader2, ShieldAlert, Eye, EyeOff, Lock } from "lucide-react";

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

// const adminLoginSchema = z.object({
//   email: z.string().email({ message: "Invalid Login ID" }),
//   password: z
//     .string()
//     .min(6, { message: "Password must be at least 6 characters" }),
// });

const adminLoginSchema = z.object({
  email: z.string().min(1, {
    message: "Login ID is required"
  }),
  password: z.string().min(1, {
    message: "Password is required"
  }),
});

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

// const itemVariants = {
//   hidden: { opacity: 0, y: 14 },
//   visible: {
//     opacity: 1,
//     y: 0,
//     transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] },
//   },
// };

export default function AdminLoginPage() {
  const router = useRouter();
  const { adminLogin } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof adminLoginSchema>>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // async function onSubmit(values: z.infer<typeof adminLoginSchema>) {
  //   setIsLoading(true);
  //   await new Promise((resolve) => setTimeout(resolve, 800));

  //   if (
  //     values.email === "admin@kcpl.com" &&
  //     values.password === "password"
  //   ) {
  //     adminLogin();
  //     toast.success("Admin login successful");
  //     router.push("/admin/dashboard");
  //   } else {
  //     toast.error("Invalid admin credentials.");
  //   }

  //   setIsLoading(false);
  // }

  async function onSubmit(values: z.infer<typeof adminLoginSchema>) {
    try {
      setIsLoading(true);

      const response = await fetch(
        "http://localhost:8080/api/v1/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            login: values.email,
            password: values.password,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        toast.error(
          result?.error?.message || "Login failed"
        );
        return;
      }

      const token = result.data.accessToken;
      const user = result.data.user;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      const backendUser = {
        id: user.id,
        fullName: user.name,
        email: values.email,
        mobile: "",
        outletName: "",
        outletAddress: "",
        role: "Admin" as const,
        status: "Approved" as const,
        createdAt: new Date().toISOString(),
      };

      adminLogin(backendUser);

      toast.success("Login successful");

      if (user.roles.includes("OWNER")) {
        router.push("/admin/dashboard");
      } else {
        toast.error("Only administrators can access this portal");
        return;
      }

    } catch (error) {
      toast.error("Server error");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen w-full items-stretch overflow-hidden bg-[#f5f4f1]">

      {/* ── Left decorative panel (hidden on mobile) ── */}
      <div className="hidden lg:flex lg:w-[42%] xl:w-[45%] relative flex-col items-start justify-between bg-[#1a1a1a] px-12 py-14 overflow-hidden">
        {/* Texture overlay */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, rgba(220,38,38,0.12) 0%, transparent 60%), radial-gradient(circle at 80% 10%, rgba(220,38,38,0.07) 0%, transparent 50%)",
          }}
        />
        {/* Fine dot grid */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* Wordmark */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 flex items-center gap-3"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-600 shadow-[0_4px_14px_rgba(220,38,38,0.4)]">
            <ShieldAlert className="h-[18px] w-[18px] text-white" strokeWidth={2} />
          </div>
          <span className="text-sm font-semibold tracking-[0.18em] uppercase text-white/80">
            kcpl
          </span>
        </motion.div>

        {/* Center copy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 max-w-xs"
        >
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-red-500">
            Administrative Access
          </p>
          <h2 className="text-4xl font-bold leading-[1.15] tracking-[-0.03em] text-white">
            Secure Control<br />Centre
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-white/40">
            This portal is reserved for authorised administrators. All sessions are encrypted, logged, and monitored in real time.
          </p>
        </motion.div>

        {/* Bottom legal line */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="relative z-10 text-[11px] text-white/20"
        >
          © {new Date().getFullYear()} kcpl. All rights reserved.
        </motion.p>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex flex-1 items-center justify-center px-5 py-12 sm:px-10">
        {/* Subtle warm noise texture on right bg */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 lg:left-[42%] xl:left-[45%]"
          style={{
            backgroundImage:
              "radial-gradient(ellipse at 70% 30%, rgba(220,38,38,0.05) 0%, transparent 55%)",
          }}
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 w-full max-w-[420px]"
        >
          {/* Mobile-only logo */}
          <motion.div
            // variants={itemVariants}
            className="mb-10 flex items-center gap-2.5 lg:hidden"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-600 shadow-[0_4px_12px_rgba(220,38,38,0.35)]">
              <ShieldAlert className="h-4 w-4 text-white" strokeWidth={2} />
            </div>
            <span className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-700">
              kcpl
            </span>
          </motion.div>

          {/* Heading */}
          <motion.div
            // variants={itemVariants} 
            className="mb-9">
            <h1 className="text-[2rem] font-bold tracking-[-0.03em] text-zinc-900">
              Admin Portal
            </h1>
            <p className="mt-1.5 text-sm text-zinc-500">
              Sign in with your administrator credentials to continue.
            </p>
          </motion.div>

          {/* Card */}
          <motion.div
            // variants={itemVariants}
            className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-[0_8px_40px_-8px_rgba(0,0,0,0.12),0_2px_8px_-2px_rgba(0,0,0,0.06)]"
          >
            {/* Top accent bar */}
            <div className="h-1 w-full bg-gradient-to-r from-red-600 via-red-500 to-red-600" />

            <div className="px-7 py-8 sm:px-8">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-5"
                >
                  {/* Email */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="space-y-1.5">
                        <FormLabel className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-400">
                          Login ID
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="admin@kcpl.com"
                            autoComplete="email"
                            className="h-11 rounded-xl border-zinc-200 bg-zinc-50 px-4 text-sm text-zinc-900 placeholder:text-zinc-400 transition-colors duration-150 focus-visible:border-red-400 focus-visible:bg-white focus-visible:ring-0 focus-visible:ring-offset-0 hover:border-zinc-300"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs text-red-500" />
                      </FormItem>
                    )}
                  />

                  {/* Password */}
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="space-y-1.5">
                        <FormLabel className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-400">
                          Password
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="••••••••"
                              autoComplete="current-password"
                              className="h-11 rounded-xl border-zinc-200 bg-zinc-50 px-4 pr-11 text-sm text-zinc-900 placeholder:text-zinc-400 transition-colors duration-150 focus-visible:border-red-400 focus-visible:bg-white focus-visible:ring-0 focus-visible:ring-offset-0 hover:border-zinc-300"
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword((p) => !p)}
                              aria-label={showPassword ? "Hide password" : "Show password"}
                              tabIndex={-1}
                              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 transition-colors hover:text-zinc-600 focus:outline-none"
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage className="text-xs text-red-500" />
                      </FormItem>
                    )}
                  />

                  {/* Divider */}
                  <div className="h-px bg-zinc-100" />

                  {/* Submit */}
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="h-11 w-full rounded-xl bg-red-600 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(220,38,38,0.22)] transition-all duration-200 hover:bg-red-700 hover:shadow-[0_6px_20px_rgba(220,38,38,0.30)] active:scale-[0.985] disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Authenticating…
                      </>
                    ) : (
                      <>
                        <Lock className="mr-2 h-3.5 w-3.5 opacity-80" />
                        Access Dashboard
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </div>

            {/* Card footer */}
            <div className="border-t border-zinc-100 bg-zinc-50/80 px-7 py-3.5 sm:px-8">
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_4px_rgba(16,185,129,0.6)]" />
                <p className="text-[11px] text-zinc-400">
                  Secured connection · Sessions logged & monitored
                </p>
              </div>
            </div>
          </motion.div>

          {/* Below-card note */}
          <motion.p
            // variants={itemVariants}
            className="mt-6 text-center text-[11px] leading-relaxed text-zinc-400"
          >
            Trouble accessing your account?{" "}
            <span className="font-medium text-zinc-600 underline underline-offset-2 cursor-pointer">
              Contact IT Support
            </span>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}