"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./navbar";

export function ConditionalNavbar() {
  const pathname = usePathname();
  
  // Hide navbar on auth and dashboard pages
  if (pathname === "/login" || pathname === "/signup" || pathname.startsWith("/buyer/dashboard") || pathname.startsWith("/admin/dashboard")) {
    return null;
  }
  
  return <Navbar />;
}
