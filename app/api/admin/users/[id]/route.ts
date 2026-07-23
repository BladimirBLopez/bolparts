import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return Response.json({ error: "No autorizado" }, { status: 403 });
  }

  const { id } = await params;
  const { role } = await req.json();

  if (!["USER", "SELLER", "ADMIN"].includes(role)) {
    return Response.json({ error: "Rol inválido" }, { status: 400 });
  }

  if (id === session.user.id) {
    return Response.json(
      { error: "No podés cambiar tu propio rol" },
      { status: 400 }
    );
  }

  const updated = await prisma.user.update({
    where: { id },
    data: { role },
  });

  return Response.json({ ok: true, user: updated });
}
