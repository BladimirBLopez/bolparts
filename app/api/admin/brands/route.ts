import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return Response.json({ error: "No autorizado" }, { status: 403 });
  }

  const brands = await prisma.brand.findMany({
    orderBy: { name: "asc" },
    include: { models: { orderBy: { name: "asc" } } },
  });

  return Response.json({ ok: true, brands });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return Response.json({ error: "No autorizado" }, { status: 403 });
  }

  const body = await req.json();
  const { name, tipo } = body;

  if (!name || typeof name !== "string" || name.trim().length === 0) {
    return Response.json({ error: "El nombre es requerido" }, { status: 400 });
  }
  if (!["AUTO", "MOTO", "CAMION"].includes(tipo)) {
    return Response.json({ error: "Tipo de vehículo inválido" }, { status: 400 });
  }

  try {
    const brand = await prisma.brand.create({
      data: { name: name.trim(), tipo },
    });
    return Response.json({ ok: true, brand });
  } catch {
    return Response.json(
      { error: "Ya existe una marca con ese nombre" },
      { status: 400 }
    );
  }
}
