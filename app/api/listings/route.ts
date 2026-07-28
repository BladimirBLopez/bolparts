import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateUniqueSlug } from "@/lib/slug";

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
      yearFrom,
      yearTo,
      phone,
      categoryId,
      brandId,
      modelId,
      images,
      numeroParte,
      compatibilidades,
      peso,
      largo,
      alto,
      ancho,
    } = body;

    if (!title || !price || !condition || !city || !department || !categoryId) {
      return Response.json(
        { error: "Faltan campos obligatorios" },
        { status: 400 }
      );
    }

    const precioNum = parseFloat(price);
    if (isNaN(precioNum) || precioNum <= 0) {
      return Response.json(
        { error: "El precio debe ser un número válido mayor a 0" },
        { status: 400 }
      );
    }

    if (!images || images.length === 0) {
      return Response.json(
        { error: "Agregá al menos una foto" },
        { status: 400 }
      );
    }

    const slug = await generateUniqueSlug(title, async (candidate) => {
      const existing = await prisma.listing.findUnique({
        where: { slug: candidate },
      });
      return !!existing;
    });

    const listing = await prisma.listing.create({
      data: {
        title,
        slug,
        description: description || null,
        price: precioNum,
        condition,
        city,
        department,
        yearFrom: yearFrom ? parseInt(yearFrom) : null,
        yearTo: yearTo ? parseInt(yearTo) : null,
        phone: phone || null,
        numeroParte: numeroParte || null,
        peso: peso ? parseFloat(peso) : null,
        largo: largo ? parseFloat(largo) : null,
        alto: alto ? parseFloat(alto) : null,
        ancho: ancho ? parseFloat(ancho) : null,
        userId: session.user.id,
        categoryId,
        brandId: brandId || null,
        modelId: modelId || null,
        images: {
          create: images.map((url: string) => ({ url })),
        },
        compatibilidades: {
          create: Array.isArray(compatibilidades)
            ? compatibilidades.map(
                (c: {
                  brandId?: string;
                  modelId?: string;
                  yearFrom?: string;
                  yearTo?: string;
                }) => ({
                  brandId: c.brandId || null,
                  modelId: c.modelId || null,
                  yearFrom: c.yearFrom ? parseInt(c.yearFrom) : null,
                  yearTo: c.yearTo ? parseInt(c.yearTo) : null,
                })
              )
            : [],
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
