import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navigation from "@/components/layout/Navigation";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Brand Personality Manager",
  description: "Manage your brand's personality, adjectives, and writing rules",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 min-h-screen`}
      >
        <Navigation />
        <main className="py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
