import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return Response.json({ error: "No autorizado" }, { status: 403 });
  }

  const body = await req.json();
  const { name, brandId } = body;

  if (!name || typeof name !== "string" || name.trim().length === 0) {
    return Response.json({ error: "El nombre es requerido" }, { status: 400 });
  }
  if (!brandId || typeof brandId !== "string") {
    return Response.json({ error: "La marca es requerida" }, { status: 400 });
  }

  try {
    const model = await prisma.carModel.create({
      data: { name: name.trim(), brandId },
    });
    return Response.json({ ok: true, model });
  } catch {
    return Response.json(
      { error: "No se pudo crear el modelo" },
      { status: 400 }
    );
  }
}
