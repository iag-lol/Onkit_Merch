import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsappToggle } from "@/components/shared/WhatsappToggle";
import { VisitTracker } from "@/components/shared/VisitTracker";
import { Plus_Jakarta_Sans } from "next/font/google";

const font = Plus_Jakarta_Sans({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "ONKIT MERCH | Kits personalizados y merchandising inteligente",
  description: "Kits personalizados, producción bajo demanda para empresas, colegios, sport y eventos.",
  metadataBase: new URL("https://onkitmerch.example.com")
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
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
