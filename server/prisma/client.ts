import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

prisma.$queryRaw`PRAGMA journal_mode = WAL;`;

export default prisma;
