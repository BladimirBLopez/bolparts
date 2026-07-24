"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import {
  Menu,
  X,
  Search,
  Plus,
  Heart,
  Package,
  LogOut,
  LogIn,
  UserPlus,
  User as UserIcon,
  Settings,
  ShieldCheck,
} from "lucide-react";

export function MobileMenu() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  function close() {
    setOpen(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Abrir menú"
        className="flex h-9 w-9 items-center justify-center rounded-full text-[#16181D] transition-colors hover:bg-white"
      >
        <Menu size={20} />
      </button>

      {open &&
        mounted &&
        createPortal(
          <>
            {/* Fondo */}
          <button
            type="button"
            aria-label="Cerrar menú"
            onClick={close}
            className="fixed inset-0 z-[100] bg-black/40"
          />

          {/* Panel */}
          <div className="fixed inset-y-0 right-0 z-[101] flex w-[85%] max-w-xs flex-col bg-[#F6F6F4] shadow-xl">
            {/* Tarjeta de perfil / encabezado */}
            {session?.user ? (
              <div className="flex items-center gap-3 bg-[#16181D] px-5 py-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/10 text-white">
                  {session.user.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={session.user.image}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <UserIcon size={20} />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white">
                    {session.user.name || "Usuario de BolParts"}
                  </p>
                  <p className="truncate text-xs text-white/60">
                    {session.user.email}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={close}
                  aria-label="Cerrar"
                  className="ml-auto shrink-0 text-white/70"
                >
                  <X size={20} />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between bg-[#16181D] px-5 py-6">
                <p className="text-sm font-semibold text-white">BolParts</p>
                <button
                  type="button"
                  onClick={close}
                  aria-label="Cerrar"
                  className="text-white/70"
                >
                  <X size={20} />
                </button>
              </div>
            )}

            {/* Opciones */}
            <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
              <Link
                href="/buscar"
                onClick={close}
                className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-[#16181D] hover:bg-white"
              >
                <Search size={18} />
                Buscar repuestos
              </Link>

              <Link
                href="/publicar"
                onClick={close}
                className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-[#16181D] hover:bg-white"
              >
                <Plus size={18} />
                Publicar repuesto
              </Link>

              {session?.user && (
                <>
                  <Link
                    href="/favoritos"
                    onClick={close}
                    className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-[#16181D] hover:bg-white"
                  >
                    <Heart size={18} />
                    Favoritos
                  </Link>

                  <Link
                    href="/mis-publicaciones"
                    onClick={close}
                    className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-[#16181D] hover:bg-white"
                  >
                    <Package size={18} />
                    Mis publicaciones
                  </Link>

                  <Link
                    href="/perfil"
                    onClick={close}
                    className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-[#16181D] hover:bg-white"
                  >
                    <Settings size={18} />
                    Mi perfil
                  </Link>

                  {session.user.role === "ADMIN" && (
                    <Link
                      href="/admin"
                      onClick={close}
                      className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-[#FF5A1F] hover:bg-white"
                    >
                      <ShieldCheck size={18} />
                      Panel Admin
                    </Link>
                  )}
                </>
              )}

              <div className="mt-auto pt-3">
                {session?.user ? (
                  <button
                    type="button"
                    onClick={() => {
                      close();
                      signOut({ callbackUrl: "/" });
                    }}
                    className="flex w-full items-center gap-3 rounded-xl border border-[#E4E4E1] bg-white px-3 py-3 text-sm font-medium text-[#16181D]"
                  >
                    <LogOut size={18} />
                    Cerrar sesión
                  </button>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Link
                      href="/login"
                      onClick={close}
                      className="flex items-center justify-center gap-2 rounded-full bg-[#FF5A1F] px-4 py-2.5 text-sm font-semibold text-white"
                    >
                      <LogIn size={16} />
                      Ingresar
                    </Link>
                    <Link
                      href="/register"
                      onClick={close}
                      className="flex items-center justify-center gap-2 rounded-full border border-[#E4E4E1] bg-white px-4 py-2.5 text-sm font-semibold text-[#16181D]"
                    >
                      <UserPlus size={16} />
                      Crear cuenta
                    </Link>
                  </div>
                )}
              </div>
            </nav>
            </div>
          </>,
          document.body
        )}
    </>
  );
}
