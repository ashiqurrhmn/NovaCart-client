"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, ShoppingBag, LogOut, Menu, X, LayoutDashboard, Users, PlusCircle, Package, CreditCard, Sparkles } from "lucide-react";
import { signOut, useSession } from "@/app/lib/auth-client";
import { useRouter } from "next/navigation";

const buyerSidebarItems = [
  { label: "Dashboard", href: "/buyer/dashboard", icon: LayoutDashboard, exact: true },
  { label: "Profile", href: "/buyer/dashboard/profile", icon: User },
  { label: "Order History", href: "/buyer/dashboard/orders", icon: ShoppingBag },
];

const adminSidebarItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard, exact: true },
  { label: "Manage Orders", href: "/admin/dashboard/orders", icon: ShoppingBag },
  { label: "Manage Users", href: "/admin/dashboard/users", icon: Users },
  { label: "Add Product", href: "/admin/dashboard/add-product", icon: PlusCircle },
  { label: "Manage Products", href: "/admin/dashboard/products", icon: Package },
  { label: "Payment History", href: "/admin/dashboard/payments", icon: CreditCard },
  { label: "AI Content", href: "/admin/dashboard/ai-content", icon: Sparkles },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();
  const user = session?.user;

  const isAdmin = pathname.startsWith("/admin");
  const currentSidebarItems = isAdmin ? adminSidebarItems : buyerSidebarItems;
  const accountType = isAdmin ? "Admin Account" : "Buyer Account";

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  return (
    <aside className="w-full lg:w-[260px] shrink-0 bg-[#1a1a1a] dark:bg-[#0a0a0a] rounded-2xl p-5 lg:p-6 flex flex-col justify-between min-h-0 lg:min-h-[calc(100vh-48px)] lg:sticky lg:top-6 lg:self-start transition-colors">
      {/* Top Header (Logo + Mobile Menu Toggle) */}
      <div className="flex items-center justify-between lg:block mb-0 lg:mb-8">
        <div className="flex flex-col gap-8">
          <Link href="/" className="text-white text-lg font-bold tracking-[0.08em] uppercase">
            NOVACART
          </Link>

          {/* User Profile Info (Desktop only here, Mobile can see it in dropdown if needed or just skip to save space) */}
          {user && (
            <div className="hidden lg:flex items-center gap-3">
              {user.image ? (
                <img src={user.image} alt={user.name || "User"} className="w-10 h-10 rounded-full object-cover shrink-0" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center text-white font-medium shrink-0">
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </div>
              )}
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-semibold text-white truncate">{user.name}</span>
                <span className="text-[11px] text-neutral-400 truncate text-ellipsis">{accountType}</span>
              </div>
            </div>
          )}
        </div>
        
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden p-2 text-neutral-400 hover:text-white transition-colors"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Navigation & Sign Out (Collapsible on Mobile) */}
      <div className={`flex-1 flex flex-col justify-between overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[600px] opacity-100 mt-6' : 'max-h-0 opacity-0 lg:max-h-[1000px] lg:opacity-100 lg:mt-0'}`}>
        {/* Navigation */}
        <nav className="flex flex-col gap-1">
          {/* User Profile Info for Mobile */}
          {user && (
            <div className="lg:hidden flex items-center gap-3 mb-6 px-3">
              {user.image ? (
                <img src={user.image} alt={user.name || "User"} className="w-10 h-10 rounded-full object-cover shrink-0" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center text-white font-medium shrink-0">
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </div>
              )}
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-semibold text-white truncate">{user.name}</span>
                <span className="text-[11px] text-neutral-400 truncate">{accountType}</span>
              </div>
            </div>
          )}

          <p className="hidden lg:block text-[10px] font-semibold tracking-[0.2em] uppercase text-neutral-500 mb-3 px-3">
            NAVIGATION
          </p>
          {currentSidebarItems.map((item) => {
            const isActive = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-colors ${
                  isActive
                    ? "bg-white/10 text-white"
                    : "text-neutral-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <item.icon className="w-[18px] h-[18px]" strokeWidth={1.5} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Sign out */}
        <div className="pt-6 mt-6 lg:mt-0 border-t border-white/10">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium text-neutral-400 hover:text-white hover:bg-white/5 transition-colors w-full cursor-pointer"
          >
            <LogOut className="w-[18px] h-[18px]" strokeWidth={1.5} />
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
}

