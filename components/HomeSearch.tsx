"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

type Modelo = { id: string; name: string };
type Marca = {
  id: string;
  name: string;
  models: Modelo[];
  tipo: "AUTO" | "MOTO" | "CAMION";
};

const tabTriggerClass =
  "flex-1 rounded-lg py-2 text-sm font-semibold transition-colors data-active:bg-[#16181D] data-active:text-white text-[#6B7280] data-active:shadow-none";

export function HomeSearch({ marcas }: { marcas: Marca[] }) {
  const router = useRouter();

  const [query, setQuery] = useState("");

  const [tipoVehiculo, setTipoVehiculo] = useState<"AUTO" | "MOTO" | "CAMION">(
    "AUTO"
  );
  const [brandId, setBrandId] = useState("");
  const [modelId, setModelId] = useState("");
  const [modeloAbierto, setModeloAbierto] = useState(false);

  const marcasDisponibles = marcas.filter((m) => m.tipo === tipoVehiculo);
  const modelosDisponibles = marcas.find((m) => m.id === brandId)?.models ?? [];

  function handleSubmitBuscar(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    router.push(`/buscar?${params.toString()}`);
  }

  function handleSubmitVehiculo(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (brandId) params.set("marca", brandId);
    if (modelId) params.set("modelo", modelId);
    router.push(`/buscar?${params.toString()}`);
  }

  return (
    <div className="mx-auto mt-8 max-w-xl rounded-2xl border border-[#E4E4E1] bg-white p-3">
      <Tabs defaultValue="buscar">
        <TabsList className="w-full rounded-xl border border-[#E4E4E1] bg-[#F6F6F4] p-1">
          <TabsTrigger value="buscar" className={tabTriggerClass}>
            Buscar
          </TabsTrigger>
          <TabsTrigger value="vehiculo" className={tabTriggerClass}>
            Por vehículo
          </TabsTrigger>
        </TabsList>

        <TabsContent value="buscar">
          <form
            onSubmit={handleSubmitBuscar}
            className="mt-3 flex items-center gap-2 rounded-full border border-[#E4E4E1] bg-white p-1.5"
          >
            <Search size={18} className="ml-3 shrink-0 text-[#6B7280]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ej. pastillas de freno, cadena de moto, filtro de camión"
              className="w-full bg-transparent py-2 text-sm text-[#16181D] outline-none placeholder:text-[#9CA3AF]"
            />
            <button
              type="submit"
              className="shrink-0 rounded-full bg-[#FF5A1F] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#e64f16]"
            >
              Buscar
            </button>
          </form>
        </TabsContent>

        <TabsContent value="vehiculo">
          <form onSubmit={handleSubmitVehiculo} className="mt-3 flex flex-col gap-3">
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
                  if (value) {
                    setTimeout(() => setModeloAbierto(true), 150);
                  }
                }}
              >
                <SelectTrigger className="w-full flex-1 rounded-xl border-[#E4E4E1] bg-[#F6F6F4] px-3 py-2.5 text-sm text-[#16181D]">
                  <SelectValue placeholder="Marca">
                    {(value: string) =>
                      marcasDisponibles.find((m) => m.id === value)?.name ?? "Marca"
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

              <Select
                value={modelId}
                onValueChange={(value) => setModelId(value ?? "")}
                disabled={!brandId}
                open={modeloAbierto}
                onOpenChange={setModeloAbierto}
              >
                <SelectTrigger className="w-full flex-1 rounded-xl border-[#E4E4E1] bg-[#F6F6F4] px-3 py-2.5 text-sm text-[#16181D]">
                  <SelectValue placeholder="Modelo">
                    {(value: string) =>
                      modelosDisponibles.find((m) => m.id === value)?.name ?? "Modelo"
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
