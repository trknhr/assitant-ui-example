import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateTitle } from "@/lib/ai/generateTitle";

export async function POST(request: Request) {
  // Get params from the request (App Router API)
  // @ts-ignore
  const { params } = await request;
  const { messages } = await request.json();
  const title = await generateTitle(messages);
  await prisma.thread.update({ where: { id: params.id }, data: { title } });
  return NextResponse.json({ ok: true, title });
}
