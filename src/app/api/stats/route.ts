import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const [articleCount, categoryCount, viewCount] = await Promise.all([
      prisma.article.count(),
      prisma.category.count(),
      prisma.view.count(),
    ]);

    return NextResponse.json({
      articleCount,
      categoryCount,
      viewCount,
    });
  } catch (error) {
    console.error("Stats error:", error);
    return NextResponse.json({
      articleCount: 0,
      categoryCount: 0,
      viewCount: 0,
    });
  }
}
