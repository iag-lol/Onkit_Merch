import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsappToggle } from "@/components/shared/WhatsappToggle";
import { VisitTracker } from "@/components/shared/VisitTracker";
import { Plus_Jakarta_Sans } from "next/font/google";

const font = Plus_Jakarta_Sans({ subsets: ["latin"], display: "swap" });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://onkitmerch.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "ONKIT MERCH | Kits Personalizados y Merchandising Corporativo en Chile",
    template: "%s | ONKIT MERCH"
  },
  description: "Kits personalizados y merchandising para empresas, colegios, clubes deportivos y eventos en Chile. Producción bajo demanda, mínimo 10 unidades, descuentos por volumen. Cotización en 24hrs.",
  keywords: [
    "kits personalizados",
    "merchandising corporativo",
    "regalos empresariales",
    "kits onboarding",
    "merchandising Chile",
    "uniformes corporativos",
    "regalos ejecutivos",
    "kits deportivos",
    "merchandising eventos",
    "producción merchandising",
    "kits escolares",
    "regalos personalizados empresas"
  ],
  authors: [{ name: "ONKIT MERCH" }],
  creator: "ONKIT MERCH",
  publisher: "ONKIT MERCH",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "es_CL",
    url: siteUrl,
    title: "ONKIT MERCH | Kits Personalizados y Merchandising Corporativo",
    description: "Kits personalizados y merchandising para empresas, colegios, clubes deportivos y eventos en Chile. Cotización en 24hrs.",
    siteName: "ONKIT MERCH",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "ONKIT MERCH - Kits Personalizados",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ONKIT MERCH | Kits Personalizados y Merchandising Corporativo",
    description: "Kits personalizados y merchandising para empresas en Chile. Cotización en 24hrs.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
  alternates: {
    canonical: siteUrl,
  },
  verification: {
    google: "google-site-verification-code", // Reemplazar con el código real de Google Search Console
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-CL">
      <head>
        <link rel="canonical" href={siteUrl} />
        <meta name="theme-color" content="#1DB9A0" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="ONKIT MERCH" />
      </head>
      <body className={font.className}>
        <Providers>
          <div className="min-h-screen">
            <Header />
            <VisitTracker />
            {children}
            <Footer />
            <WhatsappToggle />
          </div>
        </Providers>
      </body>
    </html>
  );
}
