import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return Response.json({ error: "No autorizado" }, { status: 403 });
  }

  const { id } = await params;

  try {
    await prisma.category.delete({ where: { id } });
    return Response.json({ ok: true });
  } catch {
    return Response.json(
      { error: "No se pudo borrar: puede tener publicaciones activas" },
      { status: 400 }
    );
  }
}
