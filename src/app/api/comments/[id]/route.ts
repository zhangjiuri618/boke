import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyAdmin } from '@/lib/auth-middleware';

const prisma = new PrismaClient();

interface Props { params: Promise<{ id: string }> }

export async function DELETE(request: Request, { params }: Props) {
  const auth = await verifyAdmin(request);
  if (!auth.authenticated) {
    return NextResponse.json(
      { error: 'Unauthorized', message: '需要管理员权限' },
      { status: 401 }
    );
  }

  const { id } = await params;

  try {
    await prisma.comment.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Comment delete error:", error);
    return NextResponse.json(
      { success: false, message: '删除失败' },
      { status: 500 }
    );
  }
}
