import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PedidoForm } from "@/components/PedidoForm";

export default async function NuevoPedidoPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login");
  }

  const [marcas, usuario] = await Promise.all([
    prisma.brand.findMany({
      orderBy: { name: "asc" },
      include: { models: { orderBy: { name: "asc" } } },
    }),
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { phone: true },
    }),
  ]);

  return (
    <main className="flex flex-1 flex-col bg-[#F6F6F4] px-4 py-10">
      <div className="mx-auto w-full max-w-xl">
        <Link
          href="/pedidos"
          className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-[#6B7280] hover:text-[#16181D]"
        >
          <ChevronLeft size={16} />
          Volver
        </Link>
        <h1 className="text-2xl font-extrabold tracking-tight text-[#16181D]">
          Publicar pedido
        </h1>
        <p className="mt-1 text-sm text-[#6B7280]">
          Contanos qué repuesto buscás y los vendedores te van a contactar.
        </p>

        <PedidoForm marcas={marcas} defaultPhone={usuario?.phone ?? ""} />
      </div>
    </main>
  );
}
