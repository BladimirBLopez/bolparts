"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const ocultarChrome = pathname === "/login" || pathname === "/register";

  return (
    <>
      {!ocultarChrome && <Navbar />}
      {children}
      {!ocultarChrome && <Footer />}
    </>
  );
}
