import { getServerSession } from "next-auth";
import Link from "next/link";
import { Plus, MapPin, Calendar } from "lucide-react";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { expirarPlanesVencidos } from "@/lib/expirarPlanes";
import { PedidoContacto } from "@/components/PedidoContacto";

export const dynamic = "force-dynamic";

function formatFecha(date: Date) {
  return new Intl.DateTimeFormat("es-BO", {
    day: "numeric",
    month: "short",
  }).format(date);
}

export default async function PedidosPage() {
  await expirarPlanesVencidos();

  const session = await getServerSession(authOptions);

  const [pedidos, usuario] = await Promise.all([
    prisma.pedido.findMany({
      where: { estado: "ABIERTO" },
      orderBy: { createdAt: "desc" },
      include: {
        brand: true,
        model: true,
        user: { select: { id: true, name: true } },
      },
    }),
    session?.user?.id
      ? prisma.user.findUnique({
          where: { id: session.user.id },
          select: { nivelPlan: true },
        })
      : null,
  ]);

  const tienePlanActivo = usuario?.nivelPlan && usuario.nivelPlan !== "NINGUNO";

  return (
    <main className="flex flex-1 flex-col bg-[#F6F6F4] px-4 py-8">
      <div className="mx-auto w-full max-w-3xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-[#16181D]">
              Pedidos de repuestos
            </h1>
            <p className="mt-1 text-sm text-[#6B7280]">
              Compradores buscando repuestos que quizás vos tenés.
            </p>
          </div>
          <Link
            href="/pedidos/nuevo"
            className="flex shrink-0 items-center gap-1.5 rounded-full bg-[#FF5A1F] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#e64f16]"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">Publicar</span>
          </Link>
        </div>

        {!tienePlanActivo && (
          <div className="mt-4 rounded-2xl bg-[#16181D] px-5 py-4 text-white">
            <p className="text-sm font-semibold">
              Destacá tu cuenta para contactar compradores
            </p>
            <p className="mt-0.5 text-xs text-white/60">
              Con un plan activo podés ver el WhatsApp de cada pedido.
            </p>
            <Link
              href="/planes"
              className="mt-2 inline-block rounded-full bg-[#FF5A1F] px-4 py-2 text-xs font-semibold text-white"
            >
              Ver planes
            </Link>
          </div>
        )}

        {pedidos.length === 0 ? (
          <div className="mt-10 flex flex-col items-center gap-2 rounded-2xl border border-dashed border-[#E4E4E1] bg-white py-16 text-center">
            <p className="text-sm font-semibold text-[#16181D]">
              No hay pedidos abiertos todavía
            </p>
            <Link
              href="/pedidos/nuevo"
              className="mt-2 rounded-full bg-[#FF5A1F] px-5 py-2.5 text-sm font-semibold text-white"
            >
              Publicar el primer pedido
            </Link>
          </div>
        ) : (
          <div className="mt-6 flex flex-col gap-3">
            {pedidos.map((p) => (
              <div
                key={p.id}
                className="rounded-2xl border border-[#E4E4E1] bg-white p-4"
              >
                <p className="font-semibold text-[#16181D]">{p.titulo}</p>
                {(p.brand || p.model) && (
                  <p className="mt-0.5 text-sm text-[#6B7280]">
                    {[p.brand?.name, p.model?.name].filter(Boolean).join(" ")}
                  </p>
                )}
                {p.descripcion && (
                  <p className="mt-1.5 text-sm text-[#6B7280]">
                    {p.descripcion}
                  </p>
                )}
                <div className="mt-2 flex items-center gap-3 text-xs text-[#6B7280]">
                  <span className="flex items-center gap-1">
                    <MapPin size={12} />
                    {p.city}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    {formatFecha(p.createdAt)}
                  </span>
                </div>

                <div className="mt-3">
                  <PedidoContacto
                    tienePlanActivo={!!tienePlanActivo}
                    loggedIn={!!session?.user}
                    phone={p.phone}
                    titulo={p.titulo}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
