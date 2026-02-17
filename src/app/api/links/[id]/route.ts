import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log("Deleting ID:", params.id);

    await prisma.link.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("DELETE ERROR FULL:", error);
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}
