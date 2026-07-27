"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
      <Select value={brandId} onValueChange={(value) => handleMarcaChange(value ?? "")}>
        <SelectTrigger className="h-auto rounded-full border-[#E4E4E1] bg-white px-3 py-1.5 text-xs font-medium text-[#16181D]">
          <SelectValue placeholder="Cualquier marca">
            {(value: string) =>
              marcas.find((m) => m.id === value)?.name ?? "Cualquier marca"
            }
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="rounded-2xl border border-[#E4E4E1] bg-white p-1.5 shadow-lg ring-0">
          {marcas.map((m) => (
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

      <Select
        value={modelId}
        onValueChange={(value) => handleModeloChange(value ?? "")}
        disabled={!brandId}
      >
        <SelectTrigger className="h-auto rounded-full border-[#E4E4E1] bg-white px-3 py-1.5 text-xs font-medium text-[#16181D]">
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
    </>
  );
}
