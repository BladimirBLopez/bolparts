"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { TapButton } from "@/components/TapButton";
import { useRouter } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Categoria = { id: string; name: string; slug: string };
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

export function SearchFilters({
  categorias,
  marcas,
  current,
}: {
  categorias: Categoria[];
  marcas: Marca[];
  current: {
    q?: string;
    categoria?: string;
    ciudad?: string;
    condicion?: string;
    orden?: string;
    marca?: string;
    modelo?: string;
  };
}) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);

  const [categoria, setCategoria] = useState(current.categoria || "");
  const initialTipoVehiculo =
    marcas.find((m) => m.id === current.marca)?.tipo ?? "AUTO";
  const [tipoVehiculo, setTipoVehiculo] = useState<"AUTO" | "MOTO" | "CAMION">(
    initialTipoVehiculo
  );
  const [marca, setMarca] = useState(current.marca || "");
  const [modelo, setModelo] = useState(current.modelo || "");
  const [ciudad, setCiudad] = useState(current.ciudad || "");
  const [condicion, setCondicion] = useState(current.condicion || "");
  const [orden, setOrden] = useState(current.orden || "");

  useEffect(() => setMounted(true), []);

  const modelosDisponibles = marcas.find((m) => m.id === marca)?.models ?? [];
  const marcasDisponibles = marcas.filter((m) => m.tipo === tipoVehiculo);

  const activeCount = [
    categoria,
    marca,
    modelo,
    ciudad,
    condicion,
    orden && orden !== "recientes" ? orden : "",
  ].filter(Boolean).length;

  function aplicar() {
    const params = new URLSearchParams();
    if (current.q) params.set("q", current.q);
    if (categoria) params.set("categoria", categoria);
    if (marca) params.set("marca", marca);
    if (modelo) params.set("modelo", modelo);
    if (ciudad) params.set("ciudad", ciudad);
    if (condicion) params.set("condicion", condicion);
    if (orden && orden !== "recientes") params.set("orden", orden);
    router.push(`/buscar?${params.toString()}`);
    setOpen(false);
  }

  function limpiar() {
    setCategoria("");
    setMarca("");
    setModelo("");
    setCiudad("");
    setCondicion("");
    setOrden("");
    const params = new URLSearchParams();
    if (current.q) params.set("q", current.q);
    router.push(`/buscar?${params.toString()}`);
    setOpen(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-full border border-[#E4E4E1] bg-white px-4 py-2 text-sm font-semibold text-[#16181D] transition-colors hover:border-[#16181D]"
      >
        <SlidersHorizontal size={15} />
        Filtros
        {activeCount > 0 && (
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#FF5A1F] text-[11px] font-bold text-white">
            {activeCount}
          </span>
        )}
      </button>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && (
              <>
                <motion.button
                  type="button"
                  aria-label="Cerrar filtros"
                  onClick={() => setOpen(false)}
                  className="fixed inset-0 z-[100] bg-black/40"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />

                <motion.div
                  className="fixed inset-x-0 bottom-0 z-[101] flex max-h-[85vh] flex-col rounded-t-3xl bg-[#F6F6F4] shadow-xl"
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                >
              <div className="flex shrink-0 items-center justify-between border-b border-[#E4E4E1] px-5 py-4">
                <p className="text-base font-extrabold text-[#16181D]">Filtros</p>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Cerrar"
                  className="text-[#6B7280]"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-5 py-4">
                {/* Categoría */}
                <p className="text-sm font-semibold text-[#16181D]">Categoría</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setCategoria("")}
                    className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                      !categoria
                        ? "border-[#16181D] bg-[#16181D] text-white"
                        : "border-[#E4E4E1] bg-white text-[#16181D]"
                    }`}
                  >
                    Todas
                  </button>
                  {categorias.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setCategoria(c.slug)}
                      className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                        categoria === c.slug
                          ? "border-[#16181D] bg-[#16181D] text-white"
                          : "border-[#E4E4E1] bg-white text-[#16181D]"
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>

                {/* Vehículo */}
                <p className="mt-6 text-sm font-semibold text-[#16181D]">Vehículo</p>
                <div className="mt-2 flex rounded-xl border border-[#E4E4E1] bg-white p-1">
                  {(["AUTO", "MOTO", "CAMION"] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => {
                        setTipoVehiculo(t);
                        setMarca("");
                        setModelo("");
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
                <div className="mt-2 flex gap-2">
                  <Select
                    value={marca}
                    onValueChange={(value) => {
                      setMarca(value ?? "");
                      setModelo("");
                    }}
                  >
                    <SelectTrigger className="w-full flex-1 rounded-xl border-[#E4E4E1] bg-white px-3 py-2.5 text-sm text-[#16181D]">
                      <SelectValue placeholder="Cualquier marca">
                        {(value: string) =>
                          marcasDisponibles.find((m) => m.id === value)
                            ?.name ?? "Cualquier marca"
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
                    value={modelo}
                    onValueChange={(value) => setModelo(value ?? "")}
                    disabled={!marca}
                  >
                    <SelectTrigger className="w-full flex-1 rounded-xl border-[#E4E4E1] bg-white px-3 py-2.5 text-sm text-[#16181D]">
                      <SelectValue placeholder="Cualquier modelo">
                        {(value: string) =>
                          modelosDisponibles.find((m) => m.id === value)
                            ?.name ?? "Cualquier modelo"
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

                {/* Ciudad */}
                <p className="mt-6 text-sm font-semibold text-[#16181D]">Ciudad</p>
                <Select
                  value={ciudad}
                  onValueChange={(value) => setCiudad(value ?? "")}
                >
                  <SelectTrigger className="mt-2 w-full rounded-xl border-[#E4E4E1] bg-white px-3 py-2.5 text-sm text-[#16181D]">
                    <SelectValue placeholder="Todas las ciudades">
                      {(value: string) => value || "Todas las ciudades"}
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

                {/* Condición */}
                <p className="mt-6 text-sm font-semibold text-[#16181D]">Condición</p>
                <div className="mt-2 flex gap-2">
                  {[
                    { value: "", label: "Nuevo y usado" },
                    { value: "NEW", label: "Nuevo" },
                    { value: "USED", label: "Usado" },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setCondicion(opt.value)}
                      className={`flex-1 rounded-xl border px-3 py-2.5 text-sm font-medium ${
                        condicion === opt.value
                          ? "border-[#16181D] bg-[#16181D] text-white"
                          : "border-[#E4E4E1] bg-white text-[#16181D]"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                {/* Orden */}
                <p className="mt-6 text-sm font-semibold text-[#16181D]">Ordenar por</p>
                <Select
                  value={orden}
                  onValueChange={(value) => setOrden(value ?? "")}
                >
                  <SelectTrigger className="mt-2 w-full rounded-xl border-[#E4E4E1] bg-white px-3 py-2.5 text-sm text-[#16181D]">
                    <SelectValue placeholder="Más recientes">
                      {(value: string) =>
                        value === "precio_asc"
                          ? "Menor precio"
                          : value === "precio_desc"
                          ? "Mayor precio"
                          : "Más recientes"
                      }
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border border-[#E4E4E1] bg-white p-1.5 shadow-lg ring-0">
                    <SelectItem
                      value="recientes"
                      className="rounded-xl px-3 py-2.5 text-sm data-highlighted:bg-[#FFF1EA] data-highlighted:text-[#FF5A1F]"
                    >
                      Más recientes
                    </SelectItem>
                    <SelectItem
                      value="precio_asc"
                      className="rounded-xl px-3 py-2.5 text-sm data-highlighted:bg-[#FFF1EA] data-highlighted:text-[#FF5A1F]"
                    >
                      Menor precio
                    </SelectItem>
                    <SelectItem
                      value="precio_desc"
                      className="rounded-xl px-3 py-2.5 text-sm data-highlighted:bg-[#FFF1EA] data-highlighted:text-[#FF5A1F]"
                    >
                      Mayor precio
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex shrink-0 gap-2 border-t border-[#E4E4E1] p-4">
                <button
                  type="button"
                  onClick={limpiar}
                  className="flex-1 rounded-full border border-[#E4E4E1] bg-white px-4 py-3 text-sm font-semibold text-[#16181D]"
                >
                  Limpiar
                </button>
                <TapButton
                  type="button"
                  onClick={aplicar}
                  className="flex-1 rounded-full bg-[#FF5A1F] px-4 py-3 text-sm font-semibold text-white"
                >
                  Aplicar filtros
                </TapButton>
              </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}
