import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const categoryId = searchParams.get('categoryId');
  const categorySlug = searchParams.get('categorySlug');
  const tagId = searchParams.get('tagId');
  const featured = searchParams.get('featured');

  const skip = (page - 1) * limit;

  const where: Record<string, any> = { published: true };

  if (categoryId) {
    where.categoryId = categoryId;
  }

  if (categorySlug) {
    const category = await prisma.category.findFirst({ where: { slug: categorySlug } });
    if (category) {
      where.categoryId = category.id;
    }
  }

  if (tagId) {
    where.tags = { some: { tagId } };
  }

  if (featured === 'true') {
    where.featured = true;
  }

  const [articles, total] = await Promise.all([
    prisma.article.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { 
        category: true, 
        tags: { include: { tag: true } },
        author: { select: { id: true, name: true } },
      },
      skip,
      take: limit,
    }),
    prisma.article.count({ where }),
  ]);

  return NextResponse.json({
    articles,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
}
