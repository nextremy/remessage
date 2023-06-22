import { Type } from "@sinclair/typebox";
import { TypeCompiler } from "@sinclair/typebox/compiler";
import { randomBytes, scryptSync } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../prisma/client";

const POSTBodyTypeCheck = TypeCompiler.Compile(
  Type.Object({
    username: Type.String({
      minLength: 1,
      maxLength: 16,
      pattern: "^[a-z0-9_]*$",
    }),
    password: Type.String({
      minLength: 8,
      maxLength: 256,
    }),
  }),
);

export async function POST(request: NextRequest) {
  const body = await request.json();
  if (!POSTBodyTypeCheck.Check(body)) {
    return NextResponse.json(null, { status: 400 });
  }

  const passwordSalt = randomBytes(32);
  const passwordHash = scryptSync(body.password, passwordSalt, 32);
  const user = await prisma.user.create({
    select: {
      id: true,
      username: true,
    },
    data: {
      username: body.username,
      passwordHash,
      passwordSalt,
    },
  });
  return NextResponse.json(user, { status: 201 });
}
