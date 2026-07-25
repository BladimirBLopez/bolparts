"use client";

import { useState } from "react";
import Image from "next/image";

export function ListingGallery({
  images,
  title,
}: {
  images: { id: string; url: string }[];
  title: string;
}) {
  const [selected, setSelected] = useState(images[0]?.url);

  if (images.length === 0) {
    return (
      <div className="aspect-square w-full overflow-hidden rounded-2xl border border-[#E4E4E1] bg-white">
        <div className="flex h-full w-full items-center justify-center text-sm text-[#9CA3AF]">
          Sin foto
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-[#E4E4E1] bg-white">
        <Image
          src={selected}
          alt={title}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
      </div>

      {images.length > 1 && (
        <div className="mt-3 grid grid-cols-4 gap-2">
          {images.map((img) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setSelected(img.url)}
              className={
                "relative aspect-square overflow-hidden rounded-xl border bg-white transition-colors " +
                (selected === img.url
                  ? "border-[#FF5A1F] border-2"
                  : "border-[#E4E4E1]")
              }
            >
              <Image
                src={img.url}
                alt={title}
                fill
                sizes="25vw"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
