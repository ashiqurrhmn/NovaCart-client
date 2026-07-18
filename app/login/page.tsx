"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import { authClient } from "../lib/auth-client";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    
    const { data, error } = await authClient.signIn.email({
      email: formData.email,
      password: formData.password,
    });

    if (error) {
      setErrors({ ...errors, email: error.message || "Invalid credentials" });
      toast.error(error.message || "Login Failed");
      setIsSubmitting(false);
      return;
    }

    toast.success("Successfully logged in.");
    setIsSubmitting(false);
    router.push("/");
  };

  const handleGoogleLogin = async () => {
    setIsSubmitting(true);
    const { data, error } = await authClient.signIn.social({
      provider: "google",
      callbackURL: "/"
    });
    
    if (error) {
      setErrors({ ...errors, email: error.message || "Google sign-in failed" });
      toast.error(error.message || "Google sign-in failed");
    } else {
      toast.success("Redirecting to Google...");
    }
    
    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-56px)] flex items-center justify-center overflow-hidden bg-[#f5f0eb] dark:bg-[#111111] px-4 transition-colors">
      {/* Form Container */}
      <div className="relative z-10 w-full max-w-sm py-12">
        <div className="text-center mb-10">
          <Link href="/" className="inline-block hover:opacity-80 transition-opacity">
            <h1 className="text-3xl font-black uppercase tracking-widest text-[#1a1a1a] dark:text-[#f0f0f0]">
              NOVACART
            </h1>
          </Link>
          <p className="text-[11px] font-medium tracking-[0.15em] uppercase text-neutral-500 mt-4">
            Welcome Back
          </p>
          
          <div className="flex gap-3 justify-center mt-6">
            <button 
              type="button" 
              onClick={() => setFormData({email: 'admin@gmail.com', password: '12345Asdf'})}
              className="text-[10px] font-semibold tracking-wider uppercase px-3 py-1.5 bg-white dark:bg-[#1a1a1a] border border-[#1a1a1a]/10 dark:border-white/10 rounded hover:border-[#1a1a1a]/30 dark:hover:border-white/30 transition-all text-[#1a1a1a] dark:text-[#ededed] shadow-sm"
            >
              Admin Demo
            </button>
            <button 
              type="button" 
              onClick={() => setFormData({email: 'user@gmail.com', password: '12345Asdf'})}
              className="text-[10px] font-semibold tracking-wider uppercase px-3 py-1.5 bg-white dark:bg-[#1a1a1a] border border-[#1a1a1a]/10 dark:border-white/10 rounded hover:border-[#1a1a1a]/30 dark:hover:border-white/30 transition-all text-[#1a1a1a] dark:text-[#ededed] shadow-sm"
            >
              User Demo
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {/* Email */}
          <div>
            <label className="block text-[10px] font-semibold tracking-wider uppercase text-[#1a1a1a] dark:text-[#e0e0e0] mb-2" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className={`flex h-11 w-full border-b ${errors.email ? 'border-red-500' : 'border-[#1a1a1a]/20 dark:border-white/20 focus:border-[#1a1a1a] dark:focus:border-white'} bg-transparent px-2 py-2 text-sm text-[#1a1a1a] dark:text-white placeholder:text-neutral-400 focus:outline-none transition-colors`}
              placeholder="name@example.com"
            />
            {errors.email && <p className="mt-2 flex items-center gap-1 text-[10px] uppercase tracking-wide text-red-500"><AlertCircle className="w-3 h-3" /> {errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-[10px] font-semibold tracking-wider uppercase text-[#1a1a1a] dark:text-[#e0e0e0]" htmlFor="password">
                Password
              </label>
              <a href="#" className="text-[10px] font-semibold tracking-wider uppercase text-[#1a1a1a]/60 dark:text-[#e0e0e0]/60 hover:text-[#1a1a1a] dark:hover:text-[#e0e0e0] transition-colors">
                Forgot?
              </a>
            </div>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                className={`flex h-11 w-full border-b ${errors.password ? 'border-red-500' : 'border-[#1a1a1a]/20 dark:border-white/20 focus:border-[#1a1a1a] dark:focus:border-white'} bg-transparent px-2 py-2 pr-10 text-sm text-[#1a1a1a] dark:text-white placeholder:text-neutral-400 focus:outline-none transition-colors`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-[#1a1a1a] dark:hover:text-white focus:outline-none"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && (
               <p className="mt-2 flex items-start gap-1 text-[10px] uppercase tracking-wide text-red-500">
                 <AlertCircle className="w-3 h-3 shrink-0" /> 
                 <span>{errors.password}</span>
               </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-6 flex items-center justify-center h-11 bg-[#1a1a1a] dark:bg-[#f0f0f0] text-white dark:text-[#111111] text-[11px] font-semibold tracking-[0.15em] uppercase hover:bg-[#333] dark:hover:bg-[#ddd] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Processing...
              </span>
            ) : "Log In"}
          </button>
        </form>

        <div className="my-8 flex items-center">
          <div className="flex-1 border-t border-[#1a1a1a]/10 dark:border-white/10"></div>
          <span className="px-4 text-[9px] text-neutral-500 uppercase tracking-widest font-semibold">Or</span>
          <div className="flex-1 border-t border-[#1a1a1a]/10 dark:border-white/10"></div>
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-3 h-11 border border-[#1a1a1a] dark:border-[#e0e0e0] text-[#1a1a1a] dark:text-[#e0e0e0] text-[11px] font-semibold tracking-[0.15em] uppercase hover:bg-[#1a1a1a] hover:text-white dark:hover:bg-[#e0e0e0] dark:hover:text-[#111111] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="currentColor" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="currentColor" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="currentColor" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="currentColor" />
          </svg>
          Google
        </button>
        
        <p className="text-center text-[10px] tracking-wider uppercase text-neutral-500 pt-8">
          New to Novacart?{" "}
          <Link href="/signup" className="font-bold text-[#1a1a1a] dark:text-white hover:opacity-70 transition-opacity">
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
}
