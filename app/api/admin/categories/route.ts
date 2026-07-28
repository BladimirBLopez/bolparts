import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return Response.json({ error: "No autorizado" }, { status: 403 });
  }

  const categorias = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { listings: true } } },
  });

  return Response.json({ ok: true, categorias });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return Response.json({ error: "No autorizado" }, { status: 403 });
  }

  const body = await req.json();
  const { name, tipo } = body;

  if (!name || !name.trim()) {
    return Response.json({ error: "El nombre es requerido" }, { status: 400 });
  }

  const slug = slugify(name);

  const existente = await prisma.category.findUnique({ where: { slug } });
  if (existente) {
    return Response.json(
      { error: "Ya existe una categoría con ese nombre" },
      { status: 400 }
    );
  }

  const categoria = await prisma.category.create({
    data: {
      name: name.trim(),
      slug,
      tipo: tipo === "VEHICULO" ? "VEHICULO" : "REPUESTO",
    },
  });

  return Response.json({ ok: true, categoria });
}
