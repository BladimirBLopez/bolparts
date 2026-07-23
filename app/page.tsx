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
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { HomeVehiclePicker } from "@/components/HomeVehiclePicker";

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
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {categorias.map(({ nombre, slug, icon: Icon }) => (
              <Link
                key={slug}
                href={`/buscar?categoria=${slug}`}
                className="group flex flex-col items-start gap-3 rounded-2xl border border-[#E4E4E1] bg-white p-4 transition-colors hover:border-[#16181D]"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F6F6F4] text-[#16181D] transition-colors group-hover:bg-[#FF5A1F] group-hover:text-white">
                  <Icon size={18} />
                </span>
                <span className="text-sm font-semibold text-[#16181D]">
                  {nombre}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Confianza */}
      <section className="border-y border-[#E4E4E1] bg-white px-4 py-10">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 text-center sm:grid-cols-3">
          <div>
            <p className="text-2xl font-extrabold text-[#16181D]">100%</p>
            <p className="mt-1 text-sm text-[#6B7280]">Contacto directo con el vendedor</p>
          </div>
          <div>
            <p className="text-2xl font-extrabold text-[#16181D]">Nuevos y usados</p>
            <p className="mt-1 text-sm text-[#6B7280]">Repuestos para todo tipo de vehículo</p>
          </div>
          <div>
            <p className="text-2xl font-extrabold text-[#16181D]">9 departamentos</p>
            <p className="mt-1 text-sm text-[#6B7280]">Publicaciones de todo el país</p>
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
