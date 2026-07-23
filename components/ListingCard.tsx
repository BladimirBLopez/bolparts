import Link from "next/link";
import { MapPin, Star } from "lucide-react";
import { FavoriteButton } from "@/components/FavoriteButton";

type ListingCardProps = {
  id: string;
  title: string;
  price: number;
  condition: "NEW" | "USED";
  city: string;
  imageUrl?: string;
  brandName?: string | null;
  modelName?: string | null;
  initialFavorited?: boolean;
  loggedIn?: boolean;
  sellerRating?: number;
  sellerReviewCount?: number;
};

function formatPrice(price: number) {
  return `Bs. ${price.toLocaleString("es-BO", { maximumFractionDigits: 0 })}`;
}

export function ListingCard({
  id,
  title,
  price,
  condition,
  city,
  imageUrl,
  brandName,
  modelName,
  initialFavorited = false,
  loggedIn = false,
  sellerRating = 0,
  sellerReviewCount = 0,
}: ListingCardProps) {
  return (
    <Link
      href={`/repuesto/${id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-[#E4E4E1] bg-white transition-colors hover:border-[#16181D]"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-[#F6F6F4]">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={title}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-[#9CA3AF]">
            Sin foto
          </div>
        )}
        <span
          className={`absolute left-2 top-2 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
            condition === "NEW"
              ? "bg-[#16181D] text-white"
              : "bg-white text-[#16181D]"
          }`}
        >
          {condition === "NEW" ? "Nuevo" : "Usado"}
        </span>
        <div className="absolute right-2 top-2">
          <FavoriteButton
            listingId={id}
            initialFavorited={initialFavorited}
            loggedIn={loggedIn}
          />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1 p-3">
        <p className="line-clamp-2 text-sm font-medium leading-snug text-[#16181D]">
          {title}
        </p>
        {(brandName || modelName) && (
          <p className="text-xs text-[#6B7280]">
            {[brandName, modelName].filter(Boolean).join(" ")}
          </p>
        )}
        <p className="mt-1 text-base font-extrabold text-[#16181D]">
          {formatPrice(price)}
        </p>
        <p className="flex items-center gap-1 text-xs text-[#6B7280]">
          <MapPin size={12} />
          {city}
        </p>
        {sellerReviewCount > 0 && (
          <p className="flex items-center gap-1 text-xs text-[#6B7280]">
            <Star size={12} className="text-[#FF5A1F]" fill="currentColor" />
            {sellerRating.toFixed(1)} ({sellerReviewCount})
          </p>
        )}
      </div>
    </Link>
  );
}
