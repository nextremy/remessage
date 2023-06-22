import { Type } from "@sinclair/typebox";
import { TypeCompiler } from "@sinclair/typebox/compiler";
import { randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../prisma/client";

const POSTBodyTypeCheck = TypeCompiler.Compile(
  Type.Object({
    username: Type.String(),
    password: Type.String(),
  }),
);

export async function POST(request: NextRequest) {
  const body = await request.json();
  if (!POSTBodyTypeCheck.Check(body)) {
    return NextResponse.json(null, { status: 400 });
  }
  const requestSessionId = request.cookies.get("session-id");
  if (requestSessionId) {
    return NextResponse.json(null, { status: 403 });
  }

  const user = await prisma.user.findUnique({
    select: {
      id: true,
      passwordHash: true,
      passwordSalt: true,
    },
    where: { username: body.username },
  });

  if (!user) return NextResponse.json(null, { status: 404 });

  const requestPasswordHash = scryptSync(body.password, user.passwordSalt, 32);
  if (!timingSafeEqual(requestPasswordHash, user.passwordHash)) {
    return NextResponse.json(null, { status: 401 });
  }

  const sessionId = randomBytes(64).toString("hex");
  await prisma.session.create({
    data: {
      id: sessionId,
      userId: user.id,
    },
  });

  return NextResponse.json(null, {
    status: 200,
    headers: { "Set-Cookie": `session-id=${sessionId};` },
  });
}
