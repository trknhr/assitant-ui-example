import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const threads = await prisma.thread.findMany({
    orderBy: [{ archived: "asc" }, { updatedAt: "desc" }],
  });
  return NextResponse.json({
    threads: threads.map(t => ({
      status: t.archived ? "archived" : "regular",
      remoteId: t.id,
      title: t.title,
    })),
  });
}

export async function POST(req: Request) {
  const { id } = await req.json().catch(() => ({}));
  const thread = await prisma.thread.create({
    data: { ...(id ? { id } : {}) },
  });
  return NextResponse.json({ remoteId: thread.id });
}
