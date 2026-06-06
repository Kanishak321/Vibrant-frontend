// "use client";

// import { useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { useAuthStore } from "@/store/useAuthStore";
// import { Sidebar } from "@/components/dashboard/Sidebar";
// import { Header } from "@/components/dashboard/Header";

// export default function DashboardLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const { isAuthenticated, user } = useAuthStore();
//   const router = useRouter();

//   // useEffect(() => {
//   //   if (!isAuthenticated || !user) {
//   //     router.push("/login");
//   //   }
//   // }, [isAuthenticated, user, router]);

//   // if (!isAuthenticated || !user) {
//   //   return null; // Or a loading spinner
//   // }

//   useEffect(() => {
//   const token = localStorage.getItem("token");

//   if (!token) {
//     router.push("/login");
//   }
// }, [router]);

//   return (
//     <div className="flex h-screen bg-muted/40">
//       <Sidebar />
//       <div className="flex-1 flex flex-col overflow-hidden">
//         <Header />
//         <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
//           {children}
//         </main>
//       </div>
//     </div>
//   );
// }

// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { Sidebar } from "@/components/dashboard/Sidebar";
// import { Header } from "@/components/dashboard/Header";

// export default function DashboardLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const router = useRouter();
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const token = localStorage.getItem("token");

//     if (!token) {
//       router.push("/login");
//       return;
//     }
//     setLoading(false);
//   }, [router]);

//   if (loading) {
//     return null;
//   }

//   return (
//     <div className="flex h-screen bg-muted/40">
//       <Sidebar />
//       <div className="flex-1 flex flex-col overflow-hidden">
//         <Header />
//         <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
//           {children}
//         </main>
//       </div>
//     </div>
//   );
// }

"use client";

import { Header } from "@/components/adminDashboard/header";
import { Sidebar } from "@/components/adminDashboard/sidebar";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1">
        <Header />
        {children}
      </div>
    </div>
  );
}