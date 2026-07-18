"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-[#f5f0eb] dark:bg-[#111111] text-[#1a1a1a] dark:text-[#f0f0f0] px-6 text-center overflow-hidden">
      <div className="relative mb-8">
        <AlertTriangle className="w-24 h-24 text-red-500/20" strokeWidth={1} />
        <AlertTriangle className="w-12 h-12 text-red-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" strokeWidth={2} />
      </div>
      <h1 className="text-[100px] md:text-[150px] font-black leading-none tracking-tighter opacity-10 uppercase">Error</h1>
      <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-4 -mt-10 md:-mt-16 relative z-10">
        Something went wrong
      </h2>
      <p className="text-neutral-500 max-w-md mx-auto mb-10 font-medium relative z-10">
        We encountered an unexpected error. Don't worry, it's not you, it's us.
      </p>
      
      <button 
        onClick={() => reset()}
        className="relative z-10 inline-flex items-center gap-2 bg-[#1a1a1a] dark:bg-white text-white dark:text-[#1a1a1a] px-8 py-4 rounded-xl font-bold tracking-widest uppercase text-sm hover:opacity-80 transition-all hover:rotate-2 group"
      >
        <RefreshCcw className="w-4 h-4 group-hover:animate-spin" />
        Try Again
      </button>
    </div>
  );
}
