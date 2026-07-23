"use client";

import { useCallback, useState } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

const SANTA_CRUZ = { lat: -17.7833, lng: -63.1821 };

export function LocationPicker({
  initialLat,
  initialLng,
  onChange,
}: {
  initialLat?: number | null;
  initialLng?: number | null;
  onChange: (lat: number, lng: number) => void;
}) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  const [position, setPosition] = useState({
    lat: initialLat ?? SANTA_CRUZ.lat,
    lng: initialLng ?? SANTA_CRUZ.lng,
  });

  const handleDragEnd = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (!e.latLng) return;
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setPosition({ lat, lng });
      onChange(lat, lng);
    },
    [onChange]
  );

  if (!isLoaded) {
    return (
      <div className="flex h-56 w-full items-center justify-center rounded-xl border border-[#E4E4E1] bg-[#F6F6F4] text-xs text-[#6B7280]">
        Cargando mapa...
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-[#E4E4E1]">
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "224px" }}
        center={position}
        zoom={14}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
        }}
      >
        <Marker
          position={position}
          draggable
          onDragEnd={handleDragEnd}
        />
      </GoogleMap>
    </div>
  );
}
