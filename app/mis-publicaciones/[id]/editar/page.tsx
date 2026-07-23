import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PublicarForm } from "@/components/PublicarForm";

export default async function EditarPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login");
  }

  const { id } = await params;

  const [listing, categorias, marcas] = await Promise.all([
    prisma.listing.findUnique({
      where: { id },
      include: { images: true },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.brand.findMany({
      orderBy: { name: "asc" },
      include: { models: { orderBy: { name: "asc" } } },
    }),
  ]);

  if (!listing) {
    notFound();
  }

  if (listing.userId !== session.user.id) {
    redirect("/mis-publicaciones");
  }

  return (
    <main className="flex flex-1 flex-col bg-[#F6F6F4] px-4 py-10">
      <div className="mx-auto w-full max-w-xl">
        <h1 className="text-2xl font-extrabold tracking-tight text-[#16181D]">
          Editar publicación
        </h1>
        <p className="mt-1 text-sm text-[#6B7280]">
          Actualizá los datos de tu repuesto.
        </p>

        <PublicarForm
          categorias={categorias}
          marcas={marcas}
          initialListing={listing}
        />
      </div>
    </main>
  );
}
