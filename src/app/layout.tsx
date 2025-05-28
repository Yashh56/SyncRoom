import type { Metadata } from "next";
import "./globals.css";
import ClientAuthProvider from "@/components/Auth";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { EdgeStoreProvider } from '../lib/edgeStore';
import { Roboto } from 'next/font/google'
 
const roboto = Roboto({
  weight: '400',
  subsets: ['latin'],
})


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
          className={`${roboto.className} `}
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
