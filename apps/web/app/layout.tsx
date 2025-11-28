"use client"
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "../provider";
import { usePathname } from 'next/navigation';
import { AppbarClient } from "../components/AppbarClient";
import OverlayLoader from "@repo/ui/OverlayLoader";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
    const isSignInPage = pathname.startsWith("/signin");
  return (
    <html lang="en">
        <Providers>
      <body>
        {!isSignInPage && <AppbarClient />}
        {children}
        <OverlayLoader />
      </body>
      </Providers>
    </html>
  );
}
