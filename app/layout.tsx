import type { Metadata } from "next";
import "@fontsource/elms-sans/400.css";
import "@fontsource/elms-sans/500.css";
import "@fontsource/elms-sans/600.css";
import "@fontsource/elms-sans/700.css";
import "@fontsource/elms-sans/800.css";
import "@fontsource/elms-sans/900.css";
import "./globals.css";
import NextTopLoader from 'nextjs-toploader';
import { ConditionalNavbar } from "@/components/conditional-navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { CartProvider } from "@/app/context/cart-context";
import { WishlistProvider } from "@/app/context/wishlist-context";
import { Toaster } from "react-hot-toast";

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
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <WishlistProvider>
            <CartProvider>
              <NextTopLoader color="var(--toploader-color)" showSpinner={false} height={3} />
              <Toaster position="bottom-right" />
              <ConditionalNavbar />
              <main className="flex-1 flex flex-col">
                {children}
              </main>
              <ThemeToggle />
            </CartProvider>
          </WishlistProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
