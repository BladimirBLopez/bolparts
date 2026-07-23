"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Search, Plus, LogOut, User, Heart } from "lucide-react";

export function Navbar() {
  const { data: session, status } = useSession();

  return (
    <header className="sticky top-0 z-50 border-b border-[#E4E4E1] bg-[#F6F6F4]/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4">
        {/* Logo estilo placa */}
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span className="relative flex h-8 w-11 items-center justify-center rounded-[3px] border-2 border-[#16181D] bg-white text-[11px] font-bold tracking-tight text-[#16181D]">
            BOL
            <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-[#FF5A1F]" />
          </span>
          <span className="text-lg font-extrabold tracking-tight text-[#16181D]">
            Parts
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
        <div className="flex items-center gap-2">
          <Link
            href="/buscar"
            className="flex items-center justify-center rounded-full p-2 text-[#16181D] sm:hidden"
            aria-label="Buscar"
          >
            <Search size={20} />
          </Link>

          <Link
            href={session ? "/publicar" : "/login"}
            className="flex items-center gap-1.5 rounded-full bg-[#FF5A1F] px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#e64f16] sm:px-4"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">Publicar</span>
          </Link>

          {status === "loading" ? (
            <div className="h-9 w-9 animate-pulse rounded-full bg-[#E4E4E1]" />
          ) : session ? (
            <div className="flex items-center gap-1">
              <Link
                href="/favoritos"
                className="flex h-9 w-9 items-center justify-center rounded-full text-[#16181D] transition-colors hover:bg-white"
                aria-label="Favoritos"
              >
                <Heart size={18} />
              </Link>
              <Link
                href="/mis-publicaciones"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#16181D] text-white"
                aria-label="Mi cuenta"
              >
                <User size={16} />
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="hidden items-center gap-1.5 rounded-full border border-[#E4E4E1] px-3 py-2 text-sm font-medium text-[#16181D] transition-colors hover:border-[#16181D] sm:flex"
                aria-label="Cerrar sesión"
              >
                <LogOut size={15} />
                Salir
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="rounded-full border border-[#16181D] px-3 py-2 text-sm font-medium text-[#16181D] transition-colors hover:bg-[#16181D] hover:text-white sm:px-4"
            >
              Ingresar
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}