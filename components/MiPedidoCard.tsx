"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check, Trash2, MapPin } from "lucide-react";

export function MiPedidoCard({
  id,
  titulo,
  city,
  estado,
}: {
  id: string;
  titulo: string;
  city: string;
  estado: "ABIERTO" | "RESUELTO";
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function marcarResuelto() {
    setLoading(true);
    const res = await fetch(`/api/pedidos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estado: "RESUELTO" }),
    });
    const data = await res.json();
    setLoading(false);
    if (!data.ok) {
      toast.error(data.error || "No se pudo actualizar el pedido");
      return;
    }
    toast.success("Marcado como resuelto");
    router.refresh();
  }

  async function borrar() {
    setLoading(true);
    const res = await fetch(`/api/pedidos/${id}`, { method: "DELETE" });
    const data = await res.json();
    setLoading(false);
    if (!data.ok) {
      toast.error(data.error || "No se pudo borrar el pedido");
      return;
    }
    toast.success("Pedido borrado");
    router.refresh();
  }

  return (
    <div className="rounded-2xl border border-[#E4E4E1] bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-semibold text-[#16181D]">{titulo}</p>
          <p className="mt-0.5 flex items-center gap-1 text-xs text-[#6B7280]">
            <MapPin size={12} />
            {city}
          </p>
        </div>
        <span
          className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
            estado === "ABIERTO"
              ? "bg-[#FFF1EA] text-[#FF5A1F]"
              : "bg-green-50 text-green-700"
          }`}
        >
          {estado === "ABIERTO" ? "Abierto" : "Resuelto"}
        </span>
      </div>

      {estado === "ABIERTO" && (
        <div className="mt-3 flex gap-2">
          <button
            onClick={marcarResuelto}
            disabled={loading}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-green-600 px-3 py-2 text-xs font-semibold text-white disabled:opacity-50"
          >
            <Check size={13} />
            Marcar resuelto
          </button>
          <button
            onClick={borrar}
            disabled={loading}
            className="flex items-center justify-center gap-1.5 rounded-lg border border-[#E4E4E1] px-3 py-2 text-xs font-semibold text-[#16181D] disabled:opacity-50"
          >
            <Trash2 size={13} />
          </button>
        </div>
      )}
    </div>
  );
}
