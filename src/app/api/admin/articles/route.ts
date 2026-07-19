import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyAdmin } from '@/lib/auth-middleware';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const auth = await verifyAdmin(request);
  if (!auth.authenticated) {
    return NextResponse.json(
      { error: 'Unauthorized', message: '需要管理员权限' },
      { status: 401 }
    );
  }

  const body = await request.json();
  const { title, summary, content, coverImage, categoryId, featured, tags } = body;

  if (!title || !content || !categoryId) {
    return NextResponse.json(
      { success: false, message: '请填写标题、内容和分类' },
      { status: 400 }
    );
  }

  const article = await prisma.article.create({
    data: {
      title,
      summary: summary || '',
      content,
      coverImage,
      categoryId,
      authorId: auth.userId || 'admin-001',
      published: true,
      featured: featured || false,
      tags: tags
        ? {
            create: tags.map((tagId: string) => ({
              tag: { connect: { id: tagId } },
            })),
          }
        : undefined,
    },
    include: {
      category: true,
      tags: { include: { tag: true } },
      author: { select: { id: true, name: true } },
    },
  });

  return NextResponse.json({ success: true, article });
}

export async function GET(request: Request) {
  const auth = await verifyAdmin(request);
  if (!auth.authenticated) {
    return NextResponse.json(
      { error: 'Unauthorized', message: '需要管理员权限' },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const skip = (page - 1) * limit;
  const categoryId = searchParams.get('categoryId');
  const status = searchParams.get('status');

  const where: Record<string, any> = {};
  if (categoryId) where.categoryId = categoryId;
  if (status) where.published = status === 'published';

  const [articles, total] = await Promise.all([
    prisma.article.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { category: true, author: { select: { id: true, name: true } } },
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
