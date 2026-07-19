import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyAdmin } from '@/lib/auth-middleware';

const prisma = new PrismaClient();

interface Props { params: Promise<{ id: string }> }

export async function PUT(request: Request, { params }: Props) {
  const auth = await verifyAdmin(request);
  if (!auth.authenticated) {
    return NextResponse.json(
      { error: 'Unauthorized', message: '需要管理员权限' },
      { status: 401 }
    );
  }

  const { id } = await params;
  const body = await request.json();
  const { title, summary, content, coverImage, categoryId, published, featured, tags } = body;

  const updateData: Record<string, any> = {};
  if (title) updateData.title = title;
  if (summary !== undefined) updateData.summary = summary;
  if (content) updateData.content = content;
  if (coverImage !== undefined) updateData.coverImage = coverImage;
  if (categoryId) updateData.categoryId = categoryId;
  if (published !== undefined) updateData.published = published;
  if (featured !== undefined) updateData.featured = featured;

  if (tags !== undefined) {
    updateData.tags = {
      deleteMany: {},
      create: tags.map((tagId: string) => ({
        tag: { connect: { id: tagId } },
      })),
    };
  }

  const article = await prisma.article.update({
    where: { id },
    data: updateData,
    include: {
      category: true,
      tags: { include: { tag: true } },
      author: { select: { id: true, name: true } },
    },
  });

  return NextResponse.json({ success: true, article });
}

export async function DELETE(request: Request, { params }: Props) {
  const auth = await verifyAdmin(request);
  if (!auth.authenticated) {
    return NextResponse.json(
      { error: 'Unauthorized', message: '需要管理员权限' },
      { status: 401 }
    );
  }

  const { id } = await params;

  await prisma.articleTag.deleteMany({ where: { articleId: id } });
  await prisma.comment.deleteMany({ where: { articleId: id } });
  await prisma.view.deleteMany({ where: { articleId: id } });
  await prisma.article.delete({ where: { id } });

  return NextResponse.json({ success: true });
}

export async function GET(request: Request, { params }: Props) {
  const auth = await verifyAdmin(request);
  if (!auth.authenticated) {
    return NextResponse.json(
      { error: 'Unauthorized', message: '需要管理员权限' },
      { status: 401 }
    );
  }

  const { id } = await params;

  const article = await prisma.article.findFirst({
    where: { id },
    include: {
      category: true,
      tags: { include: { tag: true } },
      author: { select: { id: true, name: true } },
    },
  });

  if (!article) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json(article);
}
