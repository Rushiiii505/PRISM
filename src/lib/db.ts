import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import fs from "fs";
import path from "path";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const createPrismaClient = () => {
  let dbPath = process.env.DATABASE_URL?.replace("file:", "") || "./dev.db";

  // Handle Vercel serverless read-only filesystem for SQLite
  if (process.env.VERCEL && !process.env.DATABASE_URL) {
    const tmpPath = "/tmp/dev.db";
    if (!fs.existsSync(tmpPath)) {
      const origPath = path.join(process.cwd(), "dev.db");
      if (fs.existsSync(origPath)) {
        fs.copyFileSync(origPath, tmpPath);
      }
    }
    dbPath = tmpPath;
  }

  const adapter = new PrismaBetterSqlite3({ url: dbPath });
  return new PrismaClient({ adapter });
};

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
