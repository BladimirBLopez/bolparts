"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { SlidersHorizontal, X, ChevronDown } from "lucide-react";

type Categoria = { id: string; name: string; slug: string };
type Modelo = { id: string; name: string };
type Marca = { id: string; name: string; models: Modelo[] };

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
  const [marca, setMarca] = useState(current.marca || "");
  const [modelo, setModelo] = useState(current.modelo || "");
  const [ciudad, setCiudad] = useState(current.ciudad || "");
  const [condicion, setCondicion] = useState(current.condicion || "");
  const [orden, setOrden] = useState(current.orden || "");

  useEffect(() => setMounted(true), []);

  const modelosDisponibles = marcas.find((m) => m.id === marca)?.models ?? [];

  const activeCount = [categoria, marca, modelo, ciudad, condicion, orden].filter(
    Boolean
  ).length;

  function aplicar() {
    const params = new URLSearchParams();
    if (current.q) params.set("q", current.q);
    if (categoria) params.set("categoria", categoria);
    if (marca) params.set("marca", marca);
    if (modelo) params.set("modelo", modelo);
    if (ciudad) params.set("ciudad", ciudad);
    if (condicion) params.set("condicion", condicion);
    if (orden) params.set("orden", orden);
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

      {open &&
        mounted &&
        createPortal(
          <>
            <button
              type="button"
              aria-label="Cerrar filtros"
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-[100] bg-black/40"
            />

            <div className="fixed inset-x-0 bottom-0 z-[101] flex max-h-[85vh] flex-col rounded-t-3xl bg-[#F6F6F4] shadow-xl">
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
                <div className="mt-2 flex gap-2">
                  <div className="relative flex-1">
                    <select
                      value={marca}
                      onChange={(e) => {
                        setMarca(e.target.value);
                        setModelo("");
                      }}
                      className="w-full appearance-none rounded-xl border border-[#E4E4E1] bg-white px-3 py-2.5 pr-9 text-sm text-[#16181D] outline-none"
                    >
                      <option value="">Cualquier marca</option>
                      {marcas.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={16}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280]"
                    />
                  </div>
                  <div className="relative flex-1">
                    <select
                      value={modelo}
                      onChange={(e) => setModelo(e.target.value)}
                      disabled={!marca}
                      className="w-full appearance-none rounded-xl border border-[#E4E4E1] bg-white px-3 py-2.5 pr-9 text-sm text-[#16181D] outline-none disabled:opacity-50"
                    >
                      <option value="">Cualquier modelo</option>
                      {modelosDisponibles.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={16}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280]"
                    />
                  </div>
                </div>

                {/* Ciudad */}
                <p className="mt-6 text-sm font-semibold text-[#16181D]">Ciudad</p>
                <div className="relative mt-2">
                  <select
                    value={ciudad}
                    onChange={(e) => setCiudad(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-[#E4E4E1] bg-white px-3 py-2.5 pr-9 text-sm text-[#16181D] outline-none"
                  >
                    <option value="">Todas las ciudades</option>
                    {CIUDADES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={16}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280]"
                  />
                </div>

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
                <div className="relative mt-2">
                  <select
                    value={orden}
                    onChange={(e) => setOrden(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-[#E4E4E1] bg-white px-3 py-2.5 pr-9 text-sm text-[#16181D] outline-none"
                  >
                    <option value="">Más recientes</option>
                    <option value="precio_asc">Menor precio</option>
                    <option value="precio_desc">Mayor precio</option>
                  </select>
                  <ChevronDown
                    size={16}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280]"
                  />
                </div>
              </div>

              <div className="flex shrink-0 gap-2 border-t border-[#E4E4E1] p-4">
                <button
                  type="button"
                  onClick={limpiar}
                  className="flex-1 rounded-full border border-[#E4E4E1] bg-white px-4 py-3 text-sm font-semibold text-[#16181D]"
                >
                  Limpiar
                </button>
                <button
                  type="button"
                  onClick={aplicar}
                  className="flex-1 rounded-full bg-[#FF5A1F] px-4 py-3 text-sm font-semibold text-white"
                >
                  Aplicar filtros
                </button>
              </div>
            </div>
          </>,
          document.body
        )}
    </>
  );
}
