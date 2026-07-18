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
import { ChatWidget } from "@/components/chat-widget";
import { ConditionalFooter } from "@/components/conditional-footer";
import { SmoothScroll } from "@/components/smooth-scroll";

export const metadata: Metadata = {
  title: "NovaCart | Premium AI Powered Cloth Store",
  description: "NovaCart is a premium AI powered cloth store offering the latest fashion, wearables, and clothing from 70+ trusted brands.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="antialiased"
      suppressHydrationWarning
    >
      <body className="min-h-screen flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <SmoothScroll>
            <WishlistProvider>
              <CartProvider>
                <NextTopLoader color="var(--toploader-color)" showSpinner={false} height={3} />
                <Toaster position="bottom-right" />
                <ConditionalNavbar />
                <main className="flex-1 flex flex-col">
                  {children}
                </main>
                <ConditionalFooter />
                <ChatWidget />
              </CartProvider>
            </WishlistProvider>
          </SmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  );
}
