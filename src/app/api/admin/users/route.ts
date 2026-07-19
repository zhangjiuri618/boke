import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyAdmin } from '@/lib/auth-middleware';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const auth = await verifyAdmin(request);
  if (!auth.authenticated) {
    return NextResponse.json(
      { error: 'Unauthorized', message: '需要管理员权限' },
      { status: 401 }
    );
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return NextResponse.json(users);
}

export async function POST(request: Request) {
  const auth = await verifyAdmin(request);
  if (!auth.authenticated) {
    return NextResponse.json(
      { error: 'Unauthorized', message: '需要管理员权限' },
      { status: 401 }
    );
  }

  const { name, email, password, role } = await request.json();

  if (!name || !email || !password) {
    return NextResponse.json(
      { success: false, message: '请填写完整信息' },
      { status: 400 }
    );
  }

  const existingUser = await prisma.user.findFirst({
    where: { OR: [{ email }, { name }] },
  });

  if (existingUser) {
    return NextResponse.json(
      { success: false, message: '用户名或邮箱已存在' },
      { status: 409 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: role || 'author',
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  return NextResponse.json({ success: true, user });
}