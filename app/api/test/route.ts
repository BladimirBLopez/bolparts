import { prisma } from "@/lib/prisma";
export async function GET() {
  const users = await prisma.user.findMany();

  return Response.json({
    ok: true,
    users,
  });
}