import { z } from "zod";
import { db } from "../prisma/client";
import { protectedProcedure, router } from "../trpc";

export const directChatRouter = router({
  get: protectedProcedure
    .input(z.object({ userIds: z.array(z.string()).length(2) }))
    .query(async ({ input }) => {
      const chat = await db.$transaction(async (db) => {
        let chat = await db.chat.findFirst({
          select: { id: true, type: true, lastNotificationTimestamp: true },
          where: {
            type: "direct",
            AND: [
              { users: { some: { id: input.userIds[0] } } },
              { users: { some: { id: input.userIds[1] } } },
            ],
          },
        });
        if (!chat) {
          chat = await db.chat.create({
            select: { id: true, type: true, lastNotificationTimestamp: true },
            data: {
              type: "direct",
              users: {
                connect: [{ id: input.userIds[0] }, { id: input.userIds[1] }],
              },
            },
          });
        }
        return chat;
      });
      return chat;
    }),
});
