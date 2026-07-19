import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface Props { params: Promise<{ id: string }> }

export async function GET(request: Request, { params }: Props) {
  const { id } = await params;

  const article = await prisma.article.findFirst({
    where: { id, published: true },
    include: { 
      category: true, 
      tags: { include: { tag: true } },
      author: { select: { id: true, name: true } },
    },
  });

  if (!article) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  await Promise.all([
    prisma.article.update({
      where: { id },
      data: { views: { increment: 1 } },
    }),
    prisma.view.create({
      data: { articleId: id },
    }),
  ]);

  return NextResponse.json(article);
}
