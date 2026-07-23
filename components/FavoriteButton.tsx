"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";

export function FavoriteButton({
  listingId,
  initialFavorited,
  loggedIn,
}: {
  listingId: string;
  initialFavorited: boolean;
  loggedIn: boolean;
}) {
  const router = useRouter();
  const [favorited, setFavorited] = useState(initialFavorited);
  const [loading, setLoading] = useState(false);

  async function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (!loggedIn) {
      router.push("/login");
      return;
    }

    setLoading(true);
    const prev = favorited;
    setFavorited(!prev);

    try {
      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId }),
      });
      if (!res.ok) {
        setFavorited(prev);
      } else {
        router.refresh();
      }
    } catch {
      setFavorited(prev);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      aria-label={favorited ? "Quitar de favoritos" : "Agregar a favoritos"}
      className={`flex h-8 w-8 items-center justify-center rounded-full backdrop-blur transition-colors ${
        favorited
          ? "bg-[#FF5A1F] text-white"
          : "bg-white/90 text-[#16181D] hover:bg-white"
      }`}
    >
      <Heart size={15} fill={favorited ? "currentColor" : "none"} />
    </button>
  );
}
