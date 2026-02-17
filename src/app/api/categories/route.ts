import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { links: true },
      },
    },
    orderBy: { name: "asc" },
  });

  return NextResponse.json(categories);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, url, description, categoryId } = body;

    if (!title || !url) {
      return NextResponse.json(
        { message: "title and url are required" },
        { status: 400 }
      );
    }

    const created = await prisma.link.create({
      data: {
        title,
        url,
        description,
        categoryId: categoryId || null, // 🔥 สำคัญมาก
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error: any) {
    console.error("POST ERROR:", error);
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}

