import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { ThemeDebug } from "@/components/theme-debug";
import { AuthProvider } from "@/lib/auth-context";
import { Navbar } from "@/components/navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Roteirin - AI Travel Itinerary Generator",
  description: "Generate personalized travel itineraries with AI. Plan your perfect trip with customizable activities based on your preferences and budget.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <div className="relative flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1">
                {children}
              </main>
            </div>
            <Toaster position="top-center" />
            <ThemeDebug />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
