import Link from "next/link";
import {
  Search,
  Wrench,
  Gauge,
  Zap,
  PaintBucket,
  CircleDot,
  Armchair,
  ArrowRight,
  Car,
  MessageCircleHeart,
  PackageCheck,
  MapPinned,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { HomeVehiclePicker } from "@/components/HomeVehiclePicker";
import { ScrollCarousel } from "@/components/ScrollCarousel";

const categorias = [
  { nombre: "Motor", slug: "motor", icon: Wrench },
  { nombre: "Frenos y suspensión", slug: "frenos-suspension", icon: Gauge },
  { nombre: "Eléctrico", slug: "electrico", icon: Zap },
  { nombre: "Carrocería y pintura", slug: "carroceria-pintura", icon: PaintBucket },
  { nombre: "Neumáticos y llantas", slug: "neumaticos-llantas", icon: CircleDot },
  { nombre: "Accesorios e interior", slug: "accesorios-interior", icon: Armchair },
];

export default async function Home() {
  const marcas = await prisma.brand.findMany({
    orderBy: { name: "asc" },
    include: { models: { orderBy: { name: "asc" } } },
  });

  return (
    <main className="flex flex-1 flex-col bg-[#F6F6F4]">
      {/* Hero */}
      <section className="border-b border-[#E4E4E1] px-4 py-14 sm:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-block rounded-full border border-[#E4E4E1] bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
            Repuestos en toda Bolivia
          </span>
          <h1 className="mt-5 text-3xl font-extrabold leading-tight tracking-tight text-[#16181D] sm:text-5xl">
            Encontrá el repuesto que tu auto necesita
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-[#6B7280] sm:text-lg">
            Comprá y vendé repuestos nuevos y usados directamente con otros
            bolivianos. Sin intermediarios.
          </p>

          <form
            action="/buscar"
            method="GET"
            className="mx-auto mt-8 flex max-w-xl items-center gap-2 rounded-full border border-[#E4E4E1] bg-white p-1.5 shadow-sm"
          >
            <Search size={18} className="ml-3 shrink-0 text-[#6B7280]" />
            <input
              type="text"
              name="q"
              placeholder="Ej. pastillas de freno para Toyota Corolla"
              className="w-full bg-transparent py-2 text-sm text-[#16181D] outline-none placeholder:text-[#9CA3AF]"
            />
            <button
              type="submit"
              className="shrink-0 rounded-full bg-[#FF5A1F] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#e64f16]"
            >
              Buscar
            </button>
          </form>

          <HomeVehiclePicker marcas={marcas} />
        </div>
      </section>

      {/* Categorías */}
      <section className="px-4 py-12 sm:py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-xl font-extrabold tracking-tight text-[#16181D]">
            Categorías
          </h2>
          <div className="mt-6">
            <ScrollCarousel>
              {categorias.map(({ nombre, slug, icon: Icon }) => (
                <Link
                  key={slug}
                  href={`/buscar?categoria=${slug}`}
                  className="group flex w-36 shrink-0 snap-start flex-col items-center gap-3 rounded-2xl border border-[#E4E4E1] bg-white px-4 py-6 text-center transition-colors hover:border-[#16181D]"
                >
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F6F6F4] text-[#16181D] transition-colors group-hover:bg-[#FF5A1F] group-hover:text-white">
                    <Icon size={24} />
                  </span>
                  <span className="text-sm font-semibold leading-snug text-[#16181D]">
                    {nombre}
                  </span>
                </Link>
              ))}
            </ScrollCarousel>
          </div>
        </div>
      </section>

      {/* Marcas */}
      {marcas.length > 0 && (
        <section className="border-y border-[#E4E4E1] bg-white px-4 py-12 sm:py-16">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-xl font-extrabold tracking-tight text-[#16181D]">
              Buscá por marca
            </h2>
            <div className="mt-6">
              <ScrollCarousel>
                {marcas.map((marca) => (
                  <Link
                    key={marca.id}
                    href={`/buscar?marca=${marca.id}`}
                    className="group flex w-36 shrink-0 snap-start flex-col items-center justify-center gap-2 rounded-2xl border border-[#E4E4E1] bg-[#F6F6F4] px-4 py-8 text-center transition-colors hover:border-[#16181D] hover:bg-white"
                  >
                    <Car
                      size={22}
                      className="text-[#6B7280] transition-colors group-hover:text-[#FF5A1F]"
                    />
                    <span className="text-sm font-bold text-[#16181D]">
                      {marca.name}
                    </span>
                    <span className="text-[11px] text-[#6B7280]">
                      {marca.models.length}{" "}
                      {marca.models.length === 1 ? "modelo" : "modelos"}
                    </span>
                  </Link>
                ))}
              </ScrollCarousel>
            </div>
          </div>
        </section>
      )}

      {/* Confianza */}
      <section className="px-4 py-12 sm:py-16">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-[#E4E4E1] bg-white px-6 py-8 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F6F6F4] text-[#FF5A1F]">
                <MessageCircleHeart size={22} />
              </span>
              <p className="text-lg font-extrabold tracking-tight text-[#16181D]">
                Contacto 100% directo
              </p>
              <p className="text-sm text-[#6B7280]">
                Hablás con el vendedor por WhatsApp, sin intermediarios.
              </p>
            </div>

            <div className="flex flex-col items-center gap-3 rounded-2xl border border-[#E4E4E1] bg-white px-6 py-8 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F6F6F4] text-[#FF5A1F]">
                <PackageCheck size={22} />
              </span>
              <p className="text-lg font-extrabold tracking-tight text-[#16181D]">
                Nuevos y usados
              </p>
              <p className="text-sm text-[#6B7280]">
                Repuestos para todo tipo de vehículo, en cualquier estado.
              </p>
            </div>

            <div className="flex flex-col items-center gap-3 rounded-2xl border border-[#E4E4E1] bg-white px-6 py-8 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F6F6F4] text-[#FF5A1F]">
                <MapPinned size={22} />
              </span>
              <p className="text-lg font-extrabold tracking-tight text-[#16181D]">
                Los 9 departamentos
              </p>
              <p className="text-sm text-[#6B7280]">
                Publicaciones de vendedores de todo el país.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA vender */}
      <section className="px-4 py-14 sm:py-20">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 rounded-3xl bg-[#16181D] px-6 py-12 text-center sm:px-12">
          <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            ¿Tenés repuestos para vender?
          </h2>
          <p className="max-w-md text-sm text-[#9CA3AF] sm:text-base">
            Publicá gratis y llegá a compradores de todo el país en minutos.
          </p>
          <Link
            href="/publicar"
            className="mt-2 flex items-center gap-2 rounded-full bg-[#FF5A1F] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#e64f16]"
          >
            Publicar repuesto
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </main>
  );
}
