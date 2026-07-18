import Link from "next/link";
import { Ghost, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-[#f5f0eb] dark:bg-[#111111] text-[#1a1a1a] dark:text-[#f0f0f0] px-6 text-center overflow-hidden">
      <Ghost className="w-24 h-24 mb-8 text-neutral-300 dark:text-neutral-700 animate-bounce" strokeWidth={1} />
      <h1 className="text-[120px] md:text-[200px] font-black leading-none tracking-tighter opacity-10">404</h1>
      <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-4 -mt-12 md:-mt-20 relative z-10">
        Page Not Found
      </h2>
      <p className="text-neutral-500 max-w-md mx-auto mb-10 font-medium relative z-10">
        The page you are looking for doesn't exist or has been moved. Let's get you back on track.
      </p>
      
      <Link 
        href="/" 
        className="relative z-10 inline-flex items-center gap-2 bg-[#1a1a1a] dark:bg-white text-white dark:text-[#1a1a1a] px-8 py-4 rounded-xl font-bold tracking-widest uppercase text-sm hover:opacity-80 transition-all hover:gap-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Return Home
      </Link>
    </div>
  );
}
