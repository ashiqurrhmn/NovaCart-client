"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle({ 
  className = "flex items-center gap-1.5 text-[11px] font-medium tracking-[0.12em] uppercase hover:opacity-60 transition-opacity", 
  iconClassName = "w-[14px] h-[14px]",
  showText = true
}: { 
  className?: string; 
  iconClassName?: string;
  showText?: boolean;
}) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button className={`opacity-0 cursor-default ${className}`} aria-hidden="true">
        <Moon className={iconClassName} />
        {showText && <span className="hidden sm:inline">Theme</span>}
      </button>
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className={className}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? <Sun className={iconClassName} /> : <Moon className={iconClassName} />}
      {showText && <span className="hidden sm:inline">Theme</span>}
    </button>
  );
}
