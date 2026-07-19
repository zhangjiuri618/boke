import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");

  if (!token) {
    return NextResponse.json({ authenticated: false });
  }

  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    const [userId] = decoded.split(":");

    const user = await prisma.user.findFirst({
      where: { id: userId },
      select: { id: true, name: true, email: true, role: true },
    });

    if (user) {
      return NextResponse.json({
        authenticated: true,
        username: user.name,
        email: user.email,
        role: user.role,
      });
    }
  } catch (error) {
    console.error("Auth me error:", error);
  }

  return NextResponse.json({ authenticated: false });
}