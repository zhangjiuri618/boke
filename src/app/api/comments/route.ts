import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyAdmin } from '@/lib/auth-middleware';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const articleId = searchParams.get('articleId');

  if (articleId) {
    const comments = await prisma.comment.findMany({
      where: { articleId },
      orderBy: { createdAt: 'desc' },
      include: { author: { select: { id: true, name: true } } },
    });
    return NextResponse.json(comments);
  }

  const auth = await verifyAdmin(request);
  if (!auth.authenticated) {
    return NextResponse.json(
      { error: 'Unauthorized', message: '需要管理员权限' },
      { status: 401 }
    );
  }

  const comments = await prisma.comment.findMany({
    orderBy: { createdAt: 'desc' },
    include: { 
      author: { select: { id: true, name: true } },
      article: { select: { id: true, title: true } }
    },
  });
  return NextResponse.json(comments);
}

export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");

  if (!token) {
    return NextResponse.json(
      { success: false, message: '请先登录' },
      { status: 401 }
    );
  }

  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    const [userId] = decoded.split(":");

    const body = await request.json();
    const { articleId, content } = body;

    if (!articleId || !content) {
      return NextResponse.json(
        { success: false, message: '请填写完整信息' },
        { status: 400 }
      );
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        articleId,
        authorId: userId,
      },
      include: {
        author: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json({ success: true, comment });
  } catch (error) {
    console.error("Comment create error:", error);
    return NextResponse.json(
      { success: false, message: '评论失败' },
      { status: 500 }
    );
  }
}
