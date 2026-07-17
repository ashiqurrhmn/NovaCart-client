import { Search, ChevronDown } from "lucide-react";

export default function ShopLoading() {
  return (
    <div className="flex-1 bg-[#f5f0eb] dark:bg-[#111111] min-h-screen overflow-x-hidden animate-pulse">
      {/* Hero Banner Skeleton */}
      <div className="relative w-full h-[180px] sm:h-[240px] md:h-[360px] bg-neutral-300 dark:bg-neutral-800" />

      {/* Search Bar Skeleton */}
      <div className="max-w-[1440px] mx-auto px-3 sm:px-4 md:px-8 -mt-6 relative z-10">
        <div className="bg-white dark:bg-[#1a1a1a] rounded-xl shadow-lg px-4 sm:px-6 md:px-8 py-4 sm:py-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 sm:gap-4">
          <div className="h-6 bg-neutral-200 dark:bg-neutral-800 rounded w-48" />
          <div className="flex items-center gap-2 sm:gap-3 w-full md:w-auto md:max-w-md">
            <div className="flex-1 bg-[#f5f5f5] dark:bg-[#252525] rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 h-10 w-full" />
            <div className="h-10 w-24 bg-[#1a1a1a] dark:bg-[#e0e0e0] rounded-lg shrink-0" />
          </div>
        </div>
      </div>

      {/* Main Content: Sidebar + Products */}
      <div className="max-w-[1440px] mx-auto px-3 sm:px-4 md:px-8 py-6 md:py-10">
        <div className="flex gap-8">
          {/* Sidebar Skeleton */}
          <aside className="hidden lg:block w-[220px] shrink-0 space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="h-5 bg-neutral-200 dark:bg-neutral-800 rounded w-20" />
                <ChevronDown className="w-4 h-4 text-neutral-300 dark:text-neutral-700" />
              </div>
              <div className="space-y-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-10 bg-neutral-200 dark:bg-neutral-800 rounded-lg w-full" />
                ))}
              </div>
            </div>
            <div className="border-t border-[#e8e8e8] dark:border-[#333] pt-4 space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-10 bg-neutral-200 dark:bg-neutral-800 rounded-lg w-full" />
              ))}
            </div>
          </aside>

          {/* Product Grid Skeleton */}
          <div className="flex-1 min-w-0">
            {/* Mobile pills skeleton */}
            <div className="flex lg:hidden items-center gap-2 mb-5">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-8 w-24 bg-neutral-200 dark:bg-neutral-800 rounded-full" />
              ))}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="bg-white dark:bg-[#1a1a1a] rounded-2xl overflow-hidden border border-[#e8e8e8] dark:border-[#333] h-[320px] sm:h-[360px] flex flex-col">
                  <div className="w-full h-48 sm:h-56 bg-neutral-200 dark:bg-neutral-800" />
                  <div className="p-4 flex flex-col flex-1 gap-3">
                    <div className="h-5 bg-neutral-200 dark:bg-neutral-800 rounded w-3/4" />
                    <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-1/2" />
                    <div className="mt-auto flex items-center justify-between">
                      <div className="h-6 bg-neutral-200 dark:bg-neutral-800 rounded w-16" />
                      <div className="h-8 w-8 bg-neutral-200 dark:bg-neutral-800 rounded-lg" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
