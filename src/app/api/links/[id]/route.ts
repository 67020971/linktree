import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(_: Request, { params }: { params: { id: string } }) {
  const body = await _.json();
  const { title, url, description, categoryId } = body;

  const updated = await prisma.link.update({
    where: { id: params.id },
    data: { title, url, description, categoryId: categoryId || null },
  });

  return NextResponse.json(updated);
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  await prisma.link.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}