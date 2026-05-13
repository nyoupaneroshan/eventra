import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Eventra - We Plan, You Celebrate | Event Planning in Butwal",
  description:
    "Professional event planning services in Butwal, Nepal. We specialize in weddings, corporate events, and private parties. From concept to execution, we make every event unforgettable.",
  keywords: [
    "event planning",
    "wedding planning",
    "corporate events",
    "private parties",
    "Butwal",
    "Nepal",
    "Eventra",
    "event management",
  ],
  authors: [{ name: "Eventra" }],
  icons: {
    icon: "/logo-eventra.png",
  },
  openGraph: {
    title: "Eventra - We Plan, You Celebrate",
    description:
      "Professional event planning services in Butwal, Nepal for weddings, corporate events, and private parties.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
