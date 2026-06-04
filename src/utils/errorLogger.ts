import { prisma } from "../lib/prisma";

export const logError = async (
  type: string,
  source: string,
  error: unknown,
  context?: Record<string, unknown>
) => {
  const err = error instanceof Error ? error : new Error(String(error));
  try {
    await prisma.errorLog.create({
      data: {
        type,
        source,
        message: err.message,
        stack: err.stack ?? null,
        context: context ? JSON.stringify(context) : null,
      },
    });
  } catch {
    console.error("[logError] Failed to write to DB:", err.message);
  }
};
