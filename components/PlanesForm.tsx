"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Check, Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
import { TapButton } from "@/components/TapButton";

const PLANES = [
  {
    nivel: "DESTACADO" as const,
    nombre: "Destacado",
    precio: 30,
    beneficios: ["Aparece antes que las publicaciones gratis", "Badge ★ Destacado visible"],
  },
  {
    nivel: "SUPERIOR" as const,
    nombre: "Superior",
    precio: 60,
    beneficios: ["Aparece primero que todo", "Badge ★ Superior visible", "Máxima visibilidad"],
  },
];

function formatFecha(iso: string) {
  return new Intl.DateTimeFormat("es-BO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}

export function PlanesForm({
  nivelActual,
  planExpiraEn,
  solicitudPendiente,
}: {
  nivelActual: "NINGUNO" | "DESTACADO" | "SUPERIOR";
  planExpiraEn: string | null;
  solicitudPendiente: boolean;
}) {
  const router = useRouter();
  const [nivelElegido, setNivelElegido] = useState<"DESTACADO" | "SUPERIOR" | null>(null);
  const [comprobanteUrl, setComprobanteUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "No se pudo subir el comprobante");
      } else {
        setComprobanteUrl(data.url);
      }
    } catch {
      toast.error("Error de conexión al subir el comprobante");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function handleSubmit() {
    if (!nivelElegido) {
      toast.error("Elegí un plan");
      return;
    }
    if (!comprobanteUrl) {
      toast.error("Subí una foto del comprobante de pago");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/solicitudes-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nivel: nivelElegido, comprobanteUrl }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "No se pudo enviar la solicitud");
        return;
      }
      toast.success("Solicitud enviada, la revisamos pronto");
      router.push("/mis-publicaciones");
      router.refresh();
    } catch {
      toast.error("Error de conexión");
    } finally {
      setSubmitting(false);
    }
  }

  if (solicitudPendiente) {
    return (
      <div className="mt-6 rounded-2xl border border-[#E4E4E1] bg-white p-5 text-center">
        <p className="text-sm font-semibold text-[#16181D]">
          Tenés una solicitud en revisión
        </p>
        <p className="mt-1 text-xs text-[#6B7280]">
          Te vamos a avisar apenas la aprobemos. Puede tardar unas horas.
        </p>
      </div>
    );
  }

  if (nivelActual !== "NINGUNO") {
    return (
      <div className="mt-6 rounded-2xl border border-[#E4E4E1] bg-white p-5 text-center">
        <p className="text-sm font-semibold text-[#16181D]">
          Ya tenés el plan {nivelActual === "SUPERIOR" ? "Superior" : "Destacado"} activo
        </p>
        {planExpiraEn && (
          <p className="mt-1 text-xs text-[#6B7280]">
            Vence el {formatFecha(planExpiraEn)}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="mt-6 flex flex-col gap-6">
      {/* Elegir plan */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {PLANES.map((plan) => (
          <button
            key={plan.nivel}
            type="button"
            onClick={() => setNivelElegido(plan.nivel)}
            className={`rounded-2xl border-2 p-5 text-left transition-colors ${
              nivelElegido === plan.nivel
                ? "border-[#FF5A1F] bg-white"
                : "border-[#E4E4E1] bg-white"
            }`}
          >
            <div className="flex items-center justify-between">
              <p className="text-base font-extrabold text-[#16181D]">
                {plan.nombre}
              </p>
              {nivelElegido === plan.nivel && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#FF5A1F] text-white">
                  <Check size={12} />
                </span>
              )}
            </div>
            <p className="mt-1 text-2xl font-extrabold text-[#16181D]">
              Bs. {plan.precio}
              <span className="text-sm font-normal text-[#6B7280]">/mes</span>
            </p>
            <ul className="mt-3 flex flex-col gap-1.5">
              {plan.beneficios.map((b) => (
                <li key={b} className="flex items-start gap-1.5 text-xs text-[#6B7280]">
                  <Check size={13} className="mt-0.5 shrink-0 text-[#FF5A1F]" />
                  {b}
                </li>
              ))}
            </ul>
          </button>
        ))}
      </div>

      {/* Pago */}
      {nivelElegido && (
        <div className="rounded-2xl border border-[#E4E4E1] bg-white p-5">
          <p className="text-sm font-semibold text-[#16181D]">
            Escaneá el QR y pagá Bs. {PLANES.find((p) => p.nivel === nivelElegido)?.precio}
          </p>
          <div className="mt-3 flex justify-center">
            <div className="relative h-56 w-56 overflow-hidden rounded-xl border border-[#E4E4E1]">
              <Image
                src="/qr-pago.png"
                alt="QR de pago"
                fill
                sizes="224px"
                className="object-contain"
              />
            </div>
          </div>

          <p className="mt-4 text-sm font-semibold text-[#16181D]">
            Subí una foto del comprobante
          </p>
          <div className="mt-2">
            {comprobanteUrl ? (
              <div className="relative h-32 w-32 overflow-hidden rounded-xl border border-[#E4E4E1]">
                <Image
                  src={comprobanteUrl}
                  alt="Comprobante"
                  fill
                  sizes="128px"
                  className="object-cover"
                />
              </div>
            ) : (
              <label className="flex h-32 w-32 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-[#E4E4E1] bg-[#F6F6F4] text-[#6B7280] transition-colors hover:border-[#16181D]">
                {uploading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <Upload size={18} />
                )}
                <span className="text-[11px]">Subir foto</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                  disabled={uploading}
                />
              </label>
            )}
          </div>

          <TapButton
            type="button"
            onClick={handleSubmit}
            disabled={submitting || uploading || !comprobanteUrl}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-[#FF5A1F] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#e64f16] disabled:opacity-60"
          >
            {submitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Enviando...
              </>
            ) : (
              "Enviar comprobante"
            )}
          </TapButton>
        </div>
      )}
    </div>
  );
}
