"use client";

import { useState } from "react";
import { Car, ChevronDown } from "lucide-react";

type Item = {
  marca?: string | null;
  modelo?: string | null;
  yearFrom?: number | null;
  yearTo?: number | null;
};

function formatAnios(item: Item) {
  if (item.yearFrom && item.yearTo) {
    return item.yearFrom === item.yearTo
      ? `${item.yearFrom}`
      : `${item.yearFrom}-${item.yearTo}`;
  }
  if (item.yearFrom) return `Desde ${item.yearFrom}`;
  if (item.yearTo) return `Hasta ${item.yearTo}`;
  return "—";
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
        <div className="border-t border-[#E4E4E1] overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
                <th className="px-4 py-2">Marca</th>
                <th className="px-4 py-2">Modelo</th>
                <th className="px-4 py-2">Años</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr
                  key={i}
                  className={i > 0 ? "border-t border-[#E4E4E1]" : ""}
                >
                  <td className="px-4 py-2 text-[#16181D]">
                    {item.marca || "—"}
                  </td>
                  <td className="px-4 py-2 text-[#16181D]">
                    {item.modelo || "—"}
                  </td>
                  <td className="px-4 py-2 text-[#6B7280]">
                    {formatAnios(item)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
