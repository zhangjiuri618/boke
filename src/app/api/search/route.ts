import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') || '';

  if (!q.trim()) {
    return NextResponse.json({ articles: [], total: 0 });
  }

  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const skip = (page - 1) * limit;

  const where = {
    published: true,
    OR: [
      { title: { contains: q } },
      { summary: { contains: q } },
      { content: { contains: q } },
    ],
  };

  const [articles, total] = await Promise.all([
    prisma.article.findMany({
      where,
      include: { category: true, author: { select: { id: true, name: true } } },
      orderBy: { views: 'desc' },
      skip,
      take: limit,
    }),
    prisma.article.count({ where }),
  ]);

  return NextResponse.json({
    articles,
    total,
    pagination: {
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
  });
}
