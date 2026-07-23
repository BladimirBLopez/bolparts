"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Upload, Loader2 } from "lucide-react";

type Modelo = { id: string; name: string };
type Marca = { id: string; name: string; models: Modelo[] };
type Categoria = { id: string; name: string; slug: string };

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

export function PublicarForm({
  categorias,
  marcas,
}: {
  categorias: Categoria[];
  marcas: Marca[];
}) {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [condition, setCondition] = useState<"NEW" | "USED">("USED");
  const [city, setCity] = useState("");
  const [year, setYear] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [brandId, setBrandId] = useState("");
  const [modelId, setModelId] = useState("");

  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const modelosDisponibles =
    marcas.find((m) => m.id === brandId)?.models ?? [];

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError("");

    for (const file of Array.from(files)) {
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

    setSubmitting(true);

    try {
      const res = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          price,
          condition,
          city,
          department: city,
          year: year || null,
          categoryId,
          brandId: brandId || null,
          modelId: modelId || null,
          images,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "No se pudo crear la publicación");
        setSubmitting(false);
        return;
      }

      router.push(`/`);
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
        </div>
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
          <select
            value={condition}
            onChange={(e) => setCondition(e.target.value as "NEW" | "USED")}
            className="mt-1.5 w-full rounded-xl border border-[#E4E4E1] bg-white px-3 py-2.5 text-sm text-[#16181D] outline-none focus:border-[#16181D]"
          >
            <option value="USED">Usado</option>
            <option value="NEW">Nuevo</option>
          </select>
        </div>
      </div>

      {/* Categoría */}
      <div>
        <label className="text-sm font-semibold text-[#16181D]">
          Categoría
        </label>
        <select
          required
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="mt-1.5 w-full rounded-xl border border-[#E4E4E1] bg-white px-3 py-2.5 text-sm text-[#16181D] outline-none focus:border-[#16181D]"
        >
          <option value="">Elegí una categoría</option>
          {categorias.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Marca + modelo */}
      <div className="flex gap-3">
        <div className="flex-1">
          <label className="text-sm font-semibold text-[#16181D]">
            Marca (opcional)
          </label>
          <select
            value={brandId}
            onChange={(e) => {
              setBrandId(e.target.value);
              setModelId("");
            }}
            className="mt-1.5 w-full rounded-xl border border-[#E4E4E1] bg-white px-3 py-2.5 text-sm text-[#16181D] outline-none focus:border-[#16181D]"
          >
            <option value="">Cualquier marca</option>
            {marcas.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label className="text-sm font-semibold text-[#16181D]">
            Modelo (opcional)
          </label>
          <select
            value={modelId}
            onChange={(e) => setModelId(e.target.value)}
            disabled={!brandId}
            className="mt-1.5 w-full rounded-xl border border-[#E4E4E1] bg-white px-3 py-2.5 text-sm text-[#16181D] outline-none focus:border-[#16181D] disabled:opacity-50"
          >
            <option value="">Cualquier modelo</option>
            {modelosDisponibles.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Ciudad + año */}
      <div className="flex gap-3">
        <div className="flex-1">
          <label className="text-sm font-semibold text-[#16181D]">
            Ciudad
          </label>
          <select
            required
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-[#E4E4E1] bg-white px-3 py-2.5 text-sm text-[#16181D] outline-none focus:border-[#16181D]"
          >
            <option value="">Elegí una ciudad</option>
            {CIUDADES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
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
            Publicando...
          </>
        ) : (
          "Publicar repuesto"
        )}
      </button>
    </form>
  );
}
