import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { title, archived } = await req.json();
  await prisma.thread.update({
    where: { id: params.id },
    data: {
      ...(title !== undefined ? { title } : {}),
      ...(archived !== undefined ? { archived } : {}),
    },
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  await prisma.thread.delete({ where: { id: params.id } }); // CASCADEでmessagesも削除
  return NextResponse.json({ ok: true });
}
