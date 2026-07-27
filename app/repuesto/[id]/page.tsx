import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { MapPin, Calendar, ArrowLeft, User as UserIcon } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { StarRating } from "@/components/StarRating";
import { ListingGallery } from "@/components/ListingGallery";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { ReportButton } from "@/components/ReportButton";
import { ListingCard } from "@/components/ListingCard";
import { Badge } from "@/components/ui/badge";
import { idFromSlugParam } from "@/lib/slug";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

function formatPrecioMeta(price: number) {
  return `Bs. ${price.toLocaleString("es-BO", { maximumFractionDigits: 0 })}`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id: rawId } = await params;
  const id = idFromSlugParam(rawId);

  const listing = await prisma.listing.findUnique({
    where: { id },
    include: { images: true },
  });

  if (!listing) {
    return { title: "Repuesto no encontrado — BolParts" };
  }

  const title = `${listing.title} — ${formatPrecioMeta(listing.price)} | BolParts`;
  const description =
    listing.description?.slice(0, 150) ||
    `${listing.title} en ${listing.city}. Publicado en BolParts, el marketplace de repuestos de auto en Bolivia.`;
  const imageUrl = listing.images[0]?.url;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: imageUrl ? [{ url: imageUrl, width: 800, height: 800 }] : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: imageUrl ? [imageUrl] : [],
    },
  };
}

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
  const { id: rawId } = await params;
  const id = idFromSlugParam(rawId);
  const session = await getServerSession(authOptions);

  const listing = await prisma.listing.findUnique({
    where: { id },
    include: {
      images: true,
      category: true,
      brand: true,
      model: true,
      user: {
        select: {
          id: true,
          name: true,
          image: true,
          nivelPlan: true,
          reviewsReceived: { select: { rating: true } },
        },
      },
    },
  });

  if (!listing) {
    notFound();
  }

  const otrosDelVendedor = await prisma.listing.findMany({
    where: {
      userId: listing.user.id,
      id: { not: listing.id },
    },
    orderBy: { createdAt: "desc" },
    take: 4,
    include: {
      images: true,
      brand: true,
      model: true,
    },
  });

  const totalReviews = listing.user.reviewsReceived.length;
  const avgRating =
    totalReviews > 0
      ? listing.user.reviewsReceived.reduce((sum, r) => sum + r.rating, 0) /
        totalReviews
      : 0;

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
          <ListingGallery images={listing.images} title={listing.title} />

          {/* Info */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <Badge
                className={`h-auto px-2.5 py-0.5 text-xs font-semibold ${
                  listing.condition === "NEW"
                    ? "bg-[#16181D] text-white"
                    : "border border-[#E4E4E1] bg-white text-[#16181D]"
                }`}
              >
                {listing.condition === "NEW" ? "Nuevo" : "Usado"}
              </Badge>
              <Badge className="h-auto border border-[#E4E4E1] bg-white px-2.5 py-0.5 text-xs font-medium text-[#6B7280]">
                {listing.category.name}
              </Badge>
            </div>

            <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-[#16181D]">
              {listing.title}
            </h1>

            {(listing.brand || listing.model) && (
              <p className="mt-1 text-sm text-[#6B7280]">
                {[listing.brand?.name, listing.model?.name]
                  .filter(Boolean)
                  .join(" ")}
                {listing.yearFrom && listing.yearTo
                  ? listing.yearFrom === listing.yearTo
                    ? ` · ${listing.yearFrom}`
                    : ` · ${listing.yearFrom}-${listing.yearTo}`
                  : listing.yearFrom
                  ? ` · Desde ${listing.yearFrom}`
                  : listing.yearTo
                  ? ` · Hasta ${listing.yearTo}`
                  : ""}
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
              <div className="mt-2 flex items-center gap-3">
                <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#16181D] text-white">
                  {listing.user.image ? (
                    <Image
                      src={listing.user.image}
                      alt=""
                      fill
                      sizes="44px"
                      className="object-cover"
                    />
                  ) : (
                    <UserIcon size={18} />
                  )}
                </div>
                <div>
                  <Link
                    href={`/vendedor/${listing.user.id}`}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#16181D] hover:underline"
                  >
                    {listing.user.name || "Vendedor de BolParts"}
                    {listing.user.nivelPlan === "SUPERIOR" && (
                      <Badge className="h-auto bg-transparent p-0 text-xs font-bold text-[#FF5A1F]">
                        ★ Superior
                      </Badge>
                    )}
                    {listing.user.nivelPlan === "DESTACADO" && (
                      <Badge className="h-auto bg-transparent p-0 text-xs font-bold text-[#FF5A1F]">
                        ★ Destacado
                      </Badge>
                    )}
                  </Link>

                  {totalReviews > 0 ? (
                    <div className="mt-0.5 flex items-center gap-1.5">
                      <StarRating rating={avgRating} size={13} />
                      <span className="text-xs text-[#6B7280]">
                        {avgRating.toFixed(1)} ({totalReviews}{" "}
                        {totalReviews === 1 ? "reseña" : "reseñas"})
                      </span>
                    </div>
                  ) : (
                    <p className="mt-0.5 text-xs text-[#6B7280]">
                      Sin reseñas todavía
                    </p>
                  )}
                </div>
              </div>

              {listing.phone ? (
                <WhatsAppButton
                  href={`https://wa.me/591${listing.phone.replace(/\D/g, "")}?text=${encodeURIComponent(
                    `Hola, vi tu publicación "${listing.title}" en BolParts y me interesa.`
                  )}`}
                />
              ) : (
                <p className="mt-4 text-xs text-[#6B7280]">
                  El vendedor no dejó un número de contacto.
                </p>
              )}

              <div className="mt-3 flex justify-center">
                <ReportButton listingId={listing.id} loggedIn={!!session?.user} />
              </div>
            </div>
          </div>
        </div>

        {otrosDelVendedor.length > 0 && (
          <div className="mt-10">
            <h2 className="text-lg font-extrabold tracking-tight text-[#16181D]">
              Más de {listing.user.name || "este vendedor"}
            </h2>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {otrosDelVendedor.map((l) => (
                <ListingCard
                  key={l.id}
                  id={l.id}
                  title={l.title}
                  price={l.price}
                  condition={l.condition}
                  city={l.city}
                  imageUrl={l.images[0]?.url}
                  brandName={l.brand?.name}
                  modelName={l.model?.name}
                  nivelPlan={listing.user.nivelPlan}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
