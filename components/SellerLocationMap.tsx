"use client";

import dynamic from "next/dynamic";

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
  return (
    <div className="isolate overflow-hidden rounded-xl border border-[#E4E4E1]">
      <LeafletMap
        position={{ lat, lng }}
        interactive={false}
        height="180px"
      />
    </div>
  );
}
