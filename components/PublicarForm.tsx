"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Upload, Loader2 } from "lucide-react";
import { TapButton } from "@/components/TapButton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  yearFrom: number | null;
  yearTo: number | null;
  phone: string | null;
  categoryId: string;
  brandId: string | null;
  modelId: string | null;
  images: { url: string }[];
};

const publicarSchema = z.object({
  title: z.string().min(1, "El título es requerido"),
  description: z.string().optional(),
  price: z.string().min(1, "El precio es requerido"),
  brandId: z.string().optional(),
  modelId: z.string().optional(),
  city: z.string().min(1, "Elegí una ciudad"),
  yearFrom: z.string().optional(),
  yearTo: z.string().optional(),
  phone: z.string().min(1, "Ingresá tu número de WhatsApp para que te contacten"),
}).refine(
  (data) => {
    if (!data.yearFrom || !data.yearTo) return true;
    return parseInt(data.yearTo) >= parseInt(data.yearFrom);
  },
  { message: "El año final debe ser mayor o igual al inicial", path: ["yearTo"] }
);

type PublicarFormValues = z.infer<typeof publicarSchema>;

export function PublicarForm({
  categorias,
  marcas,
  initialListing,
  defaultPhone,
  backHref = "/",
}: {
  categorias: Categoria[];
  marcas: Marca[];
  initialListing?: InitialListing;
  defaultPhone?: string;
  backHref?: string;
}) {
  const router = useRouter();
  const isEditing = !!initialListing;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<PublicarFormValues>({
    resolver: zodResolver(publicarSchema),
    defaultValues: {
      title: initialListing?.title ?? "",
      description: initialListing?.description ?? "",
      price: initialListing?.price?.toString() ?? "",
      brandId: initialListing?.brandId ?? "",
      modelId: initialListing?.modelId ?? "",
      city: initialListing?.city ?? "",
      yearFrom: initialListing?.yearFrom?.toString() ?? "",
      yearTo: initialListing?.yearTo?.toString() ?? "",
      phone: initialListing?.phone ?? defaultPhone ?? "",
    },
  });

  const brandId = watch("brandId");
  const modelId = watch("modelId");
  const city = watch("city");

  const [condition, setCondition] = useState<"NEW" | "USED">(
    initialListing?.condition ?? "USED"
  );
  const [categoryId, setCategoryId] = useState(initialListing?.categoryId ?? "");

  const initialTipoVehiculo =
    marcas.find((m) => m.id === initialListing?.brandId)?.tipo ?? "AUTO";
  const [tipoVehiculo, setTipoVehiculo] = useState<"AUTO" | "MOTO" | "CAMION">(
    initialTipoVehiculo
  );

  const [images, setImages] = useState<string[]>(
    initialListing?.images.map((i) => i.url) ?? []
  );
  const [uploading, setUploading] = useState(false);
  const [formError, setFormError] = useState("");
  const [confirmandoSalida, setConfirmandoSalida] = useState(false);
  const cantidadImagenesInicial = initialListing?.images.length ?? 0;
  const hayCambiosSinGuardar =
    isDirty || images.length !== cantidadImagenesInicial;

  useEffect(() => {
    function handleBeforeUnload(e: BeforeUnloadEvent) {
      if (hayCambiosSinGuardar && !isSubmitting) {
        e.preventDefault();
      }
    }
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hayCambiosSinGuardar, isSubmitting]);

  function handleVolverClick(e: React.MouseEvent) {
    if (hayCambiosSinGuardar) {
      e.preventDefault();
      setConfirmandoSalida(true);
    }
  }

  const modelosDisponibles =
    marcas.find((m) => m.id === brandId)?.models ?? [];
  const marcasDisponibles = marcas.filter((m) => m.tipo === tipoVehiculo);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setFormError("");

    const espacioDisponible = MAX_FOTOS - images.length;
    if (espacioDisponible <= 0) {
      setFormError(`Máximo ${MAX_FOTOS} fotos por publicación`);
      e.target.value = "";
      return;
    }

    const archivosAProcesar = Array.from(files).slice(0, espacioDisponible);
    if (files.length > espacioDisponible) {
      setFormError(`Solo se agregaron ${espacioDisponible} foto(s): el máximo es ${MAX_FOTOS}`);
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
          setFormError(data.error || "No se pudo subir una imagen");
          continue;
        }

        setImages((prev) => [...prev, data.url]);
      } catch {
        setFormError("Error de conexión al subir la imagen");
      }
    }

    setUploading(false);
    e.target.value = "";
  }

  function removeImage(url: string) {
    setImages((prev) => prev.filter((img) => img !== url));
  }

  async function onSubmit(data: PublicarFormValues) {
    setFormError("");

    if (images.length === 0) {
      setFormError("Agregá al menos una foto del repuesto");
      return;
    }
    if (!categoryId) {
      setFormError("Elegí una categoría");
      return;
    }

    try {
      const res = await fetch(
        isEditing ? `/api/listings/${initialListing!.id}` : "/api/listings",
        {
          method: isEditing ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: data.title,
            description: data.description,
            price: data.price,
            condition,
            city: data.city,
            department: data.city,
            yearFrom: data.yearFrom || null,
            yearTo: data.yearTo || null,
            phone: data.phone || null,
            categoryId,
            brandId: data.brandId || null,
            modelId: data.modelId || null,
            images,
          }),
        }
      );

      const result = await res.json();

      if (!res.ok) {
        setFormError(
          result.error ||
            (isEditing
              ? "No se pudo actualizar la publicación"
              : "No se pudo crear la publicación")
        );
        return;
      }

      router.push(isEditing ? "/mis-publicaciones" : "/");
      router.refresh();
    } catch {
      setFormError("Error de conexión");
    }
  }

  return (
    <>
      <Link
        href={backHref}
        onClick={handleVolverClick}
        className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-[#6B7280] hover:text-[#16181D]"
      >
        <ChevronLeft size={16} />
        Volver
      </Link>

      {confirmandoSalida && (
        <div className="mb-4 rounded-2xl border border-[#E4E4E1] bg-white p-4">
          <p className="text-sm font-semibold text-[#16181D]">
            Tenés cambios sin guardar
          </p>
          <p className="mt-1 text-xs text-[#6B7280]">
            Si salís ahora vas a perder lo que completaste. ¿Querés descartarlos?
          </p>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={() => router.push(backHref)}
              className="rounded-full bg-red-600 px-4 py-2 text-xs font-semibold text-white"
            >
              Descartar y salir
            </button>
            <button
              type="button"
              onClick={() => setConfirmandoSalida(false)}
              className="rounded-full border border-[#E4E4E1] px-4 py-2 text-xs font-semibold text-[#16181D]"
            >
              Seguir editando
            </button>
          </div>
        </div>
      )}

    <form onSubmit={handleSubmit(onSubmit)} className="mt-8 flex flex-col gap-6">
      {/* Fotos */}
      <div>
        <label className="text-sm font-semibold text-[#16181D]">Fotos</label>
        <div className="mt-2 flex flex-wrap gap-3">
          {images.map((url) => (
            <div
              key={url}
              className="relative h-24 w-24 overflow-hidden rounded-xl border border-[#E4E4E1]"
            >
              <Image src={url} alt="" fill sizes="96px" className="object-cover" />
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
          {...register("title")}
          placeholder="Ej. Juego de pastillas de freno delanteras"
          className="mt-1.5 w-full rounded-xl border border-[#E4E4E1] bg-white px-3 py-2.5 text-sm text-[#16181D] outline-none placeholder:text-[#9CA3AF] focus:border-[#16181D]"
        />
        {errors.title && (
          <p className="mt-1 text-xs text-red-600">{errors.title.message}</p>
        )}
      </div>

      {/* Descripción */}
      <div>
        <label className="text-sm font-semibold text-[#16181D]">
          Descripción
        </label>
        <textarea
          {...register("description")}
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
            step="0.01"
            {...register("price")}
            placeholder="0"
            className="mt-1.5 w-full rounded-xl border border-[#E4E4E1] bg-white px-3 py-2.5 text-sm text-[#16181D] outline-none placeholder:text-[#9CA3AF] focus:border-[#16181D]"
          />
          {errors.price && (
            <p className="mt-1 text-xs text-red-600">{errors.price.message}</p>
          )}
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
                setValue("brandId", "", { shouldDirty: true });
                setValue("modelId", "", { shouldDirty: true });
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
          <Select
            value={brandId}
            onValueChange={(value) => {
              setValue("brandId", value ?? "", { shouldDirty: true });
              setValue("modelId", "", { shouldDirty: true });
            }}
          >
            <SelectTrigger className="mt-1.5 w-full rounded-xl border-[#E4E4E1] bg-white px-3 py-2.5 text-sm text-[#16181D]">
              <SelectValue placeholder="Cualquier marca">
                {(value: string) =>
                  marcasDisponibles.find((m) => m.id === value)?.name ??
                  "Cualquier marca"
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
        </div>
        <div className="flex-1">
          <label className="text-sm font-semibold text-[#16181D]">
            Modelo (opcional)
          </label>
          <Select
            value={modelId}
            onValueChange={(value) =>
              setValue("modelId", value ?? "", { shouldDirty: true })
            }
            disabled={!brandId}
          >
            <SelectTrigger className="mt-1.5 w-full rounded-xl border-[#E4E4E1] bg-white px-3 py-2.5 text-sm text-[#16181D]">
              <SelectValue placeholder="Cualquier modelo">
                {(value: string) =>
                  modelosDisponibles.find((m) => m.id === value)?.name ??
                  "Cualquier modelo"
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
      </div>

      {/* Ciudad + año */}
      <div className="flex gap-3">
        <div className="flex-1">
          <label className="text-sm font-semibold text-[#16181D]">
            Ciudad
          </label>
          <Select
            value={city}
            onValueChange={(value) =>
              setValue("city", value ?? "", {
                shouldValidate: true,
                shouldDirty: true,
              })
            }
          >
            <SelectTrigger className="mt-1.5 w-full rounded-xl border-[#E4E4E1] bg-white px-3 py-2.5 text-sm text-[#16181D]">
              <SelectValue placeholder="Elegí una ciudad">
                {(value: string) => value || "Elegí una ciudad"}
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
          {errors.city && (
            <p className="mt-1 text-xs text-red-600">{errors.city.message}</p>
          )}
        </div>
      </div>

      {/* Años compatibles */}
      <div>
        <label className="text-sm font-semibold text-[#16181D]">
          Años compatibles (opcional)
        </label>
        <p className="mt-0.5 text-xs text-[#6B7280]">
          Si el repuesto sirve para varios años del mismo modelo, indicá el rango.
        </p>
        <div className="mt-1.5 flex items-center gap-3">
          <input
            type="number"
            min="1970"
            max="2030"
            {...register("yearFrom")}
            placeholder="Desde. Ej. 2015"
            className="w-full rounded-xl border border-[#E4E4E1] bg-white px-3 py-2.5 text-sm text-[#16181D] outline-none placeholder:text-[#9CA3AF] focus:border-[#16181D]"
          />
          <span className="text-sm text-[#6B7280]">a</span>
          <input
            type="number"
            min="1970"
            max="2030"
            {...register("yearTo")}
            placeholder="Hasta. Ej. 2018"
            className="w-full rounded-xl border border-[#E4E4E1] bg-white px-3 py-2.5 text-sm text-[#16181D] outline-none placeholder:text-[#9CA3AF] focus:border-[#16181D]"
          />
        </div>
        {errors.yearTo && (
          <p className="mt-1 text-xs text-red-600">{errors.yearTo.message}</p>
        )}
      </div>

      {/* WhatsApp */}
      <div>
        <label className="text-sm font-semibold text-[#16181D]">
          WhatsApp de contacto
        </label>
        <input
          type="tel"
          {...register("phone")}
          placeholder="Ej. 70012345"
          className="mt-1.5 w-full rounded-xl border border-[#E4E4E1] bg-white px-3 py-2.5 text-sm text-[#16181D] outline-none placeholder:text-[#9CA3AF] focus:border-[#16181D]"
        />
        {errors.phone && (
          <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>
        )}
        <p className="mt-1 text-xs text-[#6B7280]">
          Los compradores te van a escribir directo a este número.
        </p>
      </div>

      {formError && (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {formError}
        </div>
      )}

      <TapButton
        type="submit"
        disabled={isSubmitting || uploading}
        className="flex items-center justify-center gap-2 rounded-full bg-[#FF5A1F] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#e64f16] disabled:opacity-60"
      >
        {isSubmitting ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            {isEditing ? "Guardando..." : "Publicando..."}
          </>
        ) : isEditing ? (
          "Guardar cambios"
        ) : (
          "Vender repuesto"
        )}
      </TapButton>
    </form>
    </>
  );
}
