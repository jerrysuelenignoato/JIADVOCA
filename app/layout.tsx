import type { Metadata } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const BASE_URL = process.env.APP_URL ?? "https://jiadvoca.com.br";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "JIADVOCA — Conteúdo magnético para a advocacia previdenciária",
    template: "%s | JIADVOCA",
  },
  description:
    "Alcance seus clientes da melhor forma. Gere carrosséis e reels irresistíveis para o Instagram com IA — em menos de 2 minutos.",
  keywords: [
    "marketing jurídico",
    "conteúdo para advogados",
    "instagram advocacia",
    "direito previdenciário",
    "carrossel instagram advogado",
    "gerador de conteúdo jurídico",
  ],
  authors: [{ name: "JIADVOCA" }],
  creator: "JIADVOCA",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: BASE_URL,
    siteName: "JIADVOCA",
    title: "JIADVOCA — Conteúdo magnético para a advocacia previdenciária",
    description:
      "Gere carrosséis e reels para o Instagram sem juridiquês. Feito para advogados previdenciaristas.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "JIADVOCA — Conteúdo magnético para a advocacia previdenciária",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "JIADVOCA — Conteúdo magnético para a advocacia previdenciária",
    description: "Gere carrosséis e reels para o Instagram sem juridiquês.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <TooltipProvider>
          {children}
          <Toaster richColors position="top-right" />
        </TooltipProvider>
      </body>
    </html>
  );
}
