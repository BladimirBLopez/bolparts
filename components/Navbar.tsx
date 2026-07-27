"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { Search, Plus } from "lucide-react";
import { MobileMenu } from "@/components/MobileMenu";

export function Navbar() {
  const { data: session, status } = useSession();

  return (
    <header className="sticky top-0 z-50 border-b border-[#E4E4E1] bg-[#F6F6F4]/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <Image
            src="/icon-header.png"
            alt="BolParts"
            width={36}
            height={36}
            className="h-9 w-9 object-contain"
            priority
          />
          <span className="text-lg font-extrabold tracking-tight text-[#16181D]">
            BOL Parts
          </span>
        </Link>

        {/* Buscador - desktop/tablet */}
        <Link
          href="/buscar"
          className="hidden flex-1 items-center gap-2 rounded-full border border-[#E4E4E1] bg-white px-4 py-2 text-sm text-[#6B7280] transition-colors hover:border-[#16181D] sm:flex"
        >
          <Search size={16} />
          Buscar repuestos, marcas, modelos...
        </Link>

        {/* Acciones */}
        <div className="flex items-center gap-1.5">
          <Link
            href="/buscar"
            className="flex items-center justify-center rounded-full p-2 text-[#16181D] sm:hidden"
            aria-label="Buscar"
          >
            <Search size={20} />
          </Link>

          <Link
            href={session ? "/vender" : "/login"}
            className="flex items-center gap-1.5 rounded-full bg-[#FF5A1F] px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#e64f16] sm:px-4"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">Vender</span>
          </Link>

          {status === "loading" ? (
            <div className="h-9 w-9 animate-pulse rounded-full bg-[#E4E4E1]" />
          ) : (
            <MobileMenu />
          )}
        </div>
      </div>
    </header>
  );
}
