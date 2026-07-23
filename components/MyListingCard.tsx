"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MapPin, Trash2, Loader2, Pencil } from "lucide-react";

type MyListingCardProps = {
  id: string;
  title: string;
  price: number;
  condition: "NEW" | "USED";
  city: string;
  imageUrl?: string;
};

function formatPrice(price: number) {
  return `Bs. ${price.toLocaleString("es-BO", { maximumFractionDigits: 0 })}`;
}

export function MyListingCard({
  id,
  title,
  price,
  condition,
  city,
  imageUrl,
}: MyListingCardProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [confirming, setConfirming] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    try {
      const res = await fetch(`/api/listings/${id}`, { method: "DELETE" });
      if (res.ok) {
        router.refresh();
      } else {
        setDeleting(false);
      }
    } catch {
      setDeleting(false);
    }
  }

  return (
    <div className="flex gap-3 rounded-2xl border border-[#E4E4E1] bg-white p-3">
      <Link
        href={`/repuesto/${id}`}
        className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-[#F6F6F4]"
      >
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt={title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[10px] text-[#9CA3AF]">
            Sin foto
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col justify-between">
        <div>
          <Link href={`/repuesto/${id}`}>
            <p className="line-clamp-1 text-sm font-semibold text-[#16181D]">
              {title}
            </p>
          </Link>
          <p className="mt-0.5 text-sm font-extrabold text-[#16181D]">
            {formatPrice(price)}
          </p>
          <div className="mt-0.5 flex items-center gap-2 text-xs text-[#6B7280]">
            <span className="flex items-center gap-1">
              <MapPin size={11} />
              {city}
            </span>
            <span>{condition === "NEW" ? "Nuevo" : "Usado"}</span>
          </div>
        </div>
      </div>

      <div className="flex shrink-0 items-start gap-1">
        {!confirming && (
          <Link
            href={`/mis-publicaciones/${id}/editar`}
            aria-label="Editar publicación"
            className="flex h-8 w-8 items-center justify-center rounded-full text-[#6B7280] transition-colors hover:bg-[#F6F6F4] hover:text-[#16181D]"
          >
            <Pencil size={15} />
          </Link>
        )}
        {confirming ? (
          <div className="flex flex-col items-end gap-1.5">
            <p className="text-[11px] text-[#6B7280]">¿Borrar?</p>
            <div className="flex gap-1.5">
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex items-center gap-1 rounded-full bg-red-600 px-2.5 py-1 text-[11px] font-semibold text-white disabled:opacity-60"
              >
                {deleting ? <Loader2 size={11} className="animate-spin" /> : "Sí"}
              </button>
              <button
                onClick={() => setConfirming(false)}
                disabled={deleting}
                className="rounded-full border border-[#E4E4E1] px-2.5 py-1 text-[11px] font-medium text-[#16181D]"
              >
                No
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setConfirming(true)}
            aria-label="Borrar publicación"
            className="flex h-8 w-8 items-center justify-center rounded-full text-[#6B7280] transition-colors hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
