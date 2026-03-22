import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../generated/prisma";

const prismaClientSingleton = () => {
  const rawUrl = process.env.DATABASE_URL ?? "";

  // `mariadb` driver expects a PoolConfig — not `ssl-mode=REQUIRED` in the URL.
  // Parse the URL manually and configure SSL explicitly.
  const cleanUrl = rawUrl.replace(/[?&]ssl-mode=\w+/g, "");
  const requiresSsl = rawUrl.includes("ssl-mode=REQUIRED");
  const url = new URL(cleanUrl);

  // PrismaMariaDb accepts a PoolConfig directly and creates the pool internally
  const adapter = new PrismaMariaDb({
    host: url.hostname,
    port: Number(url.port) || 3306,
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: url.pathname.slice(1),
    connectionLimit: 10,
    acquireTimeout: 30000,
    connectTimeout: 10000,
    ssl: requiresSsl ? { rejectUnauthorized: false } : undefined,
  });

  return new PrismaClient({ adapter });
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

// Ensures we only create one PrismaClient instance during hot-reloads in dev
export const prisma = globalThis.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;

export type { Prisma, Role, User, Project, StrategicObjective, Kpi, KpiReport, Partner } from "../generated/prisma";
