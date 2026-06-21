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

const baseUrl = process.env.NEXT_PUBLIC_URL || "http://77.81.226.151";

export const metadata: Metadata = {
  title: {
    default: "AI Act Check — Valuta la conformità del tuo sistema AI",
    template: "%s | AI Act Check",
  },
  description:
    "L'AI Act diventa applicabile il 2 agosto 2026. Scopri in 3 minuti se il tuo sistema AI è conforme al Regolamento UE 2024/1689. Screening gratuito con gap analysis e azioni prioritarie.",
  keywords: [
    "AI Act",
    "AI Act compliance",
    "Regolamento UE 2024/1689",
    "valutazione AI",
    "classificazione rischio AI",
    "gap analysis AI",
    "consulenza AI Act",
  ],
  authors: [{ name: "Pietro Giacobazzi" }],
  metadataBase: new URL(baseUrl),
  openGraph: {
    type: "website",
    locale: "it_IT",
    siteName: "AI Act Check",
    title: "AI Act Check — Valuta la conformità del tuo sistema AI",
    description:
      "L'AI Act diventa applicabile il 2 agosto 2026. Scopri in 3 minuti se il tuo sistema AI è conforme al Regolamento UE 2024/1689.",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Act Check — Valuta la conformità del tuo sistema AI",
    description:
      "Scopri in 3 minuti se il tuo sistema AI è conforme all'AI Act.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/manifest.json",
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "AI Act Check",
    description:
      "Tool di screening per la conformità AI Act. Classifica il tuo sistema AI secondo il Regolamento UE 2024/1689.",
    url: baseUrl,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "EUR",
    },
    author: {
      "@type": "Person",
      name: "Pietro Giacobazzi",
    },
  };

  return (
    <html
      lang="it"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="flex min-h-full flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
