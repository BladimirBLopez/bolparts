"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Car, ArrowRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Modelo = { id: string; name: string };
type Marca = {
  id: string;
  name: string;
  models: Modelo[];
  tipo: "AUTO" | "MOTO" | "CAMION";
};

export function HomeVehiclePicker({ marcas }: { marcas: Marca[] }) {
  const router = useRouter();
  const [tipoVehiculo, setTipoVehiculo] = useState<"AUTO" | "MOTO" | "CAMION">(
    "AUTO"
  );
  const [brandId, setBrandId] = useState("");
  const [modelId, setModelId] = useState("");

  const marcasDisponibles = marcas.filter((m) => m.tipo === tipoVehiculo);
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
      className="mx-auto mt-8 flex max-w-xl flex-col gap-3 rounded-2xl border border-[#E4E4E1] bg-white p-3"
    >
      <div className="flex items-center gap-2 px-2 text-sm font-semibold text-[#16181D] sm:px-1">
        <Car size={18} />
        Buscá por tu vehículo
      </div>

      <div className="flex rounded-xl border border-[#E4E4E1] bg-[#F6F6F4] p-1">
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

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <Select
        value={brandId}
        onValueChange={(value) => {
          setBrandId(value ?? "");
          setModelId("");
        }}
      >
        <SelectTrigger className="w-full flex-1 rounded-xl border-[#E4E4E1] bg-[#F6F6F4] px-3 py-2.5 text-sm text-[#16181D]">
          <SelectValue placeholder="Marca" />
        </SelectTrigger>
        <SelectContent>
          {marcasDisponibles.map((m) => (
            <SelectItem key={m.id} value={m.id}>
              {m.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={modelId}
        onValueChange={(value) => setModelId(value ?? "")}
        disabled={!brandId}
      >
        <SelectTrigger className="w-full flex-1 rounded-xl border-[#E4E4E1] bg-[#F6F6F4] px-3 py-2.5 text-sm text-[#16181D]">
          <SelectValue placeholder="Modelo" />
        </SelectTrigger>
        <SelectContent>
          {modelosDisponibles.map((m) => (
            <SelectItem key={m.id} value={m.id}>
              {m.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <button
        type="submit"
        disabled={!brandId}
        className="flex shrink-0 items-center justify-center gap-1.5 rounded-xl bg-[#FF5A1F] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#e64f16] disabled:opacity-50"
      >
        Ver repuestos
        <ArrowRight size={15} />
      </button>
      </div>
    </form>
  );
}
