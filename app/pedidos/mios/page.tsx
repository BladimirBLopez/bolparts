import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus, ChevronLeft } from "lucide-react";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { MiPedidoCard } from "@/components/MiPedidoCard";

export default async function MisPedidosPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login");
  }

  const pedidos = await prisma.pedido.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="flex flex-1 flex-col bg-[#F6F6F4] px-4 py-8">
      <div className="mx-auto w-full max-w-2xl">
        <Link
          href="/pedidos"
          className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-[#6B7280] hover:text-[#16181D]"
        >
          <ChevronLeft size={16} />
          Volver a pedidos
        </Link>

        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-extrabold tracking-tight text-[#16181D]">
            Mis pedidos
          </h1>
          <Link
            href="/pedidos/nuevo"
            className="flex items-center gap-1.5 rounded-full bg-[#FF5A1F] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#e64f16]"
          >
            <Plus size={16} />
            Nuevo
          </Link>
        </div>

        {pedidos.length === 0 ? (
          <div className="mt-10 flex flex-col items-center gap-2 rounded-2xl border border-dashed border-[#E4E4E1] bg-white py-16 text-center">
            <p className="text-sm font-semibold text-[#16181D]">
              Todavía no publicaste ningún pedido
            </p>
            <Link
              href="/pedidos/nuevo"
              className="mt-2 rounded-full bg-[#FF5A1F] px-5 py-2.5 text-sm font-semibold text-white"
            >
              Publicar mi primer pedido
            </Link>
          </div>
        ) : (
          <div className="mt-6 flex flex-col gap-3">
            {pedidos.map((p) => (
              <MiPedidoCard
                key={p.id}
                id={p.id}
                titulo={p.titulo}
                city={p.city}
                estado={p.estado}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
