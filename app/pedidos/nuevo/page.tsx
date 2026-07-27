import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
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
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-[#16181D]">
              Pedir un repuesto
            </h1>
            <p className="mt-1 text-sm text-[#6B7280]">
              Contanos qué buscás y los vendedores te van a contactar.
            </p>
          </div>
          <Link
            href="/pedidos"
            className="shrink-0 rounded-full border border-[#E4E4E1] bg-white px-3 py-2 text-xs font-semibold text-[#16181D] transition-colors hover:border-[#16181D]"
          >
            Ver pedidos
          </Link>
        </div>

        <PedidoForm marcas={marcas} defaultPhone={usuario?.phone ?? ""} />
      </div>
    </main>
  );
}
