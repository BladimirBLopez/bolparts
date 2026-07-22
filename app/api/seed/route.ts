import { prisma } from "@/lib/prisma";

const categorias = [
  { nombre: "Motor", slug: "motor" },
  { nombre: "Frenos y suspensión", slug: "frenos-suspension" },
  { nombre: "Eléctrico", slug: "electrico" },
  { nombre: "Carrocería y pintura", slug: "carroceria-pintura" },
  { nombre: "Neumáticos y llantas", slug: "neumaticos-llantas" },
  { nombre: "Accesorios e interior", slug: "accesorios-interior" },
];

const marcas: Record<string, string[]> = {
  Toyota: ["Corolla", "Hilux", "RAV4", "Land Cruiser", "Yaris", "Fortuner"],
  Nissan: ["Sentra", "Frontier", "X-Trail", "Versa", "Navara"],
  Suzuki: ["Alto", "Swift", "Vitara", "Jimny", "Baleno"],
  Chevrolet: ["Sail", "Aveo", "Spark", "S10", "Onix"],
  Hyundai: ["Accent", "Tucson", "Elantra", "Santa Fe", "i10"],
  Kia: ["Rio", "Sportage", "Picanto", "Sorento"],
  Volkswagen: ["Gol", "Voyage", "Amarok", "Jetta"],
  Mitsubishi: ["Lancer", "L200", "Montero", "Outlander"],
  Honda: ["Civic", "CR-V", "Fit"],
  Jeep: ["Grand Cherokee", "Wrangler", "Renegade"],
};

export async function GET() {
  const resultadoCategorias = [];
  for (const c of categorias) {
    const cat = await prisma.category.upsert({
      where: { slug: c.slug },
      update: { name: c.nombre },
      create: { name: c.nombre, slug: c.slug },
    });
    resultadoCategorias.push(cat.name);
  }

  const resultadoMarcas: string[] = [];
  for (const [marca, modelos] of Object.entries(marcas)) {
    const brand = await prisma.brand.upsert({
      where: { name: marca },
      update: {},
      create: { name: marca },
    });

    for (const modelo of modelos) {
      const existente = await prisma.carModel.findFirst({
        where: { name: modelo, brandId: brand.id },
      });
      if (!existente) {
        await prisma.carModel.create({
          data: { name: modelo, brandId: brand.id },
        });
      }
    }
    resultadoMarcas.push(marca);
  }

  return Response.json({
    ok: true,
    categorias: resultadoCategorias,
    marcas: resultadoMarcas,
  });
}
