import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
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
  title: "AI Act Check — Valuta la conformità del tuo sistema AI",
  description:
    "L'AI Act diventa applicabile il 2 agosto 2026. Scopri in 3 minuti se il tuo sistema AI è conforme al Regolamento UE 2024/1689. Screening gratuito con gap analysis e azioni prioritarie.",
  keywords: [
    "AI Act",
    "AI Act compliance",
    "Regolamento UE 2024/1689",
    "valutazione AI",
    "classificazione rischio AI",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="it"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
