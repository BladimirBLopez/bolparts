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
  const body = await req.json();

  const data: { role?: string; isPremium?: boolean } = {};

  if (body.role !== undefined) {
    if (!["USER", "SELLER", "ADMIN"].includes(body.role)) {
      return Response.json({ error: "Rol inválido" }, { status: 400 });
    }
    if (id === session.user.id) {
      return Response.json(
        { error: "No podés cambiar tu propio rol" },
        { status: 400 }
      );
    }
    data.role = body.role;
  }

  if (body.isPremium !== undefined) {
    data.isPremium = !!body.isPremium;
  }

  const updated = await prisma.user.update({
    where: { id },
    data,
  });

  return Response.json({ ok: true, user: updated });
}
