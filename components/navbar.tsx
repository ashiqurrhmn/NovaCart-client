"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, User, Heart, ShoppingBag, Menu, X, LogOut } from "lucide-react";
import { useSession, signOut } from "@/app/lib/auth-client";
import { useRouter, usePathname } from "next/navigation";
import { useCart } from "@/app/context/cart-context";
import { useWishlist } from "@/app/context/wishlist-context";
import { ThemeToggle } from "@/components/theme-toggle";

export function Navbar() {
  const { data } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const user = data?.user;
  const isLoggedIn = !!user;
  const router = useRouter();
  const pathname = usePathname();
  const { totalItems } = useCart();
  const { totalItems: wishlistTotal } = useWishlist();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setIsMobileSearchOpen(false);
      setSearchQuery("");
    }
  };

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
    <header className="sticky top-4 z-50 w-[95%] max-w-[1440px] mx-auto bg-white/80 dark:bg-[#111111]/80 backdrop-blur-xl border border-neutral-200/50 dark:border-neutral-800/50 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] transition-all duration-300">
      <div className="px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left nav links — desktop */}
        <nav className="hidden lg:flex items-center gap-6">
          <Link href="/" className={`text-[12px] font-bold tracking-[0.15em] uppercase text-[#1a1a1a] dark:text-[#e0e0e0] hover:text-neutral-500 transition-colors ${pathname === "/" ? "underline underline-offset-4" : ""}`}>
            Home
          </Link>
          <Link href="/shop" className={`text-[12px] font-bold tracking-[0.15em] uppercase text-[#1a1a1a] dark:text-[#e0e0e0] hover:text-neutral-500 transition-colors ${pathname === "/shop" ? "underline underline-offset-4" : ""}`}>
            Shop
          </Link>
          <div className="group relative">
            <button className="text-[12px] font-bold tracking-[0.15em] uppercase text-[#1a1a1a] dark:text-[#e0e0e0] hover:text-neutral-500 transition-colors flex items-center gap-1">
              Categories
            </button>
            <div className="absolute top-full left-0 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <div className="bg-white dark:bg-[#1a1a1a] border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl flex flex-col p-2 w-40">
                <Link href="/shop?category=men's%20clothing" className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-[#222] rounded-lg transition-colors">Men</Link>
                <Link href="/shop?category=women's%20clothing" className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-[#222] rounded-lg transition-colors">Women</Link>
                <Link href="/shop?category=kids'%20clothing" className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-[#222] rounded-lg transition-colors">Kids</Link>
              </div>
            </div>
          </div>
          <Link href="/about" className={`text-[12px] font-bold tracking-[0.15em] uppercase text-[#1a1a1a] dark:text-[#e0e0e0] hover:text-neutral-500 transition-colors ${pathname === "/about" ? "underline underline-offset-4" : ""}`}>
            About
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
          className="absolute left-1/2 -translate-x-1/2 text-[20px] sm:text-[22px] font-black tracking-[0.1em] uppercase text-[#1a1a1a] dark:text-[#f0f0f0] select-none"
        >
          NOVACART
        </Link>

        {/* Right icons */}
        <div className="flex items-center gap-4 sm:gap-5">
          {isSearchOpen ? (
            <form onSubmit={handleSearch} className="hidden sm:flex items-center gap-2 bg-neutral-100 dark:bg-[#222] border border-neutral-200 dark:border-[#333] rounded-full px-3 py-1.5 w-48 transition-all">
              <Search className="w-[12px] h-[12px] text-neutral-500" />
              <input
                type="text"
                autoFocus
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onBlur={() => !searchQuery && setIsSearchOpen(false)}
                className="bg-transparent text-[11px] font-medium uppercase outline-none w-full placeholder:text-neutral-500 text-[#1a1a1a] dark:text-[#e0e0e0]"
              />
            </form>
          ) : (
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="hidden sm:flex items-center text-[#1a1a1a] dark:text-[#e0e0e0] hover:opacity-60 transition-opacity"
            >
              <Search className="w-[18px] h-[18px]" />
            </button>
          )}

          {/* Mobile search toggle */}
          <button 
            className="sm:hidden text-[#1a1a1a] dark:text-[#e0e0e0] hover:opacity-60 transition-opacity"
            onClick={() => setIsMobileSearchOpen(true)}
            aria-label="Search"
          >
            <Search className="w-[18px] h-[18px]" />
          </button>

          <Link
            href="/wishlist"
            className="hidden sm:flex items-center text-[#1a1a1a] dark:text-[#e0e0e0] hover:opacity-60 transition-opacity relative"
          >
            <Heart className="w-[18px] h-[18px]" />
            {wishlistTotal > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-neutral-900 dark:bg-white text-white dark:text-black text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {wishlistTotal}
              </span>
            )}
          </Link>
          
          <Link
            href="/cart"
            className="flex items-center text-[#1a1a1a] dark:text-[#e0e0e0] hover:opacity-60 transition-opacity relative"
          >
            <ShoppingBag className="w-[18px] h-[18px]" />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-neutral-900 dark:bg-white text-white dark:text-black text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>

          {isLoggedIn ? (
            <div className="hidden lg:flex items-center gap-4 pl-4 border-l border-neutral-200 dark:border-neutral-800">
              <Link
                href={user.role === "admin" ? "/admin/dashboard" : "/buyer/dashboard"}
                className="flex items-center text-[#1a1a1a] dark:text-[#e0e0e0] hover:opacity-60 transition-opacity"
              >
                <User className="w-[18px] h-[18px]" />
              </Link>
              <ThemeToggle showText={false} className="flex items-center text-[#1a1a1a] dark:text-[#e0e0e0] hover:opacity-60 transition-opacity" />
              <button
                onClick={handleLogout}
                className="flex items-center text-red-600 dark:text-red-400 hover:opacity-60 transition-opacity"
              >
                <LogOut className="w-[18px] h-[18px]" />
              </button>
            </div>
          ) : (
            <div className="hidden lg:flex items-center gap-4 pl-4 border-l border-neutral-200 dark:border-neutral-800">
              <Link
                href="/login"
                className="text-[12px] font-bold tracking-[0.15em] uppercase text-[#1a1a1a] dark:text-[#e0e0e0] hover:text-neutral-500 transition-colors"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="text-[12px] font-bold tracking-[0.15em] uppercase bg-[#1a1a1a] dark:bg-white text-white dark:text-[#1a1a1a] px-4 py-2 rounded-full hover:opacity-80 transition-opacity"
              >
                Sign Up
              </Link>
              <ThemeToggle showText={false} className="flex items-center text-[#1a1a1a] dark:text-[#e0e0e0] hover:opacity-60 transition-opacity" />
            </div>
          )}
        </div>
      </div>

      {/* Mobile Search Overlay */}
      {isMobileSearchOpen && (
        <div className="absolute inset-0 z-50 bg-white dark:bg-[#111111] rounded-full px-4 flex items-center justify-between animate-in fade-in zoom-in-95 duration-200">
          <form onSubmit={handleSearch} className="flex-1 flex items-center gap-2">
            <Search className="w-5 h-5 text-neutral-500" />
            <input
              type="text"
              autoFocus
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent outline-none text-sm font-medium uppercase w-full text-[#1a1a1a] dark:text-white"
            />
          </form>
          <button 
            onClick={() => setIsMobileSearchOpen(false)} 
            className="ml-3 p-2 text-neutral-600 dark:text-neutral-400"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      )}

      {/* Mobile menu dropdown */}
      <div
        className={`lg:hidden absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#111111] border border-neutral-200 dark:border-neutral-800 rounded-3xl overflow-hidden transition-all duration-300 shadow-xl ${
          isMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0 border-transparent shadow-none"
        }`}
      >
        <div className="px-6 py-6 flex flex-col gap-1">
          <Link href="/" className="py-3 text-[13px] font-bold tracking-[0.15em] uppercase text-[#1a1a1a] dark:text-[#e0e0e0]" onClick={() => setIsMenuOpen(false)}>Home</Link>
          <Link href="/shop" className="py-3 text-[13px] font-bold tracking-[0.15em] uppercase text-[#1a1a1a] dark:text-[#e0e0e0]" onClick={() => setIsMenuOpen(false)}>Shop</Link>
          <Link href="/shop?category=men's%20clothing" className="py-3 text-[13px] font-bold tracking-[0.15em] uppercase text-[#1a1a1a] dark:text-[#e0e0e0]" onClick={() => setIsMenuOpen(false)}>Men's Collection</Link>
          <Link href="/shop?category=women's%20clothing" className="py-3 text-[13px] font-bold tracking-[0.15em] uppercase text-[#1a1a1a] dark:text-[#e0e0e0]" onClick={() => setIsMenuOpen(false)}>Women's Collection</Link>
          <Link href="/shop?category=kids'%20clothing" className="py-3 text-[13px] font-bold tracking-[0.15em] uppercase text-[#1a1a1a] dark:text-[#e0e0e0]" onClick={() => setIsMenuOpen(false)}>Kids' Collection</Link>
          
          <div className="pt-4 mt-2 border-t border-neutral-100 dark:border-neutral-800 flex justify-between items-center">
            <ThemeToggle className="flex items-center gap-2 py-2 text-[12px] font-bold tracking-[0.15em] uppercase text-[#1a1a1a] dark:text-[#e0e0e0]" iconClassName="w-[16px] h-[16px]" />
            <Link href="/wishlist" className="flex items-center gap-2 py-2 text-[12px] font-bold tracking-[0.15em] uppercase text-[#1a1a1a] dark:text-[#e0e0e0]" onClick={() => setIsMenuOpen(false)}>
              <Heart className="w-4 h-4" /> Wishlist
            </Link>
          </div>
          
          <div className="pt-4 mt-2 border-t border-neutral-100 dark:border-neutral-800">
            {isLoggedIn ? (
              <div className="flex flex-col gap-2">
                <Link href={user.role === "admin" ? "/admin/dashboard" : "/buyer/dashboard"} className="py-2 text-[12px] font-bold tracking-[0.1em] uppercase text-[#1a1a1a] dark:text-[#e0e0e0]" onClick={() => setIsMenuOpen(false)}>
                  My Account ({user.name})
                </Link>
                <button
                  onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                  className="text-left py-2 text-[12px] font-bold tracking-[0.1em] uppercase text-red-600 dark:text-red-400"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  href="/login"
                  className="block py-2 text-[12px] font-bold tracking-[0.15em] uppercase text-[#1a1a1a] dark:text-[#e0e0e0]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="block py-2 text-[12px] font-bold tracking-[0.15em] uppercase text-[#1a1a1a] dark:text-[#e0e0e0]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
