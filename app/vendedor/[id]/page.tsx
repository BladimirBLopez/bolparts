import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ListingCard } from "@/components/ListingCard";
import { StarRating } from "@/components/StarRating";
import { ReviewForm } from "@/components/ReviewForm";
import { ShareProfileButton } from "@/components/ShareProfileButton";
import { User as UserIcon, Calendar, Clock, MapPin } from "lucide-react";

function formatFecha(date: Date) {
  return new Intl.DateTimeFormat("es-BO", {
    month: "long",
    year: "numeric",
  }).format(date);
}

export default async function VendedorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  const vendedor = await prisma.user.findUnique({
    where: { id },
    include: {
      listings: {
        orderBy: { createdAt: "desc" },
        include: { images: true, brand: true, model: true },
      },
      reviewsReceived: {
        orderBy: { createdAt: "desc" },
        include: { author: { select: { name: true, image: true } } },
      },
    },
  });

  if (!vendedor) {
    notFound();
  }

  const misFavoritos = session?.user?.id
    ? await prisma.favorite.findMany({
        where: { userId: session.user.id },
        select: { listingId: true },
      })
    : [];
  const favoritosSet = new Set(misFavoritos.map((f) => f.listingId));

  const totalReviews = vendedor.reviewsReceived.length;
  const avgRating =
    totalReviews > 0
      ? vendedor.reviewsReceived.reduce((sum, r) => sum + r.rating, 0) /
        totalReviews
      : 0;

  const esUnoMismo = session?.user?.id === vendedor.id;
  const miReview = session?.user?.id
    ? vendedor.reviewsReceived.find((r) => r.author && r.authorId === session.user.id)
    : undefined;

  return (
    <main className="flex flex-1 flex-col bg-[#F6F6F4] px-4 py-8">
      <div className="mx-auto w-full max-w-4xl">
        {/* Encabezado */}
        <div className="overflow-hidden rounded-2xl border border-[#E4E4E1] bg-white">
          {vendedor.businessBanner && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={vendedor.businessBanner}
              alt=""
              className="h-32 w-full object-cover sm:h-44"
            />
          )}
        <div className="flex items-center gap-4 p-5">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#16181D] text-white">
            {vendedor.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={vendedor.image} alt="" className="h-full w-full object-cover" />
            ) : (
              <UserIcon size={24} />
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold tracking-tight text-[#16181D]">
                {vendedor.name || "Vendedor de BolParts"}
              </h1>
            </div>
            <div className="mt-1 flex items-center gap-2">
              {totalReviews > 0 ? (
                <>
                  <StarRating rating={avgRating} />
                  <span className="text-xs text-[#6B7280]">
                    {avgRating.toFixed(1)} ({totalReviews}{" "}
                    {totalReviews === 1 ? "reseña" : "reseñas"})
                  </span>
                </>
              ) : (
                <span className="text-xs text-[#6B7280]">Sin reseñas todavía</span>
              )}
            </div>
            <p className="mt-1 flex items-center gap-1 text-xs text-[#6B7280]">
              <Calendar size={12} />
              Miembro desde {formatFecha(vendedor.createdAt)}
            </p>
            <div className="mt-2">
              <ShareProfileButton
                sellerName={vendedor.name || "Vendedor de BolParts"}
              />
            </div>
          </div>
        </div>

          {(vendedor.businessDescription ||
            vendedor.businessHours ||
            vendedor.businessAddress) && (
            <div className="border-t border-[#E4E4E1] p-5">
              {vendedor.businessDescription && (
                <p className="text-sm text-[#16181D]">
                  {vendedor.businessDescription}
                </p>
              )}
              <div className="mt-2 flex flex-col gap-1.5">
                {vendedor.businessHours && (
                  <p className="flex items-center gap-1.5 text-xs text-[#6B7280]">
                    <Clock size={12} />
                    {vendedor.businessHours}
                  </p>
                )}
                {vendedor.businessAddress && (
                  <p className="flex items-center gap-1.5 text-xs text-[#6B7280]">
                    <MapPin size={12} />
                    {vendedor.businessAddress}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Publicaciones activas */}
        <div className="mt-8">
          <h2 className="text-lg font-extrabold tracking-tight text-[#16181D]">
            Publicaciones ({vendedor.listings.length})
          </h2>
          {vendedor.listings.length === 0 ? (
            <p className="mt-3 text-sm text-[#6B7280]">
              Este vendedor no tiene publicaciones activas.
            </p>
          ) : (
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {vendedor.listings.map((listing) => (
                <ListingCard
                  key={listing.id}
                  id={listing.id}
                  title={listing.title}
                  price={listing.price}
                  condition={listing.condition}
                  city={listing.city}
                  imageUrl={listing.images[0]?.url}
                  brandName={listing.brand?.name}
                  modelName={listing.model?.name}
                  loggedIn={!!session?.user}
                  initialFavorited={favoritosSet.has(listing.id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Dejar reseña */}
        {session?.user && !esUnoMismo && (
          <div className="mt-8">
            <ReviewForm
              sellerId={vendedor.id}
              initialRating={miReview?.rating ?? 0}
              initialComment={miReview?.comment ?? ""}
            />
          </div>
        )}

        {/* Lista de reseñas */}
        <div className="mt-8">
          <h2 className="text-lg font-extrabold tracking-tight text-[#16181D]">
            Reseñas
          </h2>
          {vendedor.reviewsReceived.length === 0 ? (
            <p className="mt-3 text-sm text-[#6B7280]">
              Todavía no tiene reseñas.
            </p>
          ) : (
            <div className="mt-4 flex flex-col gap-3">
              {vendedor.reviewsReceived.map((review) => (
                <div
                  key={review.id}
                  className="rounded-2xl border border-[#E4E4E1] bg-white p-4"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-[#16181D]">
                      {review.author.name || "Usuario de BolParts"}
                    </p>
                    <StarRating rating={review.rating} size={13} />
                  </div>
                  {review.comment && (
                    <p className="mt-1.5 text-sm text-[#6B7280]">
                      {review.comment}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
