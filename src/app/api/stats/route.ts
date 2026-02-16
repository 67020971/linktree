import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const [linksCount, categoriesCount, clicksAgg, topLinks] = await Promise.all([
    prisma.link.count(),
    prisma.category.count(),
    prisma.link.aggregate({ _sum: { clicks: true } }),
    prisma.link.findMany({
      orderBy: { clicks: "desc" },
      take: 5,
      select: { id: true, title: true, clicks: true },
    }),
  ]);

  return NextResponse.json({
    linksCount,
    categoriesCount,
    totalClicks: clicksAgg._sum.clicks ?? 0,
    topLinks,
  });
}