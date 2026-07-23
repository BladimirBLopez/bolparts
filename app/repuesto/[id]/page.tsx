import { notFound } from "next/navigation";
import Link from "next/link";
import { MapPin, Calendar, ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";

function formatPrice(price: number) {
  return `Bs. ${price.toLocaleString("es-BO", { maximumFractionDigits: 0 })}`;
}

function formatFecha(date: Date) {
  return new Intl.DateTimeFormat("es-BO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export default async function RepuestoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const listing = await prisma.listing.findUnique({
    where: { id },
    include: {
      images: true,
      category: true,
      brand: true,
      model: true,
      user: { select: { name: true, image: true } },
    },
  });

  if (!listing) {
    notFound();
  }

  const mainImage = listing.images[0]?.url;
  const restoImages = listing.images.slice(1);

  return (
    <main className="flex flex-1 flex-col bg-[#F6F6F4] px-4 py-6">
      <div className="mx-auto w-full max-w-4xl">
        <Link
          href="/buscar"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[#6B7280] hover:text-[#16181D]"
        >
          <ArrowLeft size={16} />
          Volver a la búsqueda
        </Link>

        <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Galería */}
          <div>
            <div className="aspect-square w-full overflow-hidden rounded-2xl border border-[#E4E4E1] bg-white">
              {mainImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={mainImage}
                  alt={listing.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-sm text-[#9CA3AF]">
                  Sin foto
                </div>
              )}
            </div>

            {restoImages.length > 0 && (
              <div className="mt-3 grid grid-cols-4 gap-2">
                {restoImages.map((img) => (
                  <div
                    key={img.id}
                    className="aspect-square overflow-hidden rounded-xl border border-[#E4E4E1] bg-white"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.url}
                      alt={listing.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  listing.condition === "NEW"
                    ? "bg-[#16181D] text-white"
                    : "border border-[#E4E4E1] bg-white text-[#16181D]"
                }`}
              >
                {listing.condition === "NEW" ? "Nuevo" : "Usado"}
              </span>
              <span className="rounded-full border border-[#E4E4E1] bg-white px-2.5 py-0.5 text-xs font-medium text-[#6B7280]">
                {listing.category.name}
              </span>
            </div>

            <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-[#16181D]">
              {listing.title}
            </h1>

            {(listing.brand || listing.model) && (
              <p className="mt-1 text-sm text-[#6B7280]">
                {[listing.brand?.name, listing.model?.name]
                  .filter(Boolean)
                  .join(" ")}
                {listing.year ? ` · ${listing.year}` : ""}
              </p>
            )}

            <p className="mt-4 text-3xl font-extrabold text-[#16181D]">
              {formatPrice(listing.price)}
            </p>

            <div className="mt-4 flex flex-col gap-1.5 text-sm text-[#6B7280]">
              <span className="flex items-center gap-1.5">
                <MapPin size={14} />
                {listing.city}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar size={14} />
                Publicado el {formatFecha(listing.createdAt)}
              </span>
            </div>

            {listing.description && (
              <div className="mt-6">
                <h2 className="text-sm font-semibold text-[#16181D]">
                  Descripción
                </h2>
                <p className="mt-1.5 whitespace-pre-line text-sm text-[#6B7280]">
                  {listing.description}
                </p>
              </div>
            )}

            <div className="mt-6 rounded-2xl border border-[#E4E4E1] bg-white p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-[#6B7280]">
                Vendedor
              </p>
              <p className="mt-1 text-sm font-semibold text-[#16181D]">
                {listing.user.name || "Vendedor de BolParts"}
              </p>

              {listing.phone ? (
                <a
                  href={`https://wa.me/591${listing.phone.replace(/\D/g, "")}?text=${encodeURIComponent(
                    `Hola, vi tu publicación "${listing.title}" en BolParts y me interesa.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1ebe57]"
                >
                  Contactar por WhatsApp
                </a>
              ) : (
                <p className="mt-4 text-xs text-[#6B7280]">
                  El vendedor no dejó un número de contacto.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
