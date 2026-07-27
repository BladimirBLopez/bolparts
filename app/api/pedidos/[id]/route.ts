import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return Response.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id } = await params;
  const pedido = await prisma.pedido.findUnique({ where: { id } });

  if (!pedido) {
    return Response.json({ error: "Pedido no encontrado" }, { status: 404 });
  }
  if (pedido.userId !== session.user.id) {
    return Response.json({ error: "No autorizado" }, { status: 403 });
  }

  const body = await req.json();
  const updated = await prisma.pedido.update({
    where: { id },
    data: { estado: body.estado === "RESUELTO" ? "RESUELTO" : "ABIERTO" },
  });

  return Response.json({ ok: true, pedido: updated });
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return Response.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id } = await params;
  const pedido = await prisma.pedido.findUnique({ where: { id } });

  if (!pedido) {
    return Response.json({ error: "Pedido no encontrado" }, { status: 404 });
  }
  if (pedido.userId !== session.user.id && session.user.role !== "ADMIN") {
    return Response.json({ error: "No autorizado" }, { status: 403 });
  }

  await prisma.pedido.delete({ where: { id } });
  return Response.json({ ok: true });
}
