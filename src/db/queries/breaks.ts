import { db } from "@/src/db";
import { breakLogTable } from "@/src/db/schema";
import { eq, desc, and, isNull, sql } from "drizzle-orm";

export type BreakInsert = typeof breakLogTable.$inferInsert;
export type BreakSelect = typeof breakLogTable.$inferSelect;

// Get all breaks for a user, ordered by most recent
export async function getBreaksByUserId(userId: string) {
  return db
    .select()
    .from(breakLogTable)
    .where(eq(breakLogTable.user_id, userId))
    .orderBy(desc(breakLogTable.break_start));
}

// Get today's breaks for a user
export async function getTodayBreaksByUserId(userId: string) {
  return db
    .select()
    .from(breakLogTable)
    .where(
      and(
        eq(breakLogTable.user_id, userId),
        sql`DATE(${breakLogTable.break_start}) = CURRENT_DATE`
      )
    )
    .orderBy(desc(breakLogTable.break_start));
}

// Get the active (ongoing) break for a user
export async function getActiveBreak(userId: string) {
  const result = await db
    .select()
    .from(breakLogTable)
    .where(
      and(
        eq(breakLogTable.user_id, userId),
        isNull(breakLogTable.break_end)
      )
    )
    .limit(1);
  return result[0] ?? null;
}

// Start a break
export async function startBreak(userId: string, breakType: string) {
  const result = await db
    .insert(breakLogTable)
    .values({
      user_id: userId,
      break_type: breakType,
      break_start: new Date(),
    })
    .returning();
  return result[0];
}

// End a break
export async function endBreak(breakId: string) {
  const breakRecord = await db
    .select()
    .from(breakLogTable)
    .where(eq(breakLogTable.break_id, breakId))
    .limit(1);

  if (!breakRecord[0] || !breakRecord[0].break_start) {
    return null;
  }

  const now = new Date();
  const start = new Date(breakRecord[0].break_start);
  const durationMs = now.getTime() - start.getTime();
  const durationSeconds = Math.floor(durationMs / 1000);
  const durationInterval = `${durationSeconds} seconds`;

  const result = await db
    .update(breakLogTable)
    .set({
      break_end: now,
      break_duration: durationInterval,
    })
    .where(eq(breakLogTable.break_id, breakId))
    .returning();
  return result[0];
}

// Get a single break by ID
export async function getBreakById(breakId: string) {
  const result = await db
    .select()
    .from(breakLogTable)
    .where(eq(breakLogTable.break_id, breakId))
    .limit(1);
  return result[0] ?? null;
}

// Delete a break
export async function deleteBreak(breakId: string) {
  const result = await db
    .delete(breakLogTable)
    .where(eq(breakLogTable.break_id, breakId))
    .returning();
  return result[0];
}
