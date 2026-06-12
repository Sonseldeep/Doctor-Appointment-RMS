import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DocFlow - Modern Healthcare Management System",
  description: "DocFlow streamlines doctor appointments, digitizes patient records, and eliminates healthcare administrative chaos. HIPAA-compliant, secure, and designed for modern practices.",
  generator: "v0.app",
  keywords: ["doctor appointments", "patient records", "healthcare management", "EMR", "medical scheduling"],
  openGraph: {
    title: "DocFlow - Healthcare without the wait",
    description: "Streamlined appointments, digital records, and modern healthcare management.",
    url: "https://docflow.app",
    type: "website",
  },
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background font-sans">
        <Providers>
          {children}
          <Toaster richColors />
        </Providers>
      </body>
    </html>
  );
}