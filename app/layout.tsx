import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { SiteChrome } from "@/components/SiteChrome";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BolParts — Repuestos de auto, moto y camión en Bolivia",
  description: "Comprá y vendé repuestos nuevos y usados en Bolivia. Sin intermediarios.",
  metadataBase: new URL("https://bolparts.vercel.app"),
  openGraph: {
    title: "BolParts — Repuestos de auto, moto y camión en Bolivia",
    description: "Comprá y vendé repuestos nuevos y usados en Bolivia. Sin intermediarios.",
    type: "website",
    locale: "es_BO",
  },
  twitter: {
    card: "summary_large_image",
    title: "BolParts — Repuestos de auto, moto y camión en Bolivia",
    description: "Comprá y vendé repuestos nuevos y usados en Bolivia. Sin intermediarios.",
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
      <body className="min-h-full flex flex-col bg-[#F6F6F4]">
        <Providers>
          <SiteChrome>{children}</SiteChrome>
          <Toaster position="top-center" richColors />
        </Providers>
      </body>
    </html>
  );
}
