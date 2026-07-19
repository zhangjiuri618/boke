import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
    include: {
      _count: { select: { articles: true } },
    },
  });

  const result = categories.map(cat => ({
    ...cat,
    count: cat._count.articles,
  }));

  return NextResponse.json(result);
}

export async function POST(request: Request) {
  const { name, slug } = await request.json();

  if (!name || !slug) {
    return NextResponse.json(
      { success: false, message: '请填写完整信息' },
      { status: 400 }
    );
  }

  const existing = await prisma.category.findFirst({
    where: { OR: [{ name }, { slug }] },
  });

  if (existing) {
    return NextResponse.json(
      { success: false, message: '分类名称或别名已存在' },
      { status: 409 }
    );
  }

  const category = await prisma.category.create({
    data: { name, slug },
  });

  return NextResponse.json({ success: true, category });
}
