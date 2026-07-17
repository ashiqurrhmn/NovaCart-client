"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, User, Heart, ShoppingBag, Menu, X, LogOut } from "lucide-react";
import { useSession, signOut } from "@/app/lib/auth-client";
import { useRouter } from "next/navigation";

export function Navbar() {
  const { data } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const user = data?.user;
  const isLoggedIn = !!user;
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
          router.refresh();
        },
      },
    });
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#f5f0eb] dark:bg-[#111111] border-b border-[#e8e2db] dark:border-[#222222]">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 h-14 flex items-center justify-between">
        {/* Left nav links — desktop */}
        <nav className="hidden lg:flex items-center gap-6">
          <Link
            href="/shop/men"
            className="text-[11px] font-medium tracking-[0.15em] uppercase text-[#1a1a1a] dark:text-[#e0e0e0] hover:opacity-60 transition-opacity"
          >
            Men
          </Link>
          <Link
            href="/shop/women"
            className="text-[11px] font-medium tracking-[0.15em] uppercase text-[#1a1a1a] dark:text-[#e0e0e0] hover:opacity-60 transition-opacity"
          >
            Women
          </Link>
          <Link
            href="/shop/kids"
            className="text-[11px] font-medium tracking-[0.15em] uppercase text-[#1a1a1a] dark:text-[#e0e0e0] hover:opacity-60 transition-opacity"
          >
            Kids
          </Link>
          <Link
            href="/shop/beauty"
            className="text-[11px] font-medium tracking-[0.15em] uppercase text-[#1a1a1a] dark:text-[#e0e0e0] hover:opacity-60 transition-opacity"
          >
            Beauty
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden p-1 text-[#1a1a1a] dark:text-[#e0e0e0]"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Menu"
        >
          {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Center logo */}
        <Link
          href="/"
          className="absolute left-1/2 -translate-x-1/2 text-[22px] sm:text-[26px] font-bold tracking-[0.12em] uppercase text-[#1a1a1a] dark:text-[#f0f0f0] select-none"
        >
          NOVACART
        </Link>

        {/* Right icons — desktop */}
        <div className="hidden lg:flex items-center gap-5">
          <button className="flex items-center gap-1.5 text-[11px] font-medium tracking-[0.12em] uppercase text-[#1a1a1a] dark:text-[#e0e0e0] hover:opacity-60 transition-opacity">
            <Search className="w-[14px] h-[14px]" />
            Search
          </button>

          {isLoggedIn ? (
            <>
              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 text-[11px] font-medium tracking-[0.12em] uppercase text-[#1a1a1a] dark:text-[#e0e0e0] hover:opacity-60 transition-opacity"
              >
                <User className="w-[14px] h-[14px]" />
                {user.name?.split(" ")[0]}
              </Link>
              <Link
                href="/wishlist"
                className="flex items-center gap-1.5 text-[11px] font-medium tracking-[0.12em] uppercase text-[#1a1a1a] dark:text-[#e0e0e0] hover:opacity-60 transition-opacity"
              >
                <Heart className="w-[14px] h-[14px]" />
                Wishlist
              </Link>
              <Link
                href="/cart"
                className="flex items-center gap-1.5 text-[11px] font-medium tracking-[0.12em] uppercase text-[#1a1a1a] dark:text-[#e0e0e0] hover:opacity-60 transition-opacity"
              >
                <ShoppingBag className="w-[14px] h-[14px]" />
                Cart (0)
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-[11px] font-medium tracking-[0.12em] uppercase text-red-600 dark:text-red-400 hover:opacity-60 transition-opacity"
              >
                <LogOut className="w-[14px] h-[14px]" />
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="flex items-center gap-1.5 text-[11px] font-medium tracking-[0.12em] uppercase text-[#1a1a1a] dark:text-[#e0e0e0] hover:opacity-60 transition-opacity"
              >
                <User className="w-[14px] h-[14px]" />
                Login
              </Link>
              <Link
                href="/wishlist"
                className="flex items-center gap-1.5 text-[11px] font-medium tracking-[0.12em] uppercase text-[#1a1a1a] dark:text-[#e0e0e0] hover:opacity-60 transition-opacity"
              >
                <Heart className="w-[14px] h-[14px]" />
                Wishlist
              </Link>
              <Link
                href="/cart"
                className="flex items-center gap-1.5 text-[11px] font-medium tracking-[0.12em] uppercase text-[#1a1a1a] dark:text-[#e0e0e0] hover:opacity-60 transition-opacity"
              >
                <ShoppingBag className="w-[14px] h-[14px]" />
                Cart (0)
              </Link>
            </>
          )}
        </div>

        {/* Mobile right icons */}
        <div className="flex lg:hidden items-center gap-3">
          <button aria-label="Search" className="text-[#1a1a1a] dark:text-[#e0e0e0]">
            <Search className="w-[18px] h-[18px]" />
          </button>
          <Link href="/cart" aria-label="Cart" className="text-[#1a1a1a] dark:text-[#e0e0e0]">
            <ShoppingBag className="w-[18px] h-[18px]" />
          </Link>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ${
          isMenuOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-6 py-5 bg-[#f5f0eb] dark:bg-[#111111] border-t border-[#e8e2db] dark:border-[#222222] space-y-1">
          {["Men", "Women", "Kids", "Beauty"].map((item) => (
            <Link
              key={item}
              href={`/shop/${item.toLowerCase()}`}
              className="block py-2.5 text-[12px] font-medium tracking-[0.15em] uppercase text-[#1a1a1a] dark:text-[#e0e0e0] hover:opacity-60 transition-opacity"
              onClick={() => setIsMenuOpen(false)}
            >
              {item}
            </Link>
          ))}
          <div className="pt-3 mt-2 border-t border-[#e8e2db] dark:border-[#222222] space-y-1">
            {isLoggedIn ? (
              <>
                <div className="py-2 text-[12px] font-medium tracking-[0.1em] uppercase text-[#1a1a1a] dark:text-[#e0e0e0]">
                  {user.name}
                </div>
                <button
                  onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                  className="block py-2 text-[12px] font-medium tracking-[0.1em] uppercase text-red-600 dark:text-red-400"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="block py-2.5 text-[12px] font-medium tracking-[0.15em] uppercase text-[#1a1a1a] dark:text-[#e0e0e0]"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
