import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const link = await prisma.link.findUnique({ where: { id: params.id } });
  if (!link) {
    // จะทำหน้า 404 ก็ได้ แต่ใน route handler ใช้ Response ได้เช่นกัน
    return new Response("Not found", { status: 404 });
  }

  await prisma.link.update({
    where: { id: params.id },
    data: { clicks: { increment: 1 } },
  });

  // หมายเหตุ: production ควรตรวจสอบ url ว่าถูกต้อง/ปลอดภัย (กัน javascript: ฯลฯ)
  redirect(link.url);
}