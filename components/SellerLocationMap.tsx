"use client";

import dynamic from "next/dynamic";
import { Navigation } from "lucide-react";

const LeafletMap = dynamic(() => import("./LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-40 w-full items-center justify-center rounded-xl border border-[#E4E4E1] bg-[#F6F6F4] text-xs text-[#6B7280]">
      Cargando mapa...
    </div>
  ),
});

export function SellerLocationMap({
  lat,
  lng,
}: {
  lat: number;
  lng: number;
}) {
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

  return (
    <div>
      <a
        href={directionsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="isolate block overflow-hidden rounded-xl border border-[#E4E4E1]"
      >
        <LeafletMap
          position={{ lat, lng }}
          interactive={false}
          height="180px"
        />
      </a>
      <a
        href={directionsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 flex w-fit items-center gap-1.5 rounded-full border border-[#E4E4E1] bg-white px-3 py-1.5 text-xs font-semibold text-[#16181D] transition-colors hover:border-[#16181D]"
      >
        <Navigation size={13} />
        Cómo llegar
      </a>
    </div>
  );
}
