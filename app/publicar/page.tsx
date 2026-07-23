import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PublicarForm } from "@/components/PublicarForm";

export default async function PublicarPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/login");
  }

  const [categorias, marcas] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.brand.findMany({
      orderBy: { name: "asc" },
      include: { models: { orderBy: { name: "asc" } } },
    }),
  ]);

  return (
    <main className="flex flex-1 flex-col bg-[#F6F6F4] px-4 py-10">
      <div className="mx-auto w-full max-w-xl">
        <h1 className="text-2xl font-extrabold tracking-tight text-[#16181D]">
          Publicar repuesto
        </h1>
        <p className="mt-1 text-sm text-[#6B7280]">
          Completá los datos y subí fotos claras del repuesto.
        </p>

        <PublicarForm categorias={categorias} marcas={marcas} />
      </div>
    </main>
  );
}
