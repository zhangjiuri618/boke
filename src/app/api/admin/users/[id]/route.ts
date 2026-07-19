import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyAdmin } from '@/lib/auth-middleware';
import bcrypt from 'bcrypt';

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
  const { name, email, role, password } = await request.json();

  if (id === 'admin-001' && role !== 'admin') {
    return NextResponse.json(
      { success: false, message: '不能修改超级管理员角色' },
      { status: 400 }
    );
  }

  const updateData: Record<string, any> = {};
  if (name) updateData.name = name;
  if (email) updateData.email = email;
  if (role) updateData.role = role;
  if (password) updateData.password = await bcrypt.hash(password, 10);

  const user = await prisma.user.update({
    where: { id },
    data: updateData,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      updatedAt: true,
    },
  });

  return NextResponse.json({ success: true, user });
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

  if (id === 'admin-001') {
    return NextResponse.json(
      { success: false, message: '不能删除超级管理员' },
      { status: 400 }
    );
  }

  await prisma.user.delete({ where: { id } });
  return NextResponse.json({ success: true });
}