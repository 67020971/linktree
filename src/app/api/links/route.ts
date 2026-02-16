import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query")?.trim() || "";
  const categoryId = searchParams.get("categoryId") || "";

  const links = await prisma.link.findMany({
    where: {
      AND: [
        categoryId ? { categoryId } : {},
        query
          ? {
              OR: [
                { title: { contains: query } },
                { url: { contains: query } },
                { description: { contains: query } },
              ],
            }
          : {},
      ],
    },
    include: { category: true },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json(links);
}

export async function POST(req: Request) {
  const body = await req.json();
  const { title, url, description, categoryId } = body;

  if (!title || !url) {
    return NextResponse.json({ message: "title and url are required" }, { status: 400 });
  }

  const created = await prisma.link.create({
    data: { title, url, description, categoryId: categoryId || null },
  });

  return NextResponse.json(created, { status: 201 });
}