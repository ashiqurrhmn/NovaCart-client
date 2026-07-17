import type { Metadata } from "next";
import "@fontsource/elms-sans/400.css";
import "@fontsource/elms-sans/500.css";
import "@fontsource/elms-sans/600.css";
import "@fontsource/elms-sans/700.css";
import "@fontsource/elms-sans/800.css";
import "@fontsource/elms-sans/900.css";
import "./globals.css";
import { ConditionalNavbar } from "@/components/conditional-navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";

export const metadata: Metadata = {
  title: "NovaCart | Premium Tech Store",
  description: "NovaCart is a premium tech e-commerce platform offering the latest gadgets, wearables, and electronics from 70+ trusted brands.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ConditionalNavbar />
          <main className="flex-1 flex flex-col">
            {children}
          </main>
          <ThemeToggle />
        </ThemeProvider>
      </body>
    </html>
  );
}
