"use client";

import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { useSession } from "@/app/lib/auth-client";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isPending && session?.user) {
      const role = session.user.role || "buyer";
      
      // If admin tries to access buyer dashboard
      if (role === "admin" && pathname.startsWith("/buyer/dashboard")) {
        router.push("/admin/dashboard");
      }
      
      // If buyer tries to access admin dashboard
      if (role !== "admin" && pathname.startsWith("/admin/dashboard")) {
        router.push("/buyer/dashboard");
      }
    }
  }, [session, isPending, pathname, router]);

  if (isPending) {
    return (
      <div className="flex-1 flex bg-[#f5f0eb] dark:bg-[#111111] transition-colors min-h-screen items-center justify-center">
        <div className="w-8 h-8 border-4 border-neutral-200 border-t-neutral-800 dark:border-[#333] dark:border-t-white rounded-full animate-spin"></div>
      </div>
    );
  }

  // Prevent flash of unauthorized content before redirect happens
  if (session?.user) {
    const role = session.user.role || "buyer";
    if (role === "admin" && pathname.startsWith("/buyer/dashboard")) return null;
    if (role !== "admin" && pathname.startsWith("/admin/dashboard")) return null;
  }

  return (
    <div className="flex-1 flex bg-[#f5f0eb] dark:bg-[#111111] transition-colors min-h-screen">
      <div className="w-full max-w-full mx-auto p-4 lg:p-6 lg:px-10 flex flex-col lg:flex-row gap-4 lg:gap-6">
        <DashboardSidebar />
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
