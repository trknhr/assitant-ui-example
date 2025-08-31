import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Role } from "@/generated/prisma";

export async function GET(_req: Request, { params }: { params: { threadId: string } }) {
  const msgs = await prisma.message.findMany({
    where: { threadId: params.threadId },
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json({
    messages: msgs.map(m => ({
      role: m.role as "user" | "assistant" | "system",
      content: m.content,
      id: m.id,
      createdAt: m.createdAt,
    })),
  });
}

export async function POST(req: Request, { params }: { params: { threadId: string } }) {
  const { message } = await req.json();

//   await prisma.message.create({
//     data: {
//       id: message.id, // 省略時は自動採番（Prisma側 default(cuid())）
//       threadId: "",
//       role: message.role as Role,
//       content: message.content,
//       createdAt: message.createdAt ? new Date(message.createdAt) : undefined,
//    },
//   });

//   await prisma.thread.update({ where: { id: params.threadId }, data: {} });

  return NextResponse.json({ ok: true });
}
