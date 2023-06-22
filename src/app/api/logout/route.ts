import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../prisma/client";

export async function POST(request: NextRequest) {
  const sessionId = request.cookies.get("session-id")?.value;
  if (sessionId === undefined) {
    return NextResponse.json(null, { status: 401 });
  }

  await prisma.session.delete({
    where: { id: sessionId },
  });

  return NextResponse.json(null, {
    status: 200,
    headers: { "Set-Cookie": `session-id=${sessionId}; Max-Age=0;` },
  });
}
