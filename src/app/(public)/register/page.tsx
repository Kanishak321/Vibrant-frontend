// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";
// import { motion, AnimatePresence } from "framer-motion";
// import { useAuthStore, Role } from "@/store/useAuthStore";
// import { toast } from "sonner";
// import { Loader2, Users, Banknote, Utensils, PackageSearch, ShieldCheck, Check } from "lucide-react";

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
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { cn } from "@/lib/utils";

// const roles = [
//   { id: "Manager", icon: Users, title: "Manager", desc: "Manage outlet operations and staff." },
//   { id: "Cashier", icon: Banknote, title: "Cashier", desc: "Handle billing and payment operations." },
//   { id: "Captain", icon: Utensils, title: "Captain", desc: "Manage table orders and service." },
//   { id: "Inventory Manager", icon: PackageSearch, title: "Inventory Manager", desc: "Manage stock and inventory." },
//   { id: "Auditor", icon: ShieldCheck, title: "Auditor", desc: "Monitor audits and reports." },
// ] as const;

// const registerSchema = z.object({
//   fullName: z.string().min(2, "Full Name is required"),
//   email: z.string().email("Invalid email address"),
//   mobile: z.string().min(10, "Invalid mobile number"),
//   password: z.string().min(6, "Password must be at least 6 characters"),
//   confirmPassword: z.string(),
//   outletName: z.string().min(2, "Outlet Name is required"),
//   outletAddress: z.string().min(5, "Outlet Address is required"),
//   role: z.enum(["Manager", "Cashier", "Captain", "Inventory Manager", "Auditor"], {
//     required_error: "Please select a role",
//   }),
// }).refine((data) => data.password === data.confirmPassword, {
//   message: "Passwords don't match",
//   path: ["confirmPassword"],
// });

// export default function RegisterPage() {
//   const router = useRouter();
//   const { registerUser } = useAuthStore();
//   const [isLoading, setIsLoading] = useState(false);
//   const [isSuccess, setIsSuccess] = useState(false);

//   const form = useForm<z.infer<typeof registerSchema>>({
//     resolver: zodResolver(registerSchema),
//     defaultValues: {
//       fullName: "",
//       email: "",
//       mobile: "",
//       password: "",
//       confirmPassword: "",
//       outletName: "",
//       outletAddress: "",
//     },
//   });

//   async function onSubmit(values: z.infer<typeof registerSchema>) {
//     setIsLoading(true);
//     // Simulate network delay
//     await new Promise((resolve) => setTimeout(resolve, 1500));
    
//     registerUser({
//       fullName: values.fullName,
//       email: values.email,
//       mobile: values.mobile,
//       outletName: values.outletName,
//       outletAddress: values.outletAddress,
//       role: values.role as Role,
//     });

//     setIsLoading(false);
//     setIsSuccess(true);
//     toast.success("Registration submitted successfully");

//     // Redirect after a short delay
//     setTimeout(() => {
//       router.push("/login");
//     }, 4000);
//   }

//   if (isSuccess) {
//     return (
//       <div className="flex-1 flex items-center justify-center p-4">
//         <motion.div
//           initial={{ opacity: 0, scale: 0.95 }}
//           animate={{ opacity: 1, scale: 1 }}
//           className="w-full max-w-md text-center space-y-6"
//         >
//           <div className="mx-auto w-24 h-24 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-6">
//             <Check className="w-12 h-12" />
//           </div>
//           <h2 className="text-3xl font-bold">Request Submitted!</h2>
//           <p className="text-muted-foreground text-lg">
//             Your registration request has been submitted successfully. Please wait for admin approval.
//           </p>
//           <p className="text-sm text-muted-foreground animate-pulse">
//             Redirecting to login...
//           </p>
//         </motion.div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex-1 flex flex-col items-center py-10 px-4">
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.4 }}
//         className="w-full max-w-4xl"
//       >
//         <Card className="border-border/50 shadow-xl backdrop-blur-sm bg-card/90">
//           <CardHeader className="space-y-1 text-center">
//             <CardTitle className="text-3xl font-bold tracking-tight">Create an Account</CardTitle>
//             <CardDescription>
//               Join kcpl Hospitality Platform and manage your outlet efficiently.
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <Form {...form}>
//               <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                
//                 <div className="space-y-4">
//                   <h3 className="text-lg font-medium">1. Select your role</h3>
//                   <FormField
//                     control={form.control}
//                     name="role"
//                     render={({ field }) => (
//                       <FormItem>
//                         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                           {roles.map((r) => {
//                             const Icon = r.icon;
//                             const isSelected = field.value === r.id;
//                             return (
//                               <Card
//                                 key={r.id}
//                                 className={cn(
//                                   "cursor-pointer transition-all hover:border-primary/50 relative overflow-hidden",
//                                   isSelected ? "border-primary ring-1 ring-primary" : "border-border"
//                                 )}
//                                 onClick={() => field.onChange(r.id)}
//                               >
//                                 {isSelected && (
//                                   <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary" />
//                                 )}
//                                 <CardContent className="p-4 flex flex-col items-center text-center space-y-2">
//                                   <div className={cn(
//                                     "p-3 rounded-full mb-2",
//                                     isSelected ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
//                                   )}>
//                                     <Icon className="w-6 h-6" />
//                                   </div>
//                                   <div className="font-semibold">{r.title}</div>
//                                   <div className="text-xs text-muted-foreground">{r.desc}</div>
//                                 </CardContent>
//                               </Card>
//                             )
//                           })}
//                         </div>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />
//                 </div>

//                 <div className="space-y-4">
//                   <h3 className="text-lg font-medium">2. Personal Information</h3>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <FormField
//                       control={form.control}
//                       name="fullName"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Full Name</FormLabel>
//                           <FormControl>
//                             <Input placeholder="John Doe" {...field} />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />
//                     <FormField
//                       control={form.control}
//                       name="email"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Email</FormLabel>
//                           <FormControl>
//                             <Input placeholder="m@example.com" {...field} />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />
//                     <FormField
//                       control={form.control}
//                       name="mobile"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Mobile Number</FormLabel>
//                           <FormControl>
//                             <Input placeholder="+1 234 567 8900" {...field} />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />
//                   </div>
//                 </div>

//                 <div className="space-y-4">
//                   <h3 className="text-lg font-medium">3. Security</h3>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <FormField
//                       control={form.control}
//                       name="password"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Password</FormLabel>
//                           <FormControl>
//                             <Input type="password" placeholder="••••••••" {...field} />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />
//                     <FormField
//                       control={form.control}
//                       name="confirmPassword"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Confirm Password</FormLabel>
//                           <FormControl>
//                             <Input type="password" placeholder="••••••••" {...field} />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />
//                   </div>
//                 </div>

//                 <div className="space-y-4">
//                   <h3 className="text-lg font-medium">4. Outlet Details</h3>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <FormField
//                       control={form.control}
//                       name="outletName"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Outlet Name</FormLabel>
//                           <FormControl>
//                             <Input placeholder="kcpl Cafe" {...field} />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />
//                     <FormField
//                       control={form.control}
//                       name="outletAddress"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Outlet Address</FormLabel>
//                           <FormControl>
//                             <Input placeholder="123 Main St, City" {...field} />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />
//                   </div>
//                 </div>

//                 <Button className="w-full h-12 text-lg" type="submit" disabled={isLoading}>
//                   {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
//                   Submit Registration Request
//                 </Button>
//               </form>
//             </Form>
//           </CardContent>
//           <CardFooter className="flex justify-center border-t p-6 mt-4">
//             <div className="text-sm text-muted-foreground">
//               Already have an account?{" "}
//               <Link href="/login" className="text-primary hover:underline font-medium">
//                 Login here
//               </Link>
//             </div>
//           </CardFooter>
//         </Card>
//       </motion.div>
//     </div>
//   );
// }
