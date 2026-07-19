import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  const tags = await prisma.tag.findMany({
    orderBy: { name: 'asc' },
    include: {
      _count: { select: { articles: true } },
    },
  });

  const result = tags.map(tag => ({
    ...tag,
    count: tag._count.articles,
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

  const existing = await prisma.tag.findFirst({
    where: { OR: [{ name }, { slug }] },
  });

  if (existing) {
    return NextResponse.json(
      { success: false, message: '标签名称或别名已存在' },
      { status: 409 }
    );
  }

  const tag = await prisma.tag.create({
    data: { name, slug },
  });

  return NextResponse.json({ success: true, tag });
}
