import Link from "next/link";
import { Mail, Phone, Globe } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full bg-black pt-16 pb-16 relative border-t border-neutral-900 mt-auto overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-3 gap-12 pb-8">
        
        {/* Left: Brand */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <Link href="/" className="text-2xl font-black uppercase tracking-tight text-white mb-4">
            NovaCart
          </Link>
          <p className="text-[13px] text-neutral-400 leading-relaxed max-w-sm">
            NovaCart is a premium e-commerce platform offering the latest collections and trends from trusted fashion brands.
          </p>
        </div>

        {/* Middle: Navigation Items */}
        <div className="flex flex-col items-center text-center">
          <h4 className="text-sm font-semibold uppercase tracking-widest text-white mb-4">
            Quick Links
          </h4>
          <div className="flex flex-col gap-3 text-[13px] text-neutral-400">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <Link href="/shop" className="hover:text-white transition-colors">Shop</Link>
            <Link href="/about" className="hover:text-white transition-colors">About Us</Link>
            <Link href="/wishlist" className="hover:text-white transition-colors">Wishlist</Link>
            <Link href="/cart" className="hover:text-white transition-colors">Shopping Cart</Link>
          </div>
        </div>

        {/* Right: Connect With Me (2 Grid) */}
        <div className="flex flex-col items-center md:items-end md:text-right">
          <h4 className="text-sm font-semibold uppercase tracking-widest text-white mb-4">
            Connect With Me
          </h4>
          
          <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-[13px] text-neutral-400">
            {/* Portfolio */}
            <a 
              href="https://ashiqur-portfolio0.vercel.app/" 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center gap-2 hover:text-white transition-colors group"
            >
              <Globe className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span>Portfolio</span>
            </a>

            {/* LinkedIn */}
            <a 
              href="https://www.linkedin.com/in/ashiqur-rahman00/" 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center gap-2 hover:text-white transition-colors group"
            >
              <svg className="w-4 h-4 group-hover:scale-110 transition-transform fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              <span>LinkedIn</span>
            </a>

            {/* GitHub */}
            <a 
              href="https://github.com/ashiqurrhmn" 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center gap-2 hover:text-white transition-colors group"
            >
              <svg className="w-4 h-4 group-hover:scale-110 transition-transform fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
              </svg>
              <span>GitHub</span>
            </a>

            {/* Email */}
            <a 
              href="mailto:ashiqur1312@gmail.com" 
              className="flex items-center gap-2 hover:text-white transition-colors group"
            >
              <Mail className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span>Email</span>
            </a>

            {/* Phone */}
            <a 
              href="tel:01571164022" 
              className="flex items-center gap-2 hover:text-white transition-colors group col-span-2 justify-center md:justify-end mt-2"
            >
              <Phone className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span>01571164022</span>
            </a>
          </div>
        </div>
      </div>

      {/* Absolute Copyright */}
      <div className="absolute bottom-6 left-0 w-full text-center pointer-events-none">
        <p className="text-[10px] sm:text-[11px] text-neutral-600 uppercase tracking-widest">
          © {new Date().getFullYear()} Ashiqur Rahman
        </p>
      </div>
    </footer>
  );
}
