"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Star, Loader2 } from "lucide-react";

export function ReviewForm({
  sellerId,
  initialRating = 0,
  initialComment = "",
}: {
  sellerId: string;
  initialRating?: number;
  initialComment?: string;
}) {
  const router = useRouter();
  const [rating, setRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState(initialComment);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (rating === 0) {
      setError("Elegí una calificación");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sellerId, rating, comment }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "No se pudo enviar la reseña");
        setSubmitting(false);
        return;
      }

      setSent(true);
      router.refresh();
    } catch {
      setError("Error de conexión");
    } finally {
      setSubmitting(false);
    }
  }

  if (sent) {
    return (
      <div className="rounded-2xl border border-[#E4E4E1] bg-white p-4 text-sm text-[#16181D]">
        ¡Gracias por tu reseña!
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 rounded-2xl border border-[#E4E4E1] bg-white p-4"
    >
      <p className="text-sm font-semibold text-[#16181D]">Calificar vendedor</p>

      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <button
            key={i}
            type="button"
            onClick={() => setRating(i)}
            onMouseEnter={() => setHoverRating(i)}
            onMouseLeave={() => setHoverRating(0)}
            aria-label={`${i} estrellas`}
          >
            <Star
              size={26}
              className={
                i <= (hoverRating || rating)
                  ? "text-[#FF5A1F]"
                  : "text-[#E4E4E1]"
              }
              fill={i <= (hoverRating || rating) ? "currentColor" : "none"}
            />
          </button>
        ))}
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={3}
        placeholder="Contá cómo fue tu experiencia (opcional)"
        className="w-full resize-none rounded-xl border border-[#E4E4E1] bg-[#F6F6F4] px-3 py-2.5 text-sm text-[#16181D] outline-none placeholder:text-[#9CA3AF] focus:border-[#16181D]"
      />

      {error && <p className="text-xs text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="flex items-center justify-center gap-2 self-start rounded-full bg-[#FF5A1F] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#e64f16] disabled:opacity-60"
      >
        {submitting && <Loader2 size={14} className="animate-spin" />}
        Enviar reseña
      </button>
    </form>
  );
}
