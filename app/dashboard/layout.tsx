"use client";

import { DashboardSidebar } from "@/components/dashboard-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1 flex bg-[#f5f0eb] dark:bg-[#111111] transition-colors min-h-screen">
      <div className="w-full max-w-full mx-auto p-4 lg:p-6 lg:px-10 flex flex-col lg:flex-row gap-4 lg:gap-6">
        <DashboardSidebar />
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
