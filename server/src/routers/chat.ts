import { z } from "zod";
import { db } from "../prisma/client";
import { protectedProcedure, router } from "../trpc";

export const chatRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        participants: z.array(z.object({ userId: z.string() })).length(2),
      }),
    )
    .mutation(async ({ input }) => {
      const participants = [
        { id: input.participants[0].userId },
        { id: input.participants[1].userId },
      ];
      await db.chat.create({
        data: { participants: { connect: participants } },
      });
    }),
});
