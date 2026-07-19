import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: "请输入用户名和密码" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findFirst({
      where: { OR: [{ email: username }, { name: username }] },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "用户名或密码错误" },
        { status: 401 }
      );
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return NextResponse.json(
        { success: false, message: "用户名或密码错误" },
        { status: 401 }
      );
    }

    const token = Buffer.from(user.id + ":" + Date.now()).toString("base64");

    return NextResponse.json({
      success: true,
      token,
      username: user.name,
      role: user.role,
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "登录失败，请稍后重试" },
      { status: 500 }
    );
  }
}