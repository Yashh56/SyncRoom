import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientAuthProvider from "@/components/Auth";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { EdgeStoreProvider } from '../lib/edgeStore';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SyncRoom",
  description: "",
  openGraph: {
    title: "SyncRoom",
    description: "A collaborative whiteboard app",
    url: "https://syncroom.app",
    siteName: "SyncRoom",
    images: [
      {
        url: "https://syncroom.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "SyncRoom - Collaborative Whiteboard App",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClientAuthProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          suppressHydrationWarning
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >  <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
            <EdgeStoreProvider>
              {children}
            </EdgeStoreProvider>
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ClientAuthProvider>
  );
}
