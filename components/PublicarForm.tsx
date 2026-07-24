"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Upload, Loader2, ChevronDown } from "lucide-react";

const MAX_FOTOS = 10;

type Modelo = { id: string; name: string };
type Marca = { id: string; name: string; models: Modelo[]; tipo: "AUTO" | "MOTO" | "CAMION" };
type Categoria = { id: string; name: string; slug: string; tipo: "VEHICULO" | "REPUESTO" };

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

type InitialListing = {
  id: string;
  title: string;
  description: string | null;
  price: number;
  condition: "NEW" | "USED";
  city: string;
  year: number | null;
  phone: string | null;
  categoryId: string;
  brandId: string | null;
  modelId: string | null;
  images: { url: string }[];
};

export function PublicarForm({
  categorias,
  marcas,
  initialListing,
  defaultPhone,
}: {
  categorias: Categoria[];
  marcas: Marca[];
  initialListing?: InitialListing;
  defaultPhone?: string;
}) {
  const router = useRouter();
  const isEditing = !!initialListing;

  const [title, setTitle] = useState(initialListing?.title ?? "");
  const [description, setDescription] = useState(initialListing?.description ?? "");
  const [price, setPrice] = useState(initialListing?.price?.toString() ?? "");
  const [condition, setCondition] = useState<"NEW" | "USED">(
    initialListing?.condition ?? "USED"
  );
  const [city, setCity] = useState(initialListing?.city ?? "");
  const [year, setYear] = useState(initialListing?.year?.toString() ?? "");
  const [phone, setPhone] = useState(
    initialListing?.phone ?? defaultPhone ?? ""
  );
  const [categoryId, setCategoryId] = useState(initialListing?.categoryId ?? "");
  const initialTipoVehiculo =
    marcas.find((m) => m.id === initialListing?.brandId)?.tipo ?? "AUTO";
  const [tipoVehiculo, setTipoVehiculo] = useState<"AUTO" | "MOTO" | "CAMION">(
    initialTipoVehiculo
  );
  const [brandId, setBrandId] = useState(initialListing?.brandId ?? "");
  const [modelId, setModelId] = useState(initialListing?.modelId ?? "");

  const [images, setImages] = useState<string[]>(
    initialListing?.images.map((i) => i.url) ?? []
  );
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const modelosDisponibles =
    marcas.find((m) => m.id === brandId)?.models ?? [];
  const marcasDisponibles = marcas.filter((m) => m.tipo === tipoVehiculo);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setError("");

    const espacioDisponible = MAX_FOTOS - images.length;
    if (espacioDisponible <= 0) {
      setError(`Máximo ${MAX_FOTOS} fotos por publicación`);
      e.target.value = "";
      return;
    }

    const archivosAProcesar = Array.from(files).slice(0, espacioDisponible);
    if (files.length > espacioDisponible) {
      setError(`Solo se agregaron ${espacioDisponible} foto(s): el máximo es ${MAX_FOTOS}`);
    }

    setUploading(true);

    for (const file of archivosAProcesar) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "No se pudo subir una imagen");
          continue;
        }

        setImages((prev) => [...prev, data.url]);
      } catch {
        setError("Error de conexión al subir la imagen");
      }
    }

    setUploading(false);
    e.target.value = "";
  }

  function removeImage(url: string) {
    setImages((prev) => prev.filter((img) => img !== url));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (images.length === 0) {
      setError("Agregá al menos una foto del repuesto");
      return;
    }
    if (!categoryId) {
      setError("Elegí una categoría");
      return;
    }
    if (!city) {
      setError("Elegí una ciudad");
      return;
    }
    if (!phone) {
      setError("Ingresá tu número de WhatsApp para que te contacten");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch(
        isEditing ? `/api/listings/${initialListing!.id}` : "/api/listings",
        {
          method: isEditing ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            description,
            price,
            condition,
            city,
            department: city,
            year: year || null,
            phone: phone || null,
            categoryId,
            brandId: brandId || null,
            modelId: modelId || null,
            images,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(
          data.error ||
            (isEditing
              ? "No se pudo actualizar la publicación"
              : "No se pudo crear la publicación")
        );
        setSubmitting(false);
        return;
      }

      router.push(isEditing ? "/mis-publicaciones" : "/");
      router.refresh();
    } catch {
      setError("Error de conexión");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-6">
      {/* Fotos */}
      <div>
        <label className="text-sm font-semibold text-[#16181D]">Fotos</label>
        <div className="mt-2 flex flex-wrap gap-3">
          {images.map((url) => (
            <div
              key={url}
              className="relative h-24 w-24 overflow-hidden rounded-xl border border-[#E4E4E1]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(url)}
                className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white"
              >
                <X size={12} />
              </button>
            </div>
          ))}

          {images.length < MAX_FOTOS && (
            <label className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-[#E4E4E1] bg-white text-[#6B7280] transition-colors hover:border-[#16181D]">
              {uploading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <Upload size={18} />
              )}
              <span className="text-[11px]">Agregar</span>
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFileChange}
                disabled={uploading}
              />
            </label>
          )}
        </div>
        <p className="mt-1.5 text-xs text-[#6B7280]">
          {images.length}/{MAX_FOTOS} fotos
        </p>
      </div>

      {/* Título */}
      <div>
        <label className="text-sm font-semibold text-[#16181D]">Título</label>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ej. Juego de pastillas de freno delanteras"
          className="mt-1.5 w-full rounded-xl border border-[#E4E4E1] bg-white px-3 py-2.5 text-sm text-[#16181D] outline-none placeholder:text-[#9CA3AF] focus:border-[#16181D]"
        />
      </div>

      {/* Descripción */}
      <div>
        <label className="text-sm font-semibold text-[#16181D]">
          Descripción
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          placeholder="Estado, compatibilidad, detalles del repuesto..."
          className="mt-1.5 w-full resize-none rounded-xl border border-[#E4E4E1] bg-white px-3 py-2.5 text-sm text-[#16181D] outline-none placeholder:text-[#9CA3AF] focus:border-[#16181D]"
        />
      </div>

      {/* Precio + condición */}
      <div className="flex gap-3">
        <div className="flex-1">
          <label className="text-sm font-semibold text-[#16181D]">
            Precio (Bs.)
          </label>
          <input
            type="number"
            required
            min="0"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0"
            className="mt-1.5 w-full rounded-xl border border-[#E4E4E1] bg-white px-3 py-2.5 text-sm text-[#16181D] outline-none placeholder:text-[#9CA3AF] focus:border-[#16181D]"
          />
        </div>
        <div className="flex-1">
          <label className="text-sm font-semibold text-[#16181D]">
            Condición
          </label>
          <div className="mt-1.5 flex rounded-xl border border-[#E4E4E1] bg-white p-1">
            <button
              type="button"
              onClick={() => setCondition("USED")}
              className={
                "flex-1 rounded-lg py-2 text-sm font-semibold transition-colors " +
                (condition === "USED"
                  ? "bg-[#16181D] text-white"
                  : "text-[#6B7280]")
              }
            >
              Usado
            </button>
            <button
              type="button"
              onClick={() => setCondition("NEW")}
              className={
                "flex-1 rounded-lg py-2 text-sm font-semibold transition-colors " +
                (condition === "NEW"
                  ? "bg-[#16181D] text-white"
                  : "text-[#6B7280]")
              }
            >
              Nuevo
            </button>
          </div>
        </div>
      </div>

      {/* Categoría */}
      <div>
        <label className="text-sm font-semibold text-[#16181D]">
          Categoría
        </label>
        <div className="mt-2 flex flex-wrap gap-2">
          {categorias.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCategoryId(c.id)}
              className={
                "rounded-full border px-4 py-2 text-sm font-semibold transition-colors " +
                (categoryId === c.id
                  ? "border-[#FF5A1F] bg-[#FF5A1F] text-white"
                  : "border-[#E4E4E1] bg-white text-[#16181D]")
              }
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Tipo de vehículo compatible */}
      <div>
        <label className="text-sm font-semibold text-[#16181D]">
          Tipo de vehículo compatible (opcional)
        </label>
        <div className="mt-1.5 flex rounded-xl border border-[#E4E4E1] bg-white p-1">
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
      </div>

      {/* Marca + modelo */}
      <div className="flex gap-3">
        <div className="flex-1">
          <label className="text-sm font-semibold text-[#16181D]">
            Marca (opcional)
          </label>
          <div className="relative mt-1.5">
            <select
              value={brandId}
              onChange={(e) => {
                setBrandId(e.target.value);
                setModelId("");
              }}
              className="w-full appearance-none rounded-xl border border-[#E4E4E1] bg-white px-3 py-2.5 pr-9 text-sm text-[#16181D] outline-none focus:border-[#16181D]"
            >
              <option value="">Cualquier marca</option>
              {marcasDisponibles.map((m) => (
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
        <div className="flex-1">
          <label className="text-sm font-semibold text-[#16181D]">
            Modelo (opcional)
          </label>
          <div className="relative mt-1.5">
            <select
              value={modelId}
              onChange={(e) => setModelId(e.target.value)}
              disabled={!brandId}
              className="w-full appearance-none rounded-xl border border-[#E4E4E1] bg-white px-3 py-2.5 pr-9 text-sm text-[#16181D] outline-none focus:border-[#16181D] disabled:opacity-50"
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
      </div>

      {/* Ciudad + año */}
      <div className="flex gap-3">
        <div className="flex-1">
          <label className="text-sm font-semibold text-[#16181D]">
            Ciudad
          </label>
          <div className="relative mt-1.5">
            <select
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full appearance-none rounded-xl border border-[#E4E4E1] bg-white px-3 py-2.5 pr-9 text-sm text-[#16181D] outline-none focus:border-[#16181D]"
            >
              <option value="">Elegí una ciudad</option>
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
        </div>
        <div className="flex-1">
          <label className="text-sm font-semibold text-[#16181D]">
            Año del vehículo (opcional)
          </label>
          <input
            type="number"
            min="1970"
            max="2030"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="Ej. 2015"
            className="mt-1.5 w-full rounded-xl border border-[#E4E4E1] bg-white px-3 py-2.5 text-sm text-[#16181D] outline-none placeholder:text-[#9CA3AF] focus:border-[#16181D]"
          />
        </div>
      </div>

      {/* WhatsApp */}
      <div>
        <label className="text-sm font-semibold text-[#16181D]">
          WhatsApp de contacto
        </label>
        <input
          type="tel"
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Ej. 70012345"
          className="mt-1.5 w-full rounded-xl border border-[#E4E4E1] bg-white px-3 py-2.5 text-sm text-[#16181D] outline-none placeholder:text-[#9CA3AF] focus:border-[#16181D]"
        />
        <p className="mt-1 text-xs text-[#6B7280]">
          Los compradores te van a escribir directo a este número.
        </p>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting || uploading}
        className="flex items-center justify-center gap-2 rounded-full bg-[#FF5A1F] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#e64f16] disabled:opacity-60"
      >
        {submitting ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            {isEditing ? "Guardando..." : "Publicando..."}
          </>
        ) : isEditing ? (
          "Guardar cambios"
        ) : (
          "Publicar repuesto"
        )}
      </button>
    </form>
  );
}
