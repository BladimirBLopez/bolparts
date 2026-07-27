"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { TapButton } from "@/components/TapButton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Modelo = { id: string; name: string };
type Marca = { id: string; name: string; models: Modelo[]; tipo: "AUTO" | "MOTO" | "CAMION" };

const CIUDADES = [
  "La Paz",
  "El Alto",
  "Santa Cruz de la Sierra",
  "Cochabamba",
  "Sucre",
  "Oruro",
  "Potosí",
  "Tarija",
  "Trinidad",
  "Cobija",
];

export function PedidoForm({
  marcas,
  defaultPhone,
}: {
  marcas: Marca[];
  defaultPhone?: string;
}) {
  const router = useRouter();
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState(defaultPhone ?? "");
  const [tipoVehiculo, setTipoVehiculo] = useState<"AUTO" | "MOTO" | "CAMION">("AUTO");
  const [brandId, setBrandId] = useState("");
  const [modelId, setModelId] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const marcasDisponibles = marcas.filter((m) => m.tipo === tipoVehiculo);
  const modelosDisponibles = marcas.find((m) => m.id === brandId)?.models ?? [];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!titulo.trim()) {
      toast.error("Decinos qué repuesto buscás");
      return;
    }
    if (!city) {
      toast.error("Elegí una ciudad");
      return;
    }
    if (!phone.trim()) {
      toast.error("Dejá tu WhatsApp para que te contacten");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/pedidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titulo,
          descripcion,
          city,
          department: city,
          phone,
          brandId: brandId || null,
          modelId: modelId || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "No se pudo publicar el pedido");
        return;
      }
      toast.success("Pedido publicado");
      router.push("/pedidos");
      router.refresh();
    } catch {
      toast.error("Error de conexión");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-6">
      <div>
        <label className="text-sm font-semibold text-[#16181D]">
          ¿Qué repuesto buscás?
        </label>
        <input
          type="text"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Ej. Pastillas de freno delanteras"
          className="mt-1.5 w-full rounded-xl border border-[#E4E4E1] bg-white px-3 py-2.5 text-sm text-[#16181D] outline-none placeholder:text-[#9CA3AF] focus:border-[#16181D]"
        />
      </div>

      <div>
        <label className="text-sm font-semibold text-[#16181D]">
          Detalles (opcional)
        </label>
        <textarea
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          rows={3}
          placeholder="Estado que buscás, marca de repuesto, urgencia, etc."
          className="mt-1.5 w-full resize-none rounded-xl border border-[#E4E4E1] bg-white px-3 py-2.5 text-sm text-[#16181D] outline-none placeholder:text-[#9CA3AF] focus:border-[#16181D]"
        />
      </div>

      <div>
        <label className="text-sm font-semibold text-[#16181D]">
          Tipo de vehículo (opcional)
        </label>
        <div className="mt-1.5 flex rounded-xl border border-[#E4E4E1] bg-white p-1">
          {(["AUTO", "MOTO", "CAMION"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => {
                setTipoVehiculo(t);
                setBrandId("");
                setModelId("");
              }}
              className={
                "flex-1 rounded-lg py-2 text-sm font-semibold transition-colors " +
                (tipoVehiculo === t
                  ? "bg-[#16181D] text-white"
                  : "text-[#6B7280]")
              }
            >
              {t === "AUTO" ? "Auto" : t === "MOTO" ? "Moto" : "Camión"}
            </button>
          ))}
        </div>
      </div>

      <div>
      <div className="flex gap-3">
        <div className="flex-1">
          <label className="text-sm font-semibold text-[#16181D]">
            Marca (opcional)
          </label>
          <Select
            value={brandId}
            onValueChange={(value) => {
              setBrandId(value ?? "");
              setModelId("");
            }}
          >
            <SelectTrigger className="mt-1.5 w-full rounded-xl border-[#E4E4E1] bg-white px-3 py-2.5 text-sm text-[#16181D]">
              <SelectValue placeholder="Cualquier marca">
                {(value: string) =>
                  marcasDisponibles.find((m) => m.id === value)?.name ??
                  "Cualquier marca"
                }
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="rounded-2xl border border-[#E4E4E1] bg-white p-1.5 shadow-lg ring-0">
              {marcasDisponibles.map((m) => (
                <SelectItem
                  key={m.id}
                  value={m.id}
                  className="rounded-xl px-3 py-2.5 text-sm data-highlighted:bg-[#FFF1EA] data-highlighted:text-[#FF5A1F]"
                >
                  {m.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1">
          <label className="text-sm font-semibold text-[#16181D]">
            Modelo (opcional)
          </label>
          <Select
            value={modelId}
            onValueChange={(value) => setModelId(value ?? "")}
            disabled={!brandId}
          >
            <SelectTrigger className="mt-1.5 w-full rounded-xl border-[#E4E4E1] bg-white px-3 py-2.5 text-sm text-[#16181D]">
              <SelectValue placeholder="Cualquier modelo">
                {(value: string) =>
                  modelosDisponibles.find((m) => m.id === value)?.name ??
                  "Cualquier modelo"
                }
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="rounded-2xl border border-[#E4E4E1] bg-white p-1.5 shadow-lg ring-0">
              {modelosDisponibles.map((m) => (
                <SelectItem
                  key={m.id}
                  value={m.id}
                  className="rounded-xl px-3 py-2.5 text-sm data-highlighted:bg-[#FFF1EA] data-highlighted:text-[#FF5A1F]"
                >
                  {m.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <p className="mt-1.5 text-xs text-[#6B7280]">
        ¿No encontrás tu marca? Podés dejarlo en blanco y contar los
        detalles en el campo de arriba.
      </p>
      </div>

      <div>
        <label className="text-sm font-semibold text-[#16181D]">Ciudad</label>
        <Select value={city} onValueChange={(value) => setCity(value ?? "")}>
          <SelectTrigger className="mt-1.5 w-full rounded-xl border-[#E4E4E1] bg-white px-3 py-2.5 text-sm text-[#16181D]">
            <SelectValue placeholder="Elegí una ciudad">
              {(value: string) => value || "Elegí una ciudad"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="rounded-2xl border border-[#E4E4E1] bg-white p-1.5 shadow-lg ring-0">
            {CIUDADES.map((c) => (
              <SelectItem
                key={c}
                value={c}
                className="rounded-xl px-3 py-2.5 text-sm data-highlighted:bg-[#FFF1EA] data-highlighted:text-[#FF5A1F]"
              >
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-semibold text-[#16181D]">
          WhatsApp de contacto
        </label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Ej. 70012345"
          className="mt-1.5 w-full rounded-xl border border-[#E4E4E1] bg-white px-3 py-2.5 text-sm text-[#16181D] outline-none placeholder:text-[#9CA3AF] focus:border-[#16181D]"
        />
        <p className="mt-1 text-xs text-[#6B7280]">
          Los vendedores con plan activo van a poder escribirte directo.
        </p>
      </div>

      <TapButton
        type="submit"
        disabled={submitting}
        className="flex items-center justify-center gap-2 rounded-full bg-[#FF5A1F] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#e64f16] disabled:opacity-60"
      >
        {submitting ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Publicando...
          </>
        ) : (
          "Publicar pedido"
        )}
      </TapButton>
    </form>
  );
}
