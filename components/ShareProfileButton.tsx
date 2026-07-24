"use client";

import { useState } from "react";
import { Share2, Check } from "lucide-react";

export function ShareProfileButton({
  sellerName,
}: {
  sellerName: string;
}) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url = window.location.href;
    const shareData = {
      title: `${sellerName} — BolParts`,
      text: `Mirá el perfil de ${sellerName} en BolParts`,
      url,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // El usuario canceló el share, no hacemos nada
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Silenciosamente ignoramos si tampoco hay clipboard
    }
  }

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-1.5 rounded-full border border-[#E4E4E1] bg-white px-3 py-1.5 text-xs font-semibold text-[#16181D] transition-colors hover:border-[#16181D]"
    >
      {copied ? <Check size={13} /> : <Share2 size={13} />}
      {copied ? "Enlace copiado" : "Compartir perfil"}
    </button>
  );
}
