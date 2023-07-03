import { z } from "zod";
import { db } from "../prisma/client";
import { protectedProcedure, router } from "../trpc";

export const chatRouter = router({
  get: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input, ctx }) => {
      const chat = await db.chat.upsert({
        select: { id: true, type: true },
        create: {
          type: "direct",
          users: { connect: [{ id: ctx.userId }, { id: input.userId }] },
        },
        update: {},
        where: { id: "" },
      });
      return chat;
    }),
});
