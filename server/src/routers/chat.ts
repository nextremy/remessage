import { z } from "zod";
import { db } from "../prisma/client";
import { protectedProcedure, router } from "../trpc";

export const chatRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        participants: z.array(z.object({ userId: z.string() })).length(1),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const participants = [
        { id: ctx.userId },
        { id: input.participants[0].userId },
      ];
      const chat = await db.chat.create({
        select: { id: true },
        data: { participants: { connect: participants } },
      });
      return chat;
    }),
});
