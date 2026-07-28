"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";

const markerIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function RecenterOnChange({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], map.getZoom());
  }, [lat, lng, map]);
  return null;
}

export default function LeafletMap({
  position,
  onPositionChange,
  interactive = true,
  height = "224px",
}: {
  position: { lat: number; lng: number };
  onPositionChange?: (lat: number, lng: number) => void;
  interactive?: boolean;
  height?: string;
}) {
  return (
    <MapContainer
      center={[position.lat, position.lng]}
      zoom={14}
      style={{ width: "100%", height }}
      scrollWheelZoom={false}
      dragging={interactive}
      zoomControl={interactive}
      doubleClickZoom={interactive}
      touchZoom={interactive}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker
        position={[position.lat, position.lng]}
        icon={markerIcon}
        draggable={interactive}
        eventHandlers={
          interactive
            ? {
                dragend: (e) => {
                  const marker = e.target;
                  const { lat, lng } = marker.getLatLng();
                  onPositionChange?.(lat, lng);
                },
              }
            : undefined
        }
      />
      <RecenterOnChange lat={position.lat} lng={position.lng} />
    </MapContainer>
  );
}
