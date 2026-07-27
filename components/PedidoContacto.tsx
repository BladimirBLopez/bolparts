"use client";

import Link from "next/link";
import { MessageCircle, Lock } from "lucide-react";

export function PedidoContacto({
  tienePlanActivo,
  loggedIn,
  phone,
  titulo,
}: {
  tienePlanActivo: boolean;
  loggedIn: boolean;
  phone: string | null;
  titulo: string;
}) {
  if (!loggedIn) {
    return (
      <Link
        href="/login"
        className="flex items-center justify-center gap-2 rounded-full border border-[#E4E4E1] bg-white px-4 py-2 text-sm font-semibold text-[#16181D]"
      >
        <Lock size={14} />
        Iniciá sesión para contactar
      </Link>
    );
  }

  if (!tienePlanActivo) {
    return (
      <Link
        href="/planes"
        className="flex items-center justify-center gap-2 rounded-full border border-[#E4E4E1] bg-white px-4 py-2 text-sm font-semibold text-[#6B7280]"
      >
        <Lock size={14} />
        Destacá tu cuenta para contactar
      </Link>
    );
  }

  if (!phone) {
    return (
      <p className="text-center text-xs text-[#6B7280]">
        El comprador no dejó un número de contacto.
      </p>
    );
  }

  return (
    <a
      href={`https://wa.me/591${phone.replace(/\D/g, "")}?text=${encodeURIComponent(
        `Hola, vi tu pedido "${titulo}" en BolParts y tengo ese repuesto.`
      )}`}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center gap-2 rounded-full bg-green-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-700"
    >
      <MessageCircle size={16} />
      Contactar por WhatsApp
    </a>
  );
}
