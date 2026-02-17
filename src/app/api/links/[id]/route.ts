import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // ✅ ต้อง await params ก่อน
    const { id } = await context.params;

    console.log("Deleting ID:", id);

    if (!id) {
      return NextResponse.json(
        { error: "Missing ID" },
        { status: 400 }
      );
    }

    await prisma.link.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("DELETE ERROR:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
