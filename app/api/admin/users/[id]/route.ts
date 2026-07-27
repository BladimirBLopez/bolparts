import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Role, PlanNivel, Prisma } from "@prisma/client";

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

  const data: Prisma.UserUpdateInput = {};

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
    data.role = body.role as Role;
  }

  if (body.nivelPlan !== undefined) {
    if (!["NINGUNO", "DESTACADO", "SUPERIOR"].includes(body.nivelPlan)) {
      return Response.json({ error: "Nivel de plan inválido" }, { status: 400 });
    }
    data.nivelPlan = body.nivelPlan as PlanNivel;
    if (body.nivelPlan === "NINGUNO") {
      data.planExpiraEn = null;
    } else {
      const dias = 30;
      data.planExpiraEn = new Date(Date.now() + dias * 24 * 60 * 60 * 1000);
    }
  }

  const updated = await prisma.user.update({
    where: { id },
    data,
  });

  return Response.json({ ok: true, user: updated });
}
