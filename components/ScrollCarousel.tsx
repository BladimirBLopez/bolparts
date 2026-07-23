"use client";

import { useRef } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";

export function ScrollCarousel({ children }: { children: React.ReactNode }) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  function scroll(direction: "left" | "right") {
    const el = scrollerRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.8;
    el.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  }

  return (
    <div className="relative">
      <div
        ref={scrollerRef}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </div>

      <button
        type="button"
        onClick={() => scroll("left")}
        aria-label="Anterior"
        className="absolute -left-2 top-1/2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-[#E4E4E1] bg-white text-[#16181D] shadow-sm sm:flex"
      >
        <ChevronLeft size={16} />
      </button>
      <button
        type="button"
        onClick={() => scroll("right")}
        aria-label="Siguiente"
        className="absolute -right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-[#E4E4E1] bg-white text-[#16181D] shadow-sm"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
