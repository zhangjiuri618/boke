import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function verifyAdmin(req: Request): Promise<{ authenticated: boolean; userId: string | null; role: string | null }> {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");

  if (!token) {
    return { authenticated: false, userId: null, role: null };
  }

  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    const [userId] = decoded.split(":");

    const user = await prisma.user.findFirst({
      where: { id: userId },
      select: { id: true, role: true },
    });

    if (user && user.role === "admin") {
      return { authenticated: true, userId: user.id, role: user.role };
    }
  } catch (error) {
    console.error("Auth middleware error:", error);
  }

  return { authenticated: false, userId: null, role: null };
}

export function createAdminMiddleware() {
  return async function middleware(req: Request): Promise<NextResponse | null> {
    const { authenticated } = await verifyAdmin(req);
    if (!authenticated) {
      return NextResponse.json(
        { error: "Unauthorized", message: "需要管理员权限" },
        { status: 401 }
      );
    }
    return null;
  };
}