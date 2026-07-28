"use client";

import { useState } from "react";
import { Car, ChevronDown } from "lucide-react";

type Item = {
  marca?: string | null;
  modelo?: string | null;
  yearFrom?: number | null;
  yearTo?: number | null;
};

function formatItem(item: Item) {
  const partes = [item.marca, item.modelo].filter(Boolean).join(" ");
  const anios =
    item.yearFrom && item.yearTo
      ? item.yearFrom === item.yearTo
        ? `${item.yearFrom}`
        : `${item.yearFrom}-${item.yearTo}`
      : item.yearFrom
      ? `Desde ${item.yearFrom}`
      : item.yearTo
      ? `Hasta ${item.yearTo}`
      : "";
  return [partes, anios].filter(Boolean).join(" · ") || "Sin especificar";
}

export function CompatibilidadesToggle({ items }: { items: Item[] }) {
  const [abierto, setAbierto] = useState(false);

  if (items.length === 0) return null;

  return (
    <div className="mt-4 rounded-2xl border border-[#E4E4E1] bg-white">
      <button
        type="button"
        onClick={() => setAbierto((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-3 text-left"
      >
        <span className="flex items-center gap-2 text-sm font-semibold text-[#16181D]">
          <Car size={16} />
          Ver vehículos compatibles ({items.length})
        </span>
        <ChevronDown
          size={16}
          className={`text-[#6B7280] transition-transform ${
            abierto ? "rotate-180" : ""
          }`}
        />
      </button>
      {abierto && (
        <ul className="flex flex-col gap-1.5 border-t border-[#E4E4E1] px-4 py-3">
          {items.map((item, i) => (
            <li key={i} className="text-sm text-[#6B7280]">
              {formatItem(item)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
