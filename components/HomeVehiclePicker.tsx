"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Car, ArrowRight } from "lucide-react";

type Modelo = { id: string; name: string };
type Marca = { id: string; name: string; models: Modelo[] };

export function HomeVehiclePicker({ marcas }: { marcas: Marca[] }) {
  const router = useRouter();
  const [brandId, setBrandId] = useState("");
  const [modelId, setModelId] = useState("");

  const modelosDisponibles = marcas.find((m) => m.id === brandId)?.models ?? [];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (brandId) params.set("marca", brandId);
    if (modelId) params.set("modelo", modelId);
    router.push(`/buscar?${params.toString()}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto mt-8 flex max-w-xl flex-col gap-2 rounded-2xl border border-[#E4E4E1] bg-white p-3 sm:flex-row sm:items-center"
    >
      <div className="flex shrink-0 items-center gap-2 px-2 text-sm font-semibold text-[#16181D] sm:px-1">
        <Car size={18} />
        Buscá por tu auto
      </div>

      <select
        value={brandId}
        onChange={(e) => {
          setBrandId(e.target.value);
          setModelId("");
        }}
        className="flex-1 rounded-xl border border-[#E4E4E1] bg-[#F6F6F4] px-3 py-2.5 text-sm text-[#16181D] outline-none"
      >
        <option value="">Marca</option>
        {marcas.map((m) => (
          <option key={m.id} value={m.id}>
            {m.name}
          </option>
        ))}
      </select>

      <select
        value={modelId}
        onChange={(e) => setModelId(e.target.value)}
        disabled={!brandId}
        className="flex-1 rounded-xl border border-[#E4E4E1] bg-[#F6F6F4] px-3 py-2.5 text-sm text-[#16181D] outline-none disabled:opacity-50"
      >
        <option value="">Modelo</option>
        {modelosDisponibles.map((m) => (
          <option key={m.id} value={m.id}>
            {m.name}
          </option>
        ))}
      </select>

      <button
        type="submit"
        disabled={!brandId}
        className="flex shrink-0 items-center justify-center gap-1.5 rounded-xl bg-[#FF5A1F] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#e64f16] disabled:opacity-50"
      >
        Ver repuestos
        <ArrowRight size={15} />
      </button>
    </form>
  );
}
