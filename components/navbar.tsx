"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, User, Heart, ShoppingBag, Menu, X, LogOut } from "lucide-react";
import { useSession, signOut } from "@/app/lib/auth-client";
import { useRouter } from "next/navigation";
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
    <header className="sticky top-0 z-50 w-full bg-[#f5f0eb] dark:bg-[#111111] border-b border-[#e8e2db] dark:border-[#222222]">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 h-14 flex items-center justify-between">
        {/* Left nav links — desktop */}
        <nav className="hidden lg:flex items-center gap-6">
          <Link
            href="/shop?category=men's%20clothing"
            className="text-[11px] font-medium tracking-[0.15em] uppercase text-[#1a1a1a] dark:text-[#e0e0e0] hover:opacity-60 transition-opacity"
          >
            Men
          </Link>
          <Link
            href="/shop?category=women's%20clothing"
            className="text-[11px] font-medium tracking-[0.15em] uppercase text-[#1a1a1a] dark:text-[#e0e0e0] hover:opacity-60 transition-opacity"
          >
            Women
          </Link>
          <Link
            href="/shop?category=kids'%20clothing"
            className="text-[11px] font-medium tracking-[0.15em] uppercase text-[#1a1a1a] dark:text-[#e0e0e0] hover:opacity-60 transition-opacity"
          >
            Kids
          </Link>
          <Link
            href="/shop"
            className="text-[11px] font-medium tracking-[0.15em] uppercase text-[#1a1a1a] dark:text-[#e0e0e0] hover:opacity-60 transition-opacity"
          >
            Browse all
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
          {isSearchOpen ? (
            <form onSubmit={handleSearch} className="flex items-center gap-2 bg-[#f5f5f5] dark:bg-[#222] border border-[#e8e2db] dark:border-[#333] rounded-full px-3 py-1.5 w-48 transition-all">
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
              className="flex items-center gap-1.5 text-[11px] font-medium tracking-[0.12em] uppercase text-[#1a1a1a] dark:text-[#e0e0e0] hover:opacity-60 transition-opacity"
            >
              <Search className="w-[14px] h-[14px]" />
              Search
            </button>
          )}

          {isLoggedIn ? (
            <>
              

              <Link
                href="/wishlist"
                className="flex items-center gap-1.5 text-[11px] font-medium tracking-[0.12em] uppercase text-[#1a1a1a] dark:text-[#e0e0e0] hover:opacity-60 transition-opacity"
              >
                <Heart className="w-[14px] h-[14px]" />
                Wishlist ({wishlistTotal})
              </Link>
              <Link
                href="/cart"
                className="flex items-center gap-1.5 text-[11px] font-medium tracking-[0.12em] uppercase text-[#1a1a1a] dark:text-[#e0e0e0] hover:opacity-60 transition-opacity"
              >
                <ShoppingBag className="w-[14px] h-[14px]" />
                Cart ({totalItems})
              </Link>
              <Link
                href={user.role === "admin" ? "/admin/dashboard" : "/buyer/dashboard"}
                className="flex items-center gap-1.5 text-[11px] font-medium tracking-[0.12em] uppercase text-[#1a1a1a] dark:text-[#e0e0e0] hover:opacity-60 transition-opacity"
              >
                <User className="w-[14px] h-[14px]" />
                {user.name?.split(" ")[0]}
              </Link>
              <ThemeToggle showText={false} className="flex items-center text-[#1a1a1a] dark:text-[#e0e0e0] hover:opacity-60 transition-opacity" />
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
                href="/wishlist"
                className="flex items-center gap-1.5 text-[11px] font-medium tracking-[0.12em] uppercase text-[#1a1a1a] dark:text-[#e0e0e0] hover:opacity-60 transition-opacity"
              >
                <Heart className="w-[14px] h-[14px]" />
                Wishlist
              </Link>

              <Link
                href="/login"
                className="flex items-center gap-1.5 text-[11px] font-medium tracking-[0.12em] uppercase text-[#1a1a1a] dark:text-[#e0e0e0] hover:opacity-60 transition-opacity"
              >
                <User className="w-[14px] h-[14px]" />
                Login
              </Link>
              <ThemeToggle showText={false} className="flex items-center text-[#1a1a1a] dark:text-[#e0e0e0] hover:opacity-60 transition-opacity" />
            </>
          )}
        </div>

        {/* Mobile right icons */}
        <div className="flex lg:hidden items-center gap-3">
          <button 
            className="text-[#1a1a1a] dark:text-[#e0e0e0] hover:opacity-60 transition-opacity"
            onClick={() => setIsMobileSearchOpen(true)}
            aria-label="Search"
          >
            <Search className="w-[18px] h-[18px]" />
          </button>
          {isLoggedIn && user?.role !== "admin" && (
            <Link href="/cart" aria-label="Cart" className="text-[#1a1a1a] dark:text-[#e0e0e0] relative">
              <ShoppingBag className="w-[18px] h-[18px]" />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Search Overlay */}
      {isMobileSearchOpen && (
        <div className="absolute inset-0 z-50 bg-[#f5f0eb] dark:bg-[#111111] px-4 flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-200">
          <form onSubmit={handleSearch} className="flex-1 flex items-center gap-2 bg-white dark:bg-[#222] rounded-lg px-3 py-2 border border-[#e8e2db] dark:border-[#333]">
            <Search className="w-4 h-4 text-neutral-500" />
            <input
              type="text"
              autoFocus
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent outline-none text-sm w-full text-[#1a1a1a] dark:text-white"
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

      {/* Mobile menu */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ${
          isMenuOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-6 py-5 bg-[#f5f0eb] dark:bg-[#111111] border-t border-[#e8e2db] dark:border-[#222222] space-y-1">
          <Link
            href="/shop"
            className="block py-2.5 text-[12px] font-medium tracking-[0.15em] uppercase text-[#1a1a1a] dark:text-[#e0e0e0] hover:opacity-60 transition-opacity"
            onClick={() => setIsMenuOpen(false)}
          >
            Browse All
          </Link>
          {[
            { label: "Men", key: "men's clothing" },
            { label: "Women", key: "women's clothing" },
            { label: "Kids", key: "kids' clothing" }
          ].map((item) => (
            <Link
              key={item.label}
              href={`/shop?category=${encodeURIComponent(item.key)}`}
              className="block py-2.5 text-[12px] font-medium tracking-[0.15em] uppercase text-[#1a1a1a] dark:text-[#e0e0e0] hover:opacity-60 transition-opacity"
              onClick={() => setIsMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <div className="pt-3 mt-2 border-t border-[#e8e2db] dark:border-[#222222]">
            <ThemeToggle className="flex items-center gap-2 py-2.5 text-[12px] font-medium tracking-[0.15em] uppercase text-[#1a1a1a] dark:text-[#e0e0e0] hover:opacity-60 transition-opacity w-full text-left" iconClassName="w-[14px] h-[14px]" />
          </div>
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
