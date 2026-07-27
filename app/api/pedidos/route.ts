import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return Response.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await req.json();
  const {
    titulo,
    descripcion,
    city,
    department,
    yearFrom,
    yearTo,
    phone,
    brandId,
    modelId,
  } = body;

  if (!titulo || !city) {
    return Response.json(
      { error: "Faltan campos obligatorios" },
      { status: 400 }
    );
  }

  const pedido = await prisma.pedido.create({
    data: {
      titulo,
      descripcion: descripcion || null,
      city,
      department: department || city,
      yearFrom: yearFrom ? parseInt(yearFrom) : null,
      yearTo: yearTo ? parseInt(yearTo) : null,
      phone: phone || null,
      brandId: brandId || null,
      modelId: modelId || null,
      userId: session.user.id,
    },
  });

  return Response.json({ ok: true, pedido });
}

export async function GET() {
  const pedidos = await prisma.pedido.findMany({
    where: { estado: "ABIERTO" },
    orderBy: { createdAt: "desc" },
    include: {
      brand: true,
      model: true,
      user: { select: { id: true, name: true } },
    },
  });

  return Response.json({ ok: true, pedidos });
}
