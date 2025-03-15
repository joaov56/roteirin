import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { ThemeDebug } from "@/components/theme-debug";

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
          <Toaster position="top-center" />
          {children}
          <ThemeDebug />
        </ThemeProvider>
      </body>
    </html>
  );
}
