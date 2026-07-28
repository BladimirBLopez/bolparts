"use client";

import { useCallback, useState } from "react";
import dynamic from "next/dynamic";
import { LocateFixed } from "lucide-react";

const SANTA_CRUZ = { lat: -17.7833, lng: -63.1821 };

const LeafletMap = dynamic(() => import("./LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-56 w-full items-center justify-center rounded-xl border border-[#E4E4E1] bg-[#F6F6F4] text-xs text-[#6B7280]">
      Cargando mapa...
    </div>
  ),
});

export function LocationPicker({
  initialLat,
  initialLng,
  onChange,
}: {
  initialLat?: number | null;
  initialLng?: number | null;
  onChange: (lat: number, lng: number) => void;
}) {
  const [position, setPosition] = useState({
    lat: initialLat ?? SANTA_CRUZ.lat,
    lng: initialLng ?? SANTA_CRUZ.lng,
  });

  const handlePositionChange = useCallback(
    (lat: number, lng: number) => {
      setPosition({ lat, lng });
      onChange(lat, lng);
    },
    [onChange]
  );

  function handleUseMyLocation() {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      handlePositionChange(pos.coords.latitude, pos.coords.longitude);
    });
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleUseMyLocation}
        className="mb-2 flex items-center gap-1.5 rounded-full border border-[#E4E4E1] bg-white px-3 py-1.5 text-xs font-semibold text-[#16181D] transition-colors hover:border-[#16181D]"
      >
        <LocateFixed size={13} />
        Usar mi ubicación actual
      </button>
      <div className="isolate overflow-hidden rounded-xl border border-[#E4E4E1]">
        <LeafletMap position={position} onPositionChange={handlePositionChange} />
      </div>
    </div>
  );
}
