"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Modelo = { id: string; name: string };
type Marca = { id: string; name: string; models: Modelo[] };

export function VehicleFilter({ marcas }: { marcas: Marca[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [brandId, setBrandId] = useState(searchParams.get("marca") || "");
  const [modelId, setModelId] = useState(searchParams.get("modelo") || "");

  const modelosDisponibles = marcas.find((m) => m.id === brandId)?.models ?? [];

  function aplicarFiltro(nuevaMarca: string, nuevoModelo: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (nuevaMarca) params.set("marca", nuevaMarca);
    else params.delete("marca");

    if (nuevoModelo) params.set("modelo", nuevoModelo);
    else params.delete("modelo");

    params.delete("pagina");

    router.push(`/buscar?${params.toString()}`);
  }

  function handleMarcaChange(value: string) {
    setBrandId(value);
    setModelId("");
    aplicarFiltro(value, "");
  }

  function handleModeloChange(value: string) {
    setModelId(value);
    aplicarFiltro(brandId, value);
  }

  return (
    <>
      <select
        value={brandId}
        onChange={(e) => handleMarcaChange(e.target.value)}
        className="rounded-full border border-[#E4E4E1] bg-white px-3 py-1.5 text-xs font-medium text-[#16181D] outline-none"
      >
        <option value="">Cualquier marca</option>
        {marcas.map((m) => (
          <option key={m.id} value={m.id}>
            {m.name}
          </option>
        ))}
      </select>

      <select
        value={modelId}
        onChange={(e) => handleModeloChange(e.target.value)}
        disabled={!brandId}
        className="rounded-full border border-[#E4E4E1] bg-white px-3 py-1.5 text-xs font-medium text-[#16181D] outline-none disabled:opacity-50"
      >
        <option value="">Cualquier modelo</option>
        {modelosDisponibles.map((m) => (
          <option key={m.id} value={m.id}>
            {m.name}
          </option>
        ))}
      </select>
    </>
  );
}
