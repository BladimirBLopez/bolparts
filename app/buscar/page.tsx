import { prisma } from "@/lib/prisma";
import { ListingCard } from "@/components/ListingCard";
import { Search } from "lucide-react";
import Link from "next/link";

const CIUDADES = [
  "La Paz",
  "El Alto",
  "Santa Cruz de la Sierra",
  "Cochabamba",
  "Sucre",
  "Oruro",
  "Potosí",
  "Tarija",
  "Trinidad",
  "Cobija",
];

type SearchParams = Promise<{
  q?: string;
  categoria?: string;
  ciudad?: string;
  condicion?: string;
}>;

export default async function BuscarPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { q, categoria, ciudad, condicion } = await searchParams;

  const categorias = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  const listings = await prisma.listing.findMany({
    where: {
      ...(q
        ? { title: { contains: q, mode: "insensitive" as const } }
        : {}),
      ...(categoria ? { category: { slug: categoria } } : {}),
      ...(ciudad ? { city: ciudad } : {}),
      ...(condicion === "NEW" || condicion === "USED"
        ? { condition: condicion }
        : {}),
    },
    orderBy: { createdAt: "desc" },
    include: {
      images: true,
      brand: true,
      model: true,
    },
  });

  return (
    <main className="flex flex-1 flex-col bg-[#F6F6F4] px-4 py-8">
      <div className="mx-auto w-full max-w-6xl">
        {/* Buscador */}
        <form
          action="/buscar"
          method="GET"
          className="flex items-center gap-2 rounded-full border border-[#E4E4E1] bg-white p-1.5 shadow-sm"
        >
          <Search size={18} className="ml-3 shrink-0 text-[#6B7280]" />
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Buscar repuestos..."
            className="w-full bg-transparent py-2 text-sm text-[#16181D] outline-none placeholder:text-[#9CA3AF]"
          />
          <button
            type="submit"
            className="shrink-0 rounded-full bg-[#FF5A1F] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#e64f16]"
          >
            Buscar
          </button>
        </form>

        {/* Filtros */}
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href="/buscar"
            className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
              !categoria
                ? "border-[#16181D] bg-[#16181D] text-white"
                : "border-[#E4E4E1] bg-white text-[#16181D]"
            }`}
          >
            Todas
          </Link>
          {categorias.map((c) => (
            <Link
              key={c.id}
              href={`/buscar?categoria=${c.slug}${q ? `&q=${q}` : ""}`}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                categoria === c.slug
                  ? "border-[#16181D] bg-[#16181D] text-white"
                  : "border-[#E4E4E1] bg-white text-[#16181D]"
              }`}
            >
              {c.name}
            </Link>
          ))}
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <form action="/buscar" method="GET" className="flex flex-wrap gap-2">
            {q && <input type="hidden" name="q" value={q} />}
            {categoria && (
              <input type="hidden" name="categoria" value={categoria} />
            )}

            <select
              name="ciudad"
              defaultValue={ciudad || ""}
              className="rounded-full border border-[#E4E4E1] bg-white px-3 py-1.5 text-xs font-medium text-[#16181D] outline-none"
            >
              <option value="">Todas las ciudades</option>
              {CIUDADES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <select
              name="condicion"
              defaultValue={condicion || ""}
              className="rounded-full border border-[#E4E4E1] bg-white px-3 py-1.5 text-xs font-medium text-[#16181D] outline-none"
            >
              <option value="">Nuevo y usado</option>
              <option value="NEW">Solo nuevo</option>
              <option value="USED">Solo usado</option>
            </select>

            <button
              type="submit"
              className="rounded-full border border-[#16181D] bg-[#16181D] px-3 py-1.5 text-xs font-semibold text-white"
            >
              Filtrar
            </button>
          </form>
        </div>

        {/* Resultados */}
        <p className="mt-6 text-sm text-[#6B7280]">
          {listings.length}{" "}
          {listings.length === 1 ? "resultado" : "resultados"}
        </p>

        {listings.length === 0 ? (
          <div className="mt-10 flex flex-col items-center gap-2 rounded-2xl border border-dashed border-[#E4E4E1] bg-white py-16 text-center">
            <p className="text-sm font-semibold text-[#16181D]">
              No encontramos repuestos con esos filtros
            </p>
            <p className="text-xs text-[#6B7280]">
              Probá con otra búsqueda o revisá más tarde.
            </p>
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {listings.map((listing) => (
              <ListingCard
                key={listing.id}
                id={listing.id}
                title={listing.title}
                price={listing.price}
                condition={listing.condition}
                city={listing.city}
                imageUrl={listing.images[0]?.url}
                brandName={listing.brand?.name}
                modelName={listing.model?.name}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
