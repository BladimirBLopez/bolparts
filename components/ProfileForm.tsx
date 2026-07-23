"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { User as UserIcon, Upload, Loader2 } from "lucide-react";
import { LocationPicker } from "@/components/LocationPicker";

export function ProfileForm({
  initialName,
  initialImage,
  initialPhone,
  email,
  initialBusinessBanner,
  initialBusinessDescription,
  initialBusinessHours,
  initialBusinessAddress,
  initialLatitude,
  initialLongitude,
}: {
  initialName: string;
  initialImage: string | null;
  initialPhone: string | null;
  email: string;
  initialBusinessBanner?: string | null;
  initialBusinessDescription?: string | null;
  initialBusinessHours?: string | null;
  initialBusinessAddress?: string | null;
  initialLatitude?: number | null;
  initialLongitude?: number | null;
}) {
  const { update } = useSession();
  const router = useRouter();

  const [name, setName] = useState(initialName);
  const [image, setImage] = useState(initialImage || "");
  const [phone, setPhone] = useState(initialPhone || "");
  const [uploading, setUploading] = useState(false);

  const [businessBanner, setBusinessBanner] = useState(initialBusinessBanner || "");
  const [businessDescription, setBusinessDescription] = useState(initialBusinessDescription || "");
  const [businessHours, setBusinessHours] = useState(initialBusinessHours || "");
  const [businessAddress, setBusinessAddress] = useState(initialBusinessAddress || "");
  const [latitude, setLatitude] = useState<number | null>(initialLatitude ?? null);
  const [longitude, setLongitude] = useState<number | null>(initialLongitude ?? null);
  const [uploadingBanner, setUploadingBanner] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "No se pudo subir la foto");
      } else {
        setImage(data.url);
      }
    } catch {
      setError("Error de conexión al subir la foto");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function handleBannerChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingBanner(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "No se pudo subir el banner");
      } else {
        setBusinessBanner(data.url);
      }
    } catch {
      setError("Error de conexión al subir el banner");
    } finally {
      setUploadingBanner(false);
      e.target.value = "";
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!name.trim()) {
      setError("El nombre no puede estar vacío");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          image,
          phone,
          businessBanner,
          businessDescription,
          businessHours,
          businessAddress,
          latitude,
          longitude,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "No se pudo actualizar el perfil");
        setSubmitting(false);
        return;
      }

      await update({ name, image });
      setSuccess(true);
      router.refresh();
    } catch {
      setError("Error de conexión");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-6">
      {/* Foto */}
      <div className="flex items-center gap-4">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#16181D] text-white">
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image} alt="" className="h-full w-full object-cover" />
          ) : (
            <UserIcon size={28} />
          )}
        </div>
        <label className="flex cursor-pointer items-center gap-2 rounded-full border border-[#E4E4E1] bg-white px-4 py-2 text-sm font-semibold text-[#16181D] transition-colors hover:border-[#16181D]">
          {uploading ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <Upload size={15} />
          )}
          Cambiar foto
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            disabled={uploading}
          />
        </label>
      </div>

      {/* Email (solo lectura) */}
      <div>
        <label className="text-sm font-semibold text-[#16181D]">Email</label>
        <input
          type="email"
          value={email}
          disabled
          className="mt-1.5 w-full rounded-xl border border-[#E4E4E1] bg-[#F6F6F4] px-3 py-2.5 text-sm text-[#6B7280] outline-none"
        />
      </div>

      {/* Nombre */}
      <div>
        <label className="text-sm font-semibold text-[#16181D]">Nombre</label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1.5 w-full rounded-xl border border-[#E4E4E1] bg-white px-3 py-2.5 text-sm text-[#16181D] outline-none focus:border-[#16181D]"
        />
      </div>

      {/* Teléfono */}
      <div>
        <label className="text-sm font-semibold text-[#16181D]">
          WhatsApp de contacto
        </label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Ej. 70012345"
          className="mt-1.5 w-full rounded-xl border border-[#E4E4E1] bg-white px-3 py-2.5 text-sm text-[#16181D] outline-none placeholder:text-[#9CA3AF] focus:border-[#16181D]"
        />
        <p className="mt-1 text-xs text-[#6B7280]">
          Se va a usar como número por defecto al publicar un repuesto.
        </p>
      </div>

      {/* Sección negocio */}
      <div className="border-t border-[#E4E4E1] pt-6">
        <h2 className="text-base font-extrabold text-[#16181D]">
          Info de tu negocio (opcional)
        </h2>
        <p className="mt-1 text-xs text-[#6B7280]">
          Se muestra en tu perfil público de vendedor.
        </p>

        {/* Banner */}
        <div className="mt-4">
          <label className="text-sm font-semibold text-[#16181D]">
            Banner
          </label>
          <div className="mt-1.5 flex h-28 w-full items-center justify-center overflow-hidden rounded-xl border border-[#E4E4E1] bg-[#F6F6F4]">
            {businessBanner ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={businessBanner}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-xs text-[#6B7280]">Sin banner</span>
            )}
          </div>
          <label className="mt-2 flex w-fit cursor-pointer items-center gap-2 rounded-full border border-[#E4E4E1] bg-white px-4 py-2 text-sm font-semibold text-[#16181D] transition-colors hover:border-[#16181D]">
            {uploadingBanner ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <Upload size={15} />
            )}
            Subir banner
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleBannerChange}
              disabled={uploadingBanner}
            />
          </label>
        </div>

        {/* Descripción */}
        <div className="mt-4">
          <label className="text-sm font-semibold text-[#16181D]">
            Descripción del negocio
          </label>
          <textarea
            value={businessDescription}
            onChange={(e) => setBusinessDescription(e.target.value)}
            placeholder="Ej. Repuestos usados y nuevos, importados de Chile."
            rows={3}
            className="mt-1.5 w-full rounded-xl border border-[#E4E4E1] bg-white px-3 py-2.5 text-sm text-[#16181D] outline-none placeholder:text-[#9CA3AF] focus:border-[#16181D]"
          />
        </div>

        {/* Horario */}
        <div className="mt-4">
          <label className="text-sm font-semibold text-[#16181D]">
            Horario de atención
          </label>
          <input
            type="text"
            value={businessHours}
            onChange={(e) => setBusinessHours(e.target.value)}
            placeholder="Ej. Lun a Sáb, 8:00 - 18:00"
            className="mt-1.5 w-full rounded-xl border border-[#E4E4E1] bg-white px-3 py-2.5 text-sm text-[#16181D] outline-none placeholder:text-[#9CA3AF] focus:border-[#16181D]"
          />
        </div>

        {/* Dirección */}
        <div className="mt-4">
          <label className="text-sm font-semibold text-[#16181D]">
            Ubicación
          </label>
          <input
            type="text"
            value={businessAddress}
            onChange={(e) => setBusinessAddress(e.target.value)}
            placeholder="Ej. Av. Grigotá, 3er anillo, Santa Cruz"
            className="mt-1.5 w-full rounded-xl border border-[#E4E4E1] bg-white px-3 py-2.5 text-sm text-[#16181D] outline-none placeholder:text-[#9CA3AF] focus:border-[#16181D]"
          />
        </div>

        {/* Ubicación en el mapa */}
        <div className="mt-4">
          <label className="text-sm font-semibold text-[#16181D]">
            Marcá tu ubicación en el mapa
          </label>
          <p className="mt-1 mb-2 text-xs text-[#6B7280]">
            Arrastrá el pin al lugar exacto. Aparece en el mapa de vendedores.
          </p>
          <LocationPicker
            initialLat={latitude}
            initialLng={longitude}
            onChange={(lat, lng) => {
              setLatitude(lat);
              setLongitude(lng);
            }}
          />
        </div>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">
          Perfil actualizado correctamente.
        </div>
      )}

      <button
        type="submit"
        disabled={submitting || uploading || uploadingBanner}
        className="flex items-center justify-center gap-2 self-start rounded-full bg-[#FF5A1F] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#e64f16] disabled:opacity-60"
      >
        {submitting && <Loader2 size={16} className="animate-spin" />}
        Guardar cambios
      </button>
    </form>
  );
}
