import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { username, email, password } = await req.json();

    if (!username || !email || !password) {
      return NextResponse.json(
        { success: false, message: "请填写完整信息" },
        { status: 400 }
      );
    }

    if (username.length < 3 || username.length > 20) {
      return NextResponse.json(
        { success: false, message: "用户名长度需在3-20个字符之间" },
        { status: 400 }
      );
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return NextResponse.json(
        { success: false, message: "用户名只能包含字母、数字和下划线" },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, message: "请输入有效的邮箱地址" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: "密码长度至少为6位" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { name: username }] },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "用户名或邮箱已被注册" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name: username,
        email,
        password: hashedPassword,
        role: "author",
      },
    });

    const token = Buffer.from(user.id + ":" + Date.now()).toString("base64");

    return NextResponse.json({
      success: true,
      token,
      username: user.name,
    });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { success: false, message: "注册失败，请稍后重试" },
      { status: 500 }
    );
  }
}