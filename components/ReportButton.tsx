"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { Flag, X, Loader2 } from "lucide-react";

const RAZONES = [
  { value: "FAKE", label: "Publicación falsa o engañosa" },
  { value: "SOLD", label: "Ya se vendió, sigue publicado" },
  { value: "INAPPROPRIATE", label: "Contenido inapropiado" },
  { value: "SCAM", label: "Posible estafa" },
  { value: "OTHER", label: "Otro motivo" },
];

export function ReportButton({
  listingId,
  loggedIn,
}: {
  listingId: string;
  loggedIn: boolean;
}) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => setMounted(true), []);

  function abrir() {
    if (!loggedIn) {
      router.push("/login");
      return;
    }
    setOpen(true);
  }

  async function enviar() {
    if (!reason) return;
    setSubmitting(true);
    try {
      await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId, reason, details }),
      });
      setSent(true);
    } catch {
      // silencioso, no es crítico
    } finally {
      setSubmitting(false);
    }
  }

  function cerrar() {
    setOpen(false);
    setReason("");
    setDetails("");
    setSent(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={abrir}
        className="flex items-center gap-1.5 text-xs font-medium text-[#6B7280] hover:text-[#16181D]"
      >
        <Flag size={13} />
        Reportar publicación
      </button>

      {open &&
        mounted &&
        createPortal(
          <>
            <button
              type="button"
              aria-label="Cerrar"
              onClick={cerrar}
              className="fixed inset-0 z-[100] bg-black/40"
            />
            <div className="fixed inset-x-4 top-1/2 z-[101] mx-auto max-w-sm -translate-y-1/2 rounded-2xl bg-white p-5 shadow-xl">
              {sent ? (
                <div className="flex flex-col items-center gap-2 py-4 text-center">
                  <p className="text-sm font-semibold text-[#16181D]">
                    Gracias por avisarnos
                  </p>
                  <p className="text-xs text-[#6B7280]">
                    Vamos a revisar esta publicación.
                  </p>
                  <button
                    type="button"
                    onClick={cerrar}
                    className="mt-3 rounded-full bg-[#16181D] px-5 py-2 text-sm font-semibold text-white"
                  >
                    Cerrar
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-[#16181D]">
                      Reportar publicación
                    </p>
                    <button
                      type="button"
                      onClick={cerrar}
                      aria-label="Cerrar"
                      className="text-[#6B7280]"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <div className="mt-3 flex flex-col gap-1.5">
                    {RAZONES.map((r) => (
                      <button
                        key={r.value}
                        type="button"
                        onClick={() => setReason(r.value)}
                        className={`rounded-xl border px-3 py-2.5 text-left text-sm ${
                          reason === r.value
                            ? "border-[#16181D] bg-[#16181D] text-white"
                            : "border-[#E4E4E1] bg-white text-[#16181D]"
                        }`}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>

                  <textarea
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    rows={2}
                    placeholder="Detalles adicionales (opcional)"
                    className="mt-3 w-full resize-none rounded-xl border border-[#E4E4E1] bg-[#F6F6F4] px-3 py-2 text-sm text-[#16181D] outline-none placeholder:text-[#9CA3AF]"
                  />

                  <button
                    type="button"
                    onClick={enviar}
                    disabled={!reason || submitting}
                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-[#FF5A1F] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
                  >
                    {submitting && <Loader2 size={14} className="animate-spin" />}
                    Enviar reporte
                  </button>
                </>
              )}
            </div>
          </>,
          document.body
        )}
    </>
  );
}
