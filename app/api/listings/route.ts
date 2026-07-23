import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return Response.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      title,
      description,
      price,
      condition,
      city,
      department,
      year,
      phone,
      categoryId,
      brandId,
      modelId,
      images,
    } = body;

    if (!title || !price || !condition || !city || !department || !categoryId) {
      return Response.json(
        { error: "Faltan campos obligatorios" },
        { status: 400 }
      );
    }

    if (!images || images.length === 0) {
      return Response.json(
        { error: "Agregá al menos una foto" },
        { status: 400 }
      );
    }

    const listing = await prisma.listing.create({
      data: {
        title,
        description: description || null,
        price: parseFloat(price),
        condition,
        city,
        department,
        year: year ? parseInt(year) : null,
        phone: phone || null,
        userId: session.user.id,
        categoryId,
        brandId: brandId || null,
        modelId: modelId || null,
        images: {
          create: images.map((url: string) => ({ url })),
        },
      },
    });

    if (session.user.role === "USER") {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { role: "SELLER" },
      });
    }

    return Response.json({ ok: true, listing });
  } catch (err) {
    console.error(err);
    return Response.json(
      { error: "No se pudo crear la publicación" },
      { status: 500 }
    );
  }
}

export async function GET() {
  const listings = await prisma.listing.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      images: true,
      category: true,
      brand: true,
      model: true,
      user: { select: { name: true } },
    },
  });

  return Response.json({ ok: true, listings });
}
